import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"
import { ComplaintUser } from "../models/complaintUser.model.js" 
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { Complaint } from "../models/complaint.model.js"

const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    
    return { accessToken, refreshToken }
}

// ============================================================================
// 1. ADMIN REGISTER 
// ============================================================================
const adminregister = asyncHandler(async (req, res) => {
    const { category, Start_time, End_time, ComplaintAdminKey, location, designation, assignedWard, department } = req.body
    
    if (
        [ComplaintAdminKey, Start_time, End_time, location].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");
    }

    const complaintAdmin_certificatepath = req.files?.complaintAdmin_certificate?.[0]?.path;
    
    if (!complaintAdmin_certificatepath) {
        throw new ApiError(400, "Certificate is required");
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
        throw new ApiError(409, "Admin profile already exists");
    }

    const complaintAdminn = await ComplaintAdmin.create({
        Start_time,
        End_time,
        ComplaintAdminKey,
        location,
        designation: designation || "Gram Pradhan",
        assignedWard: assignedWard || "All",
        department: department || "General",
        complaintAdmin_certificate: {
            url: complaintAdmin_certificatePic?.url || "",
            public_id: complaintAdmin_certificatePic?.public_id || "",
        },
        iscomplaintAdmin: true,
        userInfo: req.user._id,
        connectionRequests: [] // ✅ Initialize empty array
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            complaintAdminn,
            "Admin registered successfully"
        ));
})

// ============================================================================
// 2. ADMIN LOGIN
// ============================================================================
const adminlogin = asyncHandler(async (req, res) => {
    const { ComplaintAdminKey } = req.body;

    if (!ComplaintAdminKey || ComplaintAdminKey.trim() === "") {
        throw new ApiError(400, "Admin Key is required");
    }

    const admin = await ComplaintAdmin.findOne({
        userInfo: req.user._id, 
        iscomplaintAdmin: true
    });

    if (!admin) {
        throw new ApiError(404, "Admin profile not found. Please register first.");
    }

    const isPasswordValid = await admin.isKeyCorrect(ComplaintAdminKey);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Admin Key");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { admin, accessToken, refreshToken },
            "Admin login successful"
        ));
});

// ============================================================================
// 3. ✅ GET ALL COMPLAINTS (From Connected Users Only)
// ============================================================================
const getAllcomplaint = asyncHandler(async (req, res) => {
    const admin = await ComplaintAdmin.findOne({ userInfo: req.user?._id });
    
    if (!admin) throw new ApiError(404, "Admin profile not found");

    // Get IDs of accepted connections (connected users)
    const connectedUserIds = admin.connectionRequests
        .filter(req => req.status === "Accepted")
        .map(req => req.user);

    // Build filter
    let filter = { 
        userInfo: { $in: connectedUserIds },
        adminInfo: admin._id
    };
    
    // If admin has specific ward assignment
    if (admin.assignedWard && admin.assignedWard !== "All") {
        filter.location = { $regex: admin.assignedWard, $options: "i" };
    }

    const complaints = await Complaint.find(filter)
        .populate("userInfo", "fullName email phone avatar")
        .sort({ createdAt: -1 });
    
    if (!complaints || complaints.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No complaints found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, complaints, "Complaints fetched successfully")
    );
});

// ============================================================================
// 4. ✅ GET CONNECTION REQUESTS
// ============================================================================
const getConnectionRequests = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }

    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id })
        .populate("connectionRequests.user", "fullName email avatar phone");

    if (!admin) {
        return res.status(404).json(
            new ApiResponse(404, [], "Admin profile not found")
        );
    }

    // Return all requests (frontend will filter)
    const requests = admin.connectionRequests || [];

    return res.status(200).json(
        new ApiResponse(200, requests, "Connection requests fetched")
    );
});

