import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"
import { ComplaintUser } from "../models/complaintUser.model.js" 
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

// ============================================================================
// 1. ADMIN REGISTER 
// ============================================================================
const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    console.log(accessToken);
    
    return { accessToken, refreshToken }
}

// ============================================================================
// 1. ADMIN REGISTER 
// ============================================================================
const adminregister = asyncHandler(async (req, res) => {
    const { category, Start_time, End_time, ComplaintAdminKey, location, designation, assignedWard } = req.body
    
    if (
        [category, ComplaintAdminKey, Start_time, End_time, location].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");
    }

    const complaintAdmin_certificatepath = req.files?.complaintAdmin_certificate?.[0]?.path;
    
    if (!complaintAdmin_certificatepath) {
        throw new ApiError(400, "complaintAdmin_certificatepath is required");
    }

    const complaintAdmin_certificatePic = await uploadOnCloudinary(complaintAdmin_certificatepath);

    if (!complaintAdmin_certificatePic) throw new ApiError(500, "Certificate upload failed")

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingcomplaint = await ComplaintAdmin.findOne({
        userInfo: req.user?._id,
        iscomplaintAdmin: true
    });

    if (existingcomplaint) {
        throw new ApiError(409, "Complaint Admin is already registered");
    }

    const complaintAdminn = await ComplaintAdmin.create({
        category,
        Start_time,
        End_time,
        ComplaintAdminKey,
        location,
        designation: designation || "Gram Pradhan",
        assignedWard: assignedWard || "All",
        complaintAdmin_certificate: {
            url: complaintAdmin_certificatePic?.url || "",
            public_id: complaintAdmin_certificatePic?.public_id || "",
        },
        iscomplaintAdmin: true,
        userInfo: req.user._id 
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            complaintAdminn,
            "Complaint Admin registered successfully"
        ));
})

// ============================================================================
// 2. ADMIN LOGIN (Updated with Cookie Logic)
// ============================================================================
const adminlogin = asyncHandler(async (req, res) => {
    const { ComplaintAdminKey } = req.body;

    if (!ComplaintAdminKey || ComplaintAdminKey.trim() === "") {
        throw new ApiError(400, "Admin Key is required");
    }

    // 1. Find Admin Profile
    const admin = await ComplaintAdmin.findOne({
        userInfo: req.user._id, 
        iscomplaintAdmin: true
    });

    if (!admin) {
        throw new ApiError(404, "Admin profile not found. Please Register first.");
    }

    // 2. Check Key/Password
    const isPasswordValid = await admin.isKeyCorrect(ComplaintAdminKey);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Admin Key (Password Wrong)");
    }

    // 3. Generate NEW Tokens (Refresh Session)
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.user._id);

    // 4. Set Cookie Options (LOCALHOST SAFE)
    const options = {
        httpOnly: true,
        secure: false, // ⚠️ Localhost par FALSE rakhein
        sameSite: "lax", // ⚠️ Localhost par LAX rakhein
        path: "/" // Cookie puri site par available hogi
    };

    // 5. Send Response with Cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { admin, accessToken, refreshToken },
            "Admin Login successfully"
        ));
});
// ============================================================================
// 3. GET ALL COMPLAINTS 
// ============================================================================
const getAllcomplaint = asyncHandler(async (req, res) => {
    // FIX: Query corrected
    const admin = await ComplaintAdmin.findOne({ userInfo: req.user?._id });
    
    let filter = {};
    
    if (admin && admin.assignedWard && admin.assignedWard !== "All") {
        filter.location = { $regex: admin.assignedWard, $options: "i" };
    }

    const existcomplaint = await ComplaintUser.find(filter)
        .populate("userInfo", "fullName email phone avatar")
        .sort({ createdAt: -1 });
    
    // FIX: find() empty array return karta hai, jo true hota hai. Length check karo.
    if (!existcomplaint || existcomplaint.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No complaints found"));
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            existcomplaint, 
            "All complaints fetched successfully"
        )
    );
});

// ============================================================================
// 4. GET BY USERNAME 
// ============================================================================
const getbyusername = asyncHandler(async (req, res) => {
    const { username } = req.params; 

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing");
    }

    // Yahan hum populate karke check kar sakte hain kyunki username User model mein hai
    // Par findOne query complex ho jayegi. Better hai pehle User find karein.
    // Lekin abhi ke liye tumhara logic maintain karte hain, bas query fix kar rahe hain.
    
    // NOTE: Yeh query tabhi chalegi agar tumne aggregate lookup use kiya ho ya logic badla ho.
    // Simple findOne "userInfo.username" nested document par kaam nahi karega agar userInfo Ref ID hai.
    // FIX: Pehle User dhundho, fir Admin dhundho.
    
    const user = await User.findOne({ username: username.toLowerCase() });
    if(!user) throw new ApiError(404, "User not found");

    const updatedComplaint = await ComplaintAdmin.findOne({ userInfo: user._id })
        .populate("userInfo", "username fullName avatar email");

    if (!updatedComplaint) {
        throw new ApiError(404, "Complaint Admin not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedComplaint, "Admin found successfully")
    );
});

