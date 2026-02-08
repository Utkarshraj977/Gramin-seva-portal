import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ComplaintUser } from "../models/complaintUser.model.js"; 
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Complaint } from "../models/complaint.model.js";

const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

// ==================================================
// 1. ✅ REGISTER USER (Only Key - No Complaint)
// ==================================================
const userregister = asyncHandler(async (req, res) => {
    const { ComplaintUserKey } = req.body;

    if (!ComplaintUserKey || ComplaintUserKey.trim() === "") {
        throw new ApiError(400, "Security PIN is required");
    }

    if (!/^\d{6}$/.test(ComplaintUserKey)) {
        throw new ApiError(400, "Security PIN must be a 6-digit number");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existing = await ComplaintUser.findOne({ userInfo: req.user._id });
    if (existing) {
        throw new ApiError(409, "You are already registered");
    }

    const newComplaintUser = await ComplaintUser.create({
        userInfo: req.user._id,
        ComplaintUserKey,
        isComplaintUser: true,
        myConnections: []
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};


    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, newComplaintUser, "Registration Successful!"));
});

// ==================================================
// 2. ✅ LOGIN USER
// ==================================================
const UserLogin = asyncHandler(async (req, res) => {
    const { ComplaintUserKey } = req.body;
    
    if (!ComplaintUserKey) throw new ApiError(400, "Security PIN required");

    const complaintUser = await ComplaintUser.findOne({ userInfo: req.user?._id });
    if (!complaintUser) throw new ApiError(404, "Please register first");

    const isKeyValid = await complaintUser.isKeyCorrect(ComplaintUserKey);
    if (!isKeyValid) throw new ApiError(401, "Invalid Security PIN");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.user._id);

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { success: true, accessToken, refreshToken }, "Login Successful"));
});

// ==================================================
// 3. ✅ SEND CONNECTION REQUEST TO ADMIN (WITH RETRY SUPPORT)
// ==================================================
const connectToAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const userId = req.user._id;

    // 1. Check if Admin exists
    const admin = await ComplaintAdmin.findById(adminId);
    if (!admin) throw new ApiError(404, "Official not found");

    // 2. Check if user is registered
    const complaintUser = await ComplaintUser.findOne({ userInfo: userId });
    if (!complaintUser) throw new ApiError(404, "Please register first");

    // 3. Check existing connection
    const existingConnection = complaintUser.myConnections.find(
        conn => conn.admin.toString() === adminId
    );
    
    // ✅ FIXED: Allow retry if status is Rejected
    if (existingConnection) {
        if (existingConnection.status === "Pending") {
            throw new ApiError(400, "Request already sent and pending");
        }
        if (existingConnection.status === "Accepted") {
            throw new ApiError(400, "Already connected with this official");
        }
        // If status is "Rejected", allow resending by updating the existing connection
        if (existingConnection.status === "Rejected") {
            // Update user's connection status to Pending
            existingConnection.status = "Pending";
            existingConnection.connectedAt = new Date();
            await complaintUser.save();

            // Update admin's request list
            const adminRequest = admin.connectionRequests.find(
                req => req.user.toString() === userId.toString()
            );
            
            if (adminRequest) {
                adminRequest.status = "Pending";
                adminRequest.requestedAt = new Date();
            } else {
                // If not found in admin's list, add new
                admin.connectionRequests.push({ 
                    user: userId, 
                    status: "Pending",
                    requestedAt: new Date()
                });
            }
            
            await admin.save();

            return res.status(200).json(
                new ApiResponse(200, {}, "Connection request sent again successfully")
            );
        }
    }

    // 4. Check if admin already has pending request from this user
    const adminHasRequest = admin.connectionRequests.find(
        req => req.user.toString() === userId.toString() && req.status === "Pending"
    );

    if (adminHasRequest) {
        throw new ApiError(400, "Request already sent");
    }

    // 5. Add NEW request to Admin's list
    admin.connectionRequests.push({ 
        user: userId, 
        status: "Pending",
        requestedAt: new Date()
    });
    await admin.save();

    // 6. Add to User's connection list
    complaintUser.myConnections.push({ 
        admin: adminId, 
        status: "Pending",
        connectedAt: new Date()
    });
    await complaintUser.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Connection request sent successfully")
    );
});

