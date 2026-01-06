import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cyber } from "../models/cyberAdmin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { CyberUser } from "../models/cyberUser.model.js";

// --- 1. ADMIN REGISTER ---
const adminregister = asyncHandler(async (req, res) => {
    const { Experience, Start_time, End_time, cyberKey, location } = req.body;

    if ([cyberKey, Experience, Start_time, End_time, location].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All required fields must be non-empty");
    }

    const cyber_shopPicpath = req.files?.cyber_shopPic?.[0]?.path;
    if (!cyber_shopPicpath) {
        throw new ApiError(400, "Cyber Shop Photo is required");
    }

    const cyber_shopPic = await uploadOnCloudinary(cyber_shopPicpath);
    if (!cyber_shopPic) throw new ApiError(500, "Image upload failed");

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingcyber = await Cyber.findOne({ "userInfo._id": req.user?._id, iscyber: true });
    if (existingcyber) throw new ApiError(409, "Cyber admin is already registered");

    const { password, refreshToken, ...cyberData } = user.toObject();

    const newCyberAdmin = await Cyber.create({
        Experience, Start_time, End_time, cyberKey, location,
        cyber_shopPic: { url: cyber_shopPic?.url || "", public_id: cyber_shopPic?.public_id || "" },
        iscyber: true,
        userInfo: cyberData
    });

    return res.status(201).json(new ApiResponse(201, newCyberAdmin, "Cyber Admin registered successfully"));
});

// --- 2. ADMIN LOGIN ---
const adminlogin = asyncHandler(async (req, res) => {
    const { cyberKey } = req.body;
    if (!cyberKey) throw new ApiError(400, "Cyber Key is required");

    const existingCyber = await Cyber.findOne({ cyberKey: cyberKey, iscyber: true });
    if (!existingCyber) throw new ApiError(401, "Invalid Cyber Key");

    return res.status(200).json(new ApiResponse(200, existingCyber, "Login Successful"));
});

// --- 3. GET PROFILE (Dashboard Header) ---
const getCyberProfile = asyncHandler(async (req, res) => {
    const cyberAdmin = await Cyber.findOne({ "userInfo._id": req.user?._id });
    if (!cyberAdmin) throw new ApiError(404, "Profile not found");
    return res.status(200).json(new ApiResponse(200, cyberAdmin, "Profile fetched"));
});

// --- 4. UPDATE PROFILE (Settings Page) ---
const updateCyberProfile = asyncHandler(async (req, res) => {
    const { Start_time, End_time, location, Experience } = req.body;
    const cyberAdmin = await Cyber.findOne({ "userInfo._id": req.user?._id });
    
    if (!cyberAdmin) throw new ApiError(404, "Admin not found");

    if (Start_time) cyberAdmin.Start_time = Start_time;
    if (End_time) cyberAdmin.End_time = End_time;
    if (location) cyberAdmin.location = location;
    if (Experience) cyberAdmin.Experience = Experience;

    if (req.files?.cyber_shopPic?.[0]?.path) {
        const uploadedImg = await uploadOnCloudinary(req.files.cyber_shopPic[0].path);
        if (uploadedImg) cyberAdmin.cyber_shopPic = { url: uploadedImg.url, public_id: uploadedImg.public_id };
    }

    await cyberAdmin.save();
    return res.status(200).json(new ApiResponse(200, cyberAdmin, "Profile Updated"));
});

// --- 5. GET ALL USERS (Table Data) ---
const getAllcyberUser = asyncHandler(async (req, res) => {
    const existcyber = await Cyber.findOne({ "userInfo._id": req.user?._id, iscyber: true });
    if (!existcyber) throw new ApiError(404, "Cyber Admin not found");

    // Agar users array Cyber model me hai:
    return res.status(200).json(new ApiResponse(200, existcyber.cyberUsers || [], "Users fetched"));
});

// --- 6. UPDATE STATUS (Select/Reject Action) ---
const CyberSumbit = asyncHandler(async (req, res) => {
    const { username, status } = req.body; // status: 'selected' or 'rejected'
    
    if (!username || !status) {
        throw new ApiError(400, "Username and Status are required");
    }

    const adminId = req.user?._id;

    // STEP 1: Admin ki Shop Dhundo
    const adminShop = await Cyber.findOne({ "userInfo._id": adminId });
    if (!adminShop) throw new ApiError(404, "Admin Shop not found");

    // STEP 2: Admin ke Array me Status Update karo (JS Logic + markModified)
    let userFoundInAdmin = false;

    // Array map karke modify karenge
    adminShop.cyberUsers = adminShop.cyberUsers.map(user => {
        // Match by username (Case insensitive)
        if (user.userInfo?.username?.toLowerCase() === username.toLowerCase()) {
            userFoundInAdmin = true;
            // Yahan status update kar rahe hain
            return { ...user, message: status, status: status }; 
        }
        return user;
    });

    if (!userFoundInAdmin) {
        throw new ApiError(404, "User not found in your application list");
    }

    // IMPORTANT: Mixed type array ke liye ye zaroori hai
    adminShop.markModified('cyberUsers');
    await adminShop.save();

    // STEP 3: Actual User Document (CyberUser) ko bhi update karo
    // Taaki User ke dashboard par bhi status change ho jaye
    await CyberUser.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } },
        { 
            $set: { 
                message: status, 
                status: status 
            } 
        }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, `User marked as ${status}`)
    );
});

// --- 7. DASHBOARD STATS (Cards) ---
const getDashboardStats = asyncHandler(async (req, res) => {
    const admin = await Cyber.findOne({ "userInfo._id": req.user?._id });
    if (!admin) throw new ApiError(404, "Admin not found");

    const users = admin.cyberUsers || [];
    const stats = {
        total: users.length,
        selected: users.filter(u => u.message === 'selected').length,
        pending: users.filter(u => u.message !== 'selected' && u.message !== 'rejected').length
    };

    return res.status(200).json(new ApiResponse(200, stats, "Stats fetched"));
});

export { 
    adminregister, 
    adminlogin, 
    getAllcyberUser, 
    CyberSumbit, 
    getCyberProfile, 
    updateCyberProfile, 
    getDashboardStats 
};