// ============================================================================
// 5. GET USER BY ID
// ============================================================================
const getuserbyid = asyncHandler(async (req, res) => {
    // FIX: Logic corrected
    const updatedComplaint = await ComplaintAdmin.findOne({ userInfo: req.user._id })
        .populate("userInfo", "fullName email avatar");

    if (!updatedComplaint) {
        throw new ApiError(404, "Complaint Admin not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedComplaint, "Admin details fetched successfully")
    );
});

// ============================================================================
// 6. RESOLVE COMPLAINT
// ============================================================================
const resolveComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { responseMessage } = req.body; 

    if (!id) throw new ApiError(400, "Complaint ID required");

    const updatedComplaint = await ComplaintUser.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "Resolved",
                adminResponse: responseMessage || "Issue has been resolved.",
                resolvedAt: new Date()
            }
        },
        { new: true }
    );

    if (!updatedComplaint) throw new ApiError(404, "Complaint not found");

    // FIX: Tumhare Schema mein 'resolvedComplaints' array nahi hai.
    // Agar add karna hai to Model update karo, abhi ke liye ise comment kar raha hu taaki crash na ho.
    /*
    await ComplaintAdmin.findOneAndUpdate(
        { userInfo: req.user?._id },
        { $push: { resolvedComplaints: updatedComplaint._id } }
    );
    */

    return res.status(200).json(
        new ApiResponse(200, updatedComplaint, "Complaint Resolved")
    );
});

// ============================================================================
// 7. REJECT COMPLAINT
// ============================================================================
const rejectComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!id) throw new ApiError(400, "Complaint ID required");

    const updatedComplaint = await ComplaintUser.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "Rejected",
                adminResponse: reason || "Complaint rejected by admin."
            }
        },
        { new: true }
    );

    if (!updatedComplaint) throw new ApiError(404, "Complaint not found");

    return res.status(200).json(
        new ApiResponse(200, updatedComplaint, "Complaint Rejected")
    );
});

// ============================================================================
// 8. ADMIN DASHBOARD STATS
// ============================================================================
const getAdminStats = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }

    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id });

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, null, "Admin profile not found"));
    }

    let filter = {};
    if (admin.assignedWard && admin.assignedWard.toLowerCase() !== "all") {
        filter.location = { $regex: admin.assignedWard, $options: "i" };
    }

    const [total, pending, resolved, inProgress] = await Promise.all([
        ComplaintUser.countDocuments(filter),
        ComplaintUser.countDocuments({ ...filter, status: "Pending" }),
        ComplaintUser.countDocuments({ ...filter, status: "Resolved" }),
        ComplaintUser.countDocuments({ ...filter, status: "In Progress" })
    ]);

    const requestsCount = admin.connectionRequests 
        ? admin.connectionRequests.filter(r => r.status === "Pending").length 
        : 0;

    const stats = {
        total,
        pending,
        resolved,
        inProgress,
        requests: requestsCount,
        ward: admin.assignedWard || "All"
    };

    return res.status(200).json(new ApiResponse(200, stats, "Stats fetched successfully"));
});

// ============================================================================
// 9. UPDATE ADMIN PROFILE
// ============================================================================
const updateAdminProfile = asyncHandler(async (req, res) => {
    const { location, Start_time, End_time, designation } = req.body;
    
    const updateFields = {};
    if (location) updateFields.location = location;
    if (Start_time) updateFields.Start_time = Start_time;
    if (End_time) updateFields.End_time = End_time;
    if (designation) updateFields.designation = designation;

    const updatedAdmin = await ComplaintAdmin.findOneAndUpdate(
        { userInfo: req.user?._id },
        { $set: updateFields },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedAdmin, "Profile Updated"));
});

// ==================================================
// 10. GET ALL OFFICIALS 
// ==================================================
const getAllOfficials = asyncHandler(async (req, res) => {
    const officials = await ComplaintAdmin.find({ iscomplaintAdmin: true })
        .select("designation assignedWard location Start_time End_time complaintAdmin_certificate.url userInfo")
        .populate("userInfo", "fullName avatar email phone");

    return res.status(200).json(
        new ApiResponse(200, officials, "Officials List Fetched")
    );
});

// ==================================================
// 11. CONNECTION REQUESTS
// ==================================================
const getConnectionRequests = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }

    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id })
        .populate("connectionRequests.user", "fullName email avatar phone");

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, [], "Admin profile not found"));
    }

    // ❌ PURANA CODE (Jo galti kar raha tha):
    // const requests = admin.connectionRequests.filter(r => r.status === "Pending"); 

    // ✅ NAYA CODE (Sahi wala): 
    // Saari requests bhejo, taaki Frontend par "Accepted" wale bhi dikhen
    const requests = admin.connectionRequests || [];

    return res.status(200).json(new ApiResponse(200, requests, "Connection requests fetched"));
});

// ==================================================
const handleConnectionRequest = asyncHandler(async (req, res) => {
    const { status, userId } = req.params; 
    const newStatus = status === 'accept' ? "Accepted" : "Rejected";

    // 1. Admin Document Dhundho
    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id });
    if (!admin) throw new ApiError(404, "Admin not found");

    // 2. Admin ke List mein Update karo
    const reqIndex = admin.connectionRequests.findIndex(r => r.user.toString() === userId);
    if (reqIndex > -1) {
        admin.connectionRequests[reqIndex].status = newStatus;
        await admin.save();
    }

    // 3. User ke List mein Update karo (CRITICAL FIX)
    // Hamein wo User dhundna hai jiske 'myConnections' mein ye Wala Admin ID hai
    // Note: admin._id use kar rahe hain (Document ID), req.user._id nahi
    
    await ComplaintUser.updateMany(
        { 
            userInfo: userId, 
            "myConnections.admin": admin._id 
        },
        { 
            $set: { "myConnections.$.status": newStatus } 
        }
    );

    return res.status(200).json(new ApiResponse(200, null, `Request ${newStatus}`));
});

export { 
    adminregister, 
    adminlogin, 
    getAllcomplaint, 
    getbyusername, 
    getuserbyid,
    resolveComplaint,
    rejectComplaint,
    getAdminStats,
    updateAdminProfile,
    getAllOfficials,
    getConnectionRequests,
    handleConnectionRequest
};