// ==================================================
// 4. ✅ FILE COMPLAINT (Only to Connected Admin)
// ==================================================
const fileComplaint = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { category, title, message, location } = req.body;

    if ([category, title, message, location].some(f => !f || f.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const complaintUser = await ComplaintUser.findOne({ userInfo: req.user._id });
    if (!complaintUser) throw new ApiError(404, "Please register first");

    const connection = complaintUser.myConnections.find(
        conn => conn.admin.toString() === adminId && conn.status === "Accepted"
    );

    if (!connection) {
        throw new ApiError(403, "You must be connected to this official to file a complaint");
    }

    let complaintImage = { url: "", public_id: "" };
    if (req.files?.complaintImage?.[0]?.path) {
        const uploaded = await uploadOnCloudinary(req.files.complaintImage[0].path);
        if (uploaded) {
            complaintImage = { url: uploaded.url, public_id: uploaded.public_id };
        }
    }

    const newComplaint = await Complaint.create({
        userInfo: req.user._id,
        adminInfo: adminId,
        category,
        title,
        message,
        location,
        complaintImage,
        status: "Pending"
    });

    return res.status(201).json(
        new ApiResponse(201, newComplaint, "Complaint filed successfully")
    );
});

// ==================================================
// 5. ✅ GET USER DASHBOARD
// ==================================================
const getUserDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const userDoc = await ComplaintUser.findOne({ userInfo: userId })
        .populate({
            path: 'myConnections.admin',
            populate: { path: 'userInfo', select: 'fullName email phone avatar' }
        });

    if (!userDoc) {
        throw new ApiError(404, "Please register first");
    }

    const myComplaints = await Complaint.find({ userInfo: userId })
        .populate('adminInfo', 'designation assignedWard userInfo')
        .populate({
            path: 'adminInfo',
            populate: { path: 'userInfo', select: 'fullName' }
        })
        .sort({ createdAt: -1 });

    const total = myComplaints.length;
    const pending = myComplaints.filter(c => c.status === "Pending").length;
    const resolved = myComplaints.filter(c => c.status === "Resolved").length;
    const rejected = myComplaints.filter(c => c.status === "Rejected").length;

    const connections = {
        pending: userDoc.myConnections.filter(c => c.status === "Pending"),
        accepted: userDoc.myConnections.filter(c => c.status === "Accepted"),
        rejected: userDoc.myConnections.filter(c => c.status === "Rejected")
    };

    const dashboardData = {
        complaints: myComplaints,
        stats: { total, pending, resolved, rejected },
        profile: req.user,
        connections
    };

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Dashboard data fetched")
    );
});

// ==================================================
// 6. ✅ DELETE/WITHDRAW COMPLAINT
// ==================================================
const deleteComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const complaint = await Complaint.findOne({ _id: id, userInfo: req.user._id });
    if (!complaint) throw new ApiError(404, "Complaint not found");

    if (complaint.status !== "Pending") {
        throw new ApiError(400, "Cannot withdraw complaint after processing");
    }

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Complaint withdrawn successfully")
    );
});

// ==================================================
// 7. ✅ GET COMPLAINT DETAILS
// ==================================================
const getComplaintDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id)
        .populate('userInfo', 'fullName email phone avatar')
        .populate({
            path: 'adminInfo',
            populate: { path: 'userInfo', select: 'fullName' }
        });
    
    if (!complaint) throw new ApiError(404, "Complaint not found");
    
    return res.status(200).json(
        new ApiResponse(200, complaint, "Details fetched")
    );
});

export {
    userregister,
    UserLogin,
    connectToAdmin,
    fileComplaint,
    getUserDashboard,
    deleteComplaint,
    getComplaintDetails
};