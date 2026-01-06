import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { CyberUser } from "../models/cyberUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cyber } from "../models/cyberAdmin.model.js";
import mongoose from "mongoose";  // <--- YE LINE ADD KAREIN

// ============================================================================
// 1. REGISTER CYBER USER (Profile Creation)
// ============================================================================
const registerCyberUser = asyncHandler(async (req, res) => {
    const { message, Start_time, End_time, location, cyberUserKey } = req.body;

    // 1. Validation
    if (!message || !cyberUserKey || !Start_time || !End_time) {
        throw new ApiError(400, "All fields (Message, Key, Time, Location) are required");
    }

    // 2. Find authenticated user
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    // 3. Check if already registered
    const existingCyberUser = await CyberUser.findOne({
        "userInfo._id": req.user?._id,
        iscyberUser: true
    });

    if (existingCyberUser) {
        throw new ApiError(409, "You are already registered as a Cyber User");
    }

    // 4. Create Cyber Profile (Remove sensitive user data)
    const { password, refreshToken, ...safeUserData } = user.toObject();

    const newCyberUser = await CyberUser.create({
        message,        // e.g., "Need urgent printout"
        Start_time,
        End_time,
        location,
        iscyberUser: true,
        cyberUserKey,
        userInfo: safeUserData
    });

    return res.status(201).json(
        new ApiResponse(201, newCyberUser, "Cyber User profile created successfully")
    );
});

// ============================================================================
// 2. LOGIN CYBER USER (Verify Key)
// ============================================================================
const loginCyberUser = asyncHandler(async (req, res) => {
    const { cyberUserKey } = req.body;

    if (!cyberUserKey) throw new ApiError(400, "Cyber User Key is required");

    const existingUser = await CyberUser.findOne({
        "userInfo._id": req.user?._id,
        iscyberUser: true
    });

    // Security Check: Key match honi chahiye
    if (!existingUser || existingUser.cyberUserKey !== cyberUserKey) {
        throw new ApiError(401, "Invalid Cyber Key or Profile not found");
    }

    return res.status(200).json(
        new ApiResponse(200, existingUser, "Login successful")
    );
});

// ============================================================================
// 3. GET MY PROFILE (For Dashboard Header)
// ============================================================================
const getCyberUserProfile = asyncHandler(async (req, res) => {
    const myProfile = await CyberUser.findOne({ "userInfo._id": req.user?._id });

    if (!myProfile) {
        throw new ApiError(404, "Profile not found. Please register first.");
    }

    return res.status(200).json(
        new ApiResponse(200, myProfile, "Profile fetched successfully")
    );
});

// ============================================================================
// 4. GET ALL CYBER SHOPS (For Selection List)
// ============================================================================
const getAllCyberAdmins = asyncHandler(async (req, res) => {
    // Sirf 'Cyber Admins' ko fetch karein
    const allShops = await Cyber.find({ iscyber: true });

    if (!allShops || allShops.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No Cyber Shops found nearby"));
    }

    return res.status(200).json(
        new ApiResponse(200, allShops, "All Cyber Shops fetched successfully")
    );
});

// ============================================================================
// 5. APPLY TO A SHOP (Send Request)
// ============================================================================
const applyToCyber = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    const userId = req.user?._id;

    if (!username?.trim()) throw new ApiError(400, "Admin Username is missing");

    // 1. Current User Profile nikalo
    // .lean() use karein taaki hum object modify kar sakein
    let currentUserProfile = await CyberUser.findOne({ "userInfo._id": userId }).lean();
    
    if (!currentUserProfile) throw new ApiError(404, "Please register first");

    // 2. Data ko modify karein (Admin ke paas bhejne se pehle)
    // Ye zaroori hai taaki Admin ko 'Pending' dikhe, na ki purana 'Rejected'
    currentUserProfile.message = "pending";
    currentUserProfile.status = "pending";

    // 3. Admin dhundo
    const cleanUsername = username.trim().replace(/,+$/, "").toLowerCase();
    
    // 4. Admin ki list mein ye NEW 'pending' wala profile add karo
    const updateCyberAdmin = await Cyber.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + cleanUsername + "$", "i") } },
        { 
            $addToSet: { cyberUsers: currentUserProfile } 
        }, 
        { new: true }
    );
    
    if (!updateCyberAdmin) throw new ApiError(404, "Shop not found");

    // 5. User ka khud ka database document bhi update karo
    await CyberUser.findOneAndUpdate(
        { "userInfo._id": userId },
        { 
            $set: { 
                status: "pending", 
                message: "pending" 
            } 
        }
    );

    return res.status(200).json(
        new ApiResponse(200, updateCyberAdmin, "Application sent successfully!")
    );
});

// ============================================================================
// 6. WITHDRAW APPLICATION (Cancel Request) - NEW FEATURE 🚀
// ============================================================================
const withdrawApplication = asyncHandler(async (req, res) => {
    const { adminUsername } = req.body;
    const userId = req.user?._id;

    if (!adminUsername) throw new ApiError(400, "Admin Username is required");

    // 1. Current User ko fetch karein username ke liye
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new ApiError(404, "User not found");

    console.log(`User '${currentUser.username}' withdrawing from '${adminUsername}'`);

    // 2. Shop (Admin) ko fetch karein
    const shop = await Cyber.findOne({ 
        "userInfo.username": { $regex: new RegExp("^" + adminUsername + "$", "i") } 
    });

    if (!shop) throw new ApiError(404, "Shop not found");

    // DEBUG: Dekhte hain database me asal me kya save hai
    // Console me check karna ki 'cyberUsers' array kaisa dikhta hai
    // console.log("Current Shop Users:", JSON.stringify(shop.cyberUsers, null, 2));

    // 3. JAVASCRIPT FILTERING (Sabse Safe Tareeka)
    // Hum array me se us item ko filter out karenge jiska username match karega
    const initialLength = shop.cyberUsers.length;

    const updatedUsersList = shop.cyberUsers.filter((userItem) => {
        // Hame check karna hai ki userItem ke andar username kaha chupa hai
        // Structure aksar userItem.userInfo.username hota hai
        
        const storedUsername = userItem?.userInfo?.username || userItem?.username;
        
        // Agar username match nahi karta, toh list me rakho. Match karta hai toh hata do.
        // Hum lowercase comparison karenge taaki Rahul vs rahul ka issue na ho
        return storedUsername?.toLowerCase() !== currentUser.username.toLowerCase();
    });

    // 4. Check karein ki kya kuch remove hua?
    if (updatedUsersList.length === initialLength) {
        console.log("DEBUG: Username match nahi hua. Manual check required.");
        console.log("Looking for:", currentUser.username);
        console.log("Available inside DB:", shop.cyberUsers.map(u => u?.userInfo?.username));
        
        throw new ApiError(400, "You are not in the application list of this shop.");
    }

    // 5. Nayi list ko save karein
    shop.cyberUsers = updatedUsersList;
    
    // Mongoose ko batana padta hai ki Mixed type change hua hai
    shop.markModified('cyberUsers'); 
    
    await shop.save();

    return res.status(200).json(
        new ApiResponse(200, shop, "Application withdrawn successfully")
    );
});
export {
    registerCyberUser,
    loginCyberUser,
    getCyberUserProfile,
    getAllCyberAdmins,
    applyToCyber,
    withdrawApplication
};