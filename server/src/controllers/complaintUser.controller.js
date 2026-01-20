import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ComplaintUser } from "../models/complaintUser.model.js"; 
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ==================================================
// 1. REGISTER COMPLAINT USER (First Time Setup & First Complaint)
// ==================================================
const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

// ==================================================
// 1. REGISTER COMPLAINT USER (With Auto-Login & Cookies)
// ==================================================
const userregister = asyncHandler(async (req, res) => {
    const { title, category, message, location, ComplaintUserKey } = req.body;

    if ([title, category, message, location, ComplaintUserKey].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required (Title, Category, Message, Location, Key)");
    }

    if (!/^\d{6}$/.test(ComplaintUserKey)) {
        throw new ApiError(400, "Security PIN must be a 6-digit number (e.g., 123456)");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    // Check if user has already filed a complaint before
    const existingComplaintUser = await ComplaintUser.findOne({ userInfo: req.user._id });
    if (existingComplaintUser) {
        throw new ApiError(409, "You are already registered. Please use 'Add Complaint' to file more.");
    }

    let complaintImage = { url: "", public_id: "" };
    
    // SAFE UPLOAD CHECK
    if (req.files?.complaintImage?.[0]?.path) {
        const localPath = req.files.complaintImage[0].path;
        const uploaded = await uploadOnCloudinary(localPath);
        if (uploaded) {
            complaintImage = { url: uploaded.url, public_id: uploaded.public_id };
        }
    }

    const newComplaint = await ComplaintUser.create({
        userInfo: req.user._id,
        ComplaintUserKey, 
        category,
        title,
        message,
        location,
        complaintImage,
        status: "Pending",
        isComplaintUser: true,
        myConnections: [] 
    });

    if (!newComplaint) {
        throw new ApiError(500, "Server Error: Registration failed.");
    }

    // ✅ FIX: Generate Tokens & Set Cookies immediately after Register
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true, // Localhost fix
        sameSite: "none",
        path: "/"
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, newComplaint, "Registration & Complaint Filed Successful!"));
});

// ==================================================
// 2. LOGIN USER (With Cookie Logic)
// ==================================================
const UserLogin = asyncHandler(async (req, res) => {
    const { ComplaintUserKey } = req.body;
    
    if (!ComplaintUserKey) throw new ApiError(400, "Security PIN required");

    // Find ANY complaint by this user to check the key
    const complaintUser = await ComplaintUser.findOne({ userInfo: req.user?._id });

    if (!complaintUser) throw new ApiError(404, "User not registered. Please register first.");

    const isKeyValid = await complaintUser.isKeyCorrect(ComplaintUserKey);
    
    if (!isKeyValid) throw new ApiError(401, "Invalid Security PIN");

    // ✅ FIX: Generate New Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.user._id);

    // ✅ FIX: Set Cookies
    const options = {
        httpOnly: true,
        secure: true, // Localhost fix
        sameSite: "none",
        path: "/"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { success: true, accessToken, refreshToken }, "Login Successful"));
});

// ==================================================
// 3. ADD NEW COMPLAINT (For Existing Users)
// ==================================================
const fileComplaint = asyncHandler(async (req, res) => {
    const { category, title, message, location, ComplaintUserKey } = req.body;

    if ([category, title, message, location, ComplaintUserKey].some((f) => !f || f.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user exists (Must have at least one previous complaint/registration)
    // We sort by createdAt to get the FIRST document (Original Registration) to match Key accurately
    const existingUser = await ComplaintUser.findOne({ userInfo: req.user?._id }).sort({ createdAt: 1 });
    
    if (!existingUser) throw new ApiError(404, "Please register first");

    // Verify PIN from the existing record
    const isKeyValid = await existingUser.isKeyCorrect(ComplaintUserKey);
    if (!isKeyValid) throw new ApiError(401, "Invalid Security PIN");

    let complaintImage = { url: "", public_id: "" };
    if (req.files?.complaintImage?.[0]?.path) {
        const uploaded = await uploadOnCloudinary(req.files.complaintImage[0].path);
        if (uploaded) {
            complaintImage = { url: uploaded.url, public_id: uploaded.public_id };
        }
    }

    // Important: Copy connections from existing user profile to new complaint 
    // taaki har document mein connections sync rahein (Optimization logic)
    const currentConnections = existingUser.myConnections || [];

    const newComplaint = await ComplaintUser.create({
        userInfo: req.user._id,
        ComplaintUserKey, // Storing key again (Redundant but works for your design)
        category,
        title,
        message,
        location,
        complaintImage,
        status: "Pending",
        isComplaintUser: true,
        myConnections: currentConnections 
    });

    return res.status(201).json(new ApiResponse(201, newComplaint, "New Complaint Filed Successfully"));
});

// ==================================================
// 4. GET MY DASHBOARD (History & Stats)
// ==================================================
const getUserDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const myComplaints = await ComplaintUser.find({ userInfo: userId })
        .sort({ createdAt: -1 });

    // Use the latest document or the first one for connections
    const userDocWithConnections = await ComplaintUser.findOne({ userInfo: userId });

    const total = myComplaints.length;
    const pending = myComplaints.filter(c => c.status === "Pending").length;
    const resolved = myComplaints.filter(c => c.status === "Resolved").length;
    const rejected = myComplaints.filter(c => c.status === "Rejected").length;

    const dashboardData = {
        complaints: myComplaints,
        stats: { total, pending, resolved, rejected },
        profile: req.user, // Main User Data
        connections: userDocWithConnections ? userDocWithConnections.myConnections : []
    };

    return res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard Data Fetched"));
});

// ==================================================
// 5. PUBLIC FEED
// ==================================================
const getAllPublicComplaints = asyncHandler(async (req, res) => {
    const complaints = await ComplaintUser.find({})
        .populate("userInfo", "fullName avatar")
        .sort({ createdAt: -1 })
        .limit(20);

    return res.status(200).json(new ApiResponse(200, complaints, "Public Feed Fetched"));
});

// ==================================================
// 6. DELETE COMPLAINT (Withdraw)
// ==================================================
const deleteComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const complaint = await ComplaintUser.findOne({ _id: id, userInfo: req.user._id });
    if (!complaint) throw new ApiError(404, "Complaint not found");

    if (complaint.status !== "Pending") {
        throw new ApiError(400, "Cannot withdraw complaint after it is processed");
    }

    await ComplaintUser.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, null, "Complaint Withdrawn"));
});

// ==================================================
// 7. GET DETAILS
// ==================================================
const getComplaintDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const complaint = await ComplaintUser.findById(id).populate("userInfo", "fullName email");
    if (!complaint) throw new ApiError(404, "Not Found");
    return res.status(200).json(new ApiResponse(200, complaint, "Details Fetched"));
});

// ==================================================
// 8. CONNECT TO ADMIN
// ==================================================
const connectToAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const userId = req.user._id;

    // 1. Check if Admin exists
    const admin = await ComplaintAdmin.findById(adminId);
    if (!admin) throw new ApiError(404, "Official not found");

    // 2. Check if already applied (in Admin's list)
    // admin.connectionRequests undefined ho sakta hai agar schema naya hai, so default [] check
    const requests = admin.connectionRequests || [];
    const existingRequest = requests.find(
        (req) => req.user.toString() === userId.toString()
    );
    
    if (existingRequest) throw new ApiError(400, "Request already sent or status is pending");

    // 3. Update Admin's List
    admin.connectionRequests.push({ user: userId, status: "Pending" });
    await admin.save();

    // 4. Update User's List (Update ALL documents for this user to keep in sync)
    // Kyunki tumhare design me User ke pass multiple documents hain
    await ComplaintUser.updateMany(
        { userInfo: userId },
        { 
            $push: { 
                myConnections: { admin: adminId, status: "Pending" } 
            } 
        }
    );

    return res.status(200).json(new ApiResponse(200, {}, "Request Sent Successfully"));
});

export {
    userregister,
    UserLogin,
    fileComplaint,
    getUserDashboard,
    getAllPublicComplaints,
    deleteComplaint,
    getComplaintDetails,
    connectToAdmin
};