// ============================================================================
// 5. ✅ HANDLE CONNECTION REQUEST (Accept/Reject)
// ============================================================================
const handleConnectionRequest = asyncHandler(async (req, res) => {
    const { status, userId } = req.params; 
    const newStatus = status === 'accept' ? "Accepted" : "Rejected";

    // 1. Find Admin
    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id });
    if (!admin) throw new ApiError(404, "Admin not found");

    // 2. Update in Admin's list
    const reqIndex = admin.connectionRequests.findIndex(
        r => r.user.toString() === userId
    );
    
    if (reqIndex === -1) {
        throw new ApiError(404, "Request not found");
    }

    admin.connectionRequests[reqIndex].status = newStatus;
    await admin.save();

    // 3. Update in User's list
    const complaintUser = await ComplaintUser.findOne({ userInfo: userId });
    
    if (complaintUser) {
        const connIndex = complaintUser.myConnections.findIndex(
            c => c.admin.toString() === admin._id.toString()
        );
        
        if (connIndex !== -1) {
            complaintUser.myConnections[connIndex].status = newStatus;
            await complaintUser.save();
        }
    }

    return res.status(200).json(
        new ApiResponse(200, null, `Request ${newStatus}`)
    );
});

// ============================================================================
// 6. GET ADMIN PROFILE
// ============================================================================
const getuserbyid = asyncHandler(async (req, res) => {
    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id })
        .populate("userInfo", "fullName email avatar phone");

    if (!admin) {
        throw new ApiError(404, "Admin profile not found");
    }

    return res.status(200).json(
        new ApiResponse(200, admin, "Admin profile fetched")
    );
});

// ============================================================================
// 7. RESOLVE COMPLAINT
// ============================================================================
const resolveComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { responseMessage } = req.body; 

    if (!id) throw new ApiError(400, "Complaint ID required");

    const updatedComplaint = await Complaint.findByIdAndUpdate(
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

    return res.status(200).json(
        new ApiResponse(200, updatedComplaint, "Complaint resolved")
    );
});

// ============================================================================
// 8. REJECT COMPLAINT
// ============================================================================
const rejectComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!id) throw new ApiError(400, "Complaint ID required");

    const updatedComplaint = await Complaint.findByIdAndUpdate(
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
        new ApiResponse(200, updatedComplaint, "Complaint rejected")
    );
});

// ============================================================================
// 9. ADMIN DASHBOARD STATS
// ============================================================================
const getAdminStats = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }

    const admin = await ComplaintAdmin.findOne({ userInfo: req.user._id });

    if (!admin) {
        return res.status(404).json(
            new ApiResponse(404, null, "Admin profile not found")
        );
    }

    // Get connected user IDs
    const connectedUserIds = admin.connectionRequests
        .filter(req => req.status === "Accepted")
        .map(req => req.user);

    let filter = { 
        userInfo: { $in: connectedUserIds },
        adminInfo: admin._id
    };
    
    if (admin.assignedWard && admin.assignedWard.toLowerCase() !== "all") {
        filter.location = { $regex: admin.assignedWard, $options: "i" };
    }

    const [total, pending, resolved, inProgress] = await Promise.all([
        Complaint.countDocuments(filter),
        Complaint.countDocuments({ ...filter, status: "Pending" }),
        Complaint.countDocuments({ ...filter, status: "Resolved" }),
        Complaint.countDocuments({ ...filter, status: "In Progress" })
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

    return res.status(200).json(
        new ApiResponse(200, stats, "Stats fetched successfully")
    );
});

// ============================================================================
// 10. UPDATE ADMIN PROFILE
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

    return res.status(200).json(
        new ApiResponse(200, updatedAdmin, "Profile updated")
    );
});

// ==================================================
// 11. GET ALL OFFICIALS (Public Route)
// ==================================================
const getAllOfficials = asyncHandler(async (req, res) => {
    const officials = await ComplaintAdmin.find({ iscomplaintAdmin: true })
        .select("designation assignedWard location Start_time End_time department complaintAdmin_certificate.url userInfo")
        .populate("userInfo", "fullName avatar email phone");

    return res.status(200).json(
        new ApiResponse(200, officials, "Officials list fetched")
    );
});

export { 
    adminregister, 
    adminlogin, 
    getAllcomplaint, 
    getuserbyid,
    resolveComplaint,
    rejectComplaint,
    getAdminStats,
    updateAdminProfile,
    getAllOfficials,
    getConnectionRequests,
    handleConnectionRequest
};