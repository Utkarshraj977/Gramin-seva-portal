import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TravellingUser } from "../models/travellingUser.model.js";
import { TravellingAdmin } from "../models/travellingAdmin.model.js";
import mongoose from "mongoose";

// Traveller Register - Updated to remove from/to/message checks
const TravellingUserRegister = asyncHandler(async (req, res) => {
    const { TravellingUserKey, location } = req.body;

    // Validate only existing fields
    if (!TravellingUserKey) {
        throw new ApiError(400, "TravellingUserKey is required");
    }

    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    if (!/^\d{6}$/.test(TravellingUserKey)) {
        throw new ApiError(400, "TravellingUserKey must be exactly 6 digits");
    }

    const existeduser = await TravellingUser.findOne({ userInfo: user });
    if (existeduser) throw new ApiError(409, "TravellingUser is already registered");

    const createdTravellingUser = await TravellingUser.create({
        TravellingUserKey,
        location: location || "", // optional
        userInfo: user
    });

    const fullTravellingUser = await createdTravellingUser.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, { Traveller: fullTravellingUser }, "Travelling User registered successfully"));
});

// Traveller Login
const TravellingLogin = asyncHandler(async (req, res) => {
    const { TravellingUserKey } = req.body;
    const user = req.user?._id;

    if (!user) throw new ApiError(404, "User not found");
    if (!TravellingUserKey) throw new ApiError(401, "Travelling key required");

    const Travelling = await TravellingUser.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!Travelling) throw new ApiError(401, "Unauthorized access");

    const isValid = await Travelling.isTravellingkeyvalid(TravellingUserKey);
    if (!isValid) throw new ApiError(401, "Invalid Travelling credentials");

    Travelling.TravellingUserKey = undefined;

    return res
        .status(200)
        .json(new ApiResponse(200, Travelling, "Login successful"));
});

// User Joins Admin (Request Ride) - Updated to link Admin ID to User's AllRide
const setuserIntoadmin = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const admin_id = req.params.id;

    if (!user) throw new ApiError(404, "User not found");

    // 1. Fetch Traveller (Populated for checks, but we need to be careful saving it)
    const travelUser = await TravellingUser.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!travelUser) throw new ApiError(404, "Traveller profile not found. Please register first.");

    // 2. Prevent joining if already in a ride
    // Check if AllRide is set (handling both ObjectId and String formats)
    if (travelUser.AllRide) {
        throw new ApiError(400, "You are already in a ride. Cancel it first.");
    }

    // 3. Prepare the object for the Admin's list
    const userObj = travelUser.toObject();
    
    // --- CRITICAL FIX START ---
    // Since we populated 'userInfo' above, userObj.userInfo is a full object.
    // We must reset it to just the ID so the database stays clean and cancel works.
    userObj.userInfo = user; 
    // --- CRITICAL FIX END ---

    userObj.status = "pending"; 
    // Remove internal Mongoose fields that shouldn't be in the Admin's array
    delete userObj._id; 
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.AllRide; // Don't save the ride info inside the ride itself (circular)

    // 4. Add to Admin's list
    const admin = await TravellingAdmin.findByIdAndUpdate(
        admin_id,
        { $addToSet: { AllTraveller: userObj } },
        { new: true }
    ).populate("userInfo", "username fullname coverImage email phone avatar");

    if (!admin) throw new ApiError(404, "Driver not found");

    // 5. Link Admin to User's AllRide field
    travelUser.AllRide = admin._id;
    await travelUser.save(); // <--- This is what fixes the "You have no active rides" error

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                admin,
                "Request sent to driver successfully"
            )
        );
});

const cancelRide = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(404, "User not found in request");

    // 1. Find the traveller
    const travelUser = await TravellingUser.findOne({ userInfo: userId });
    
    if (!travelUser) {
        throw new ApiError(404, "Traveller profile not found");
    }

    console.log("Attempting cancel for user:", userId);
    console.log("Current AllRide value:", travelUser.AllRide);

    const adminId = travelUser.AllRide;

    // Check if they are actually in a ride
    if (!adminId) {
        throw new ApiError(400, "No active ride found to cancel");
    }

    // 2. Remove user from Admin's list
    // We use try/catch here because if the Admin doesn't exist (deleted), 
    // we still want to clear the user's status so they aren't stuck.
    try {
        const updateResult = await TravellingAdmin.findByIdAndUpdate(
            adminId,
            { 
                // This specifically looks for an item in the array where userInfo matches the ID
                $pull: { AllTraveller: { userInfo: userId } } 
            },
            { new: true }
        );
        console.log("Admin update result:", updateResult ? "Success" : "Admin not found");
    } catch (error) {
        console.error("Error removing from Admin (proceeding anyway):", error);
    }

    // 3. Clear AllRide from User
    // Use 'null', not 'undefined' for Mongoose references
    travelUser.AllRide = null; 
    await travelUser.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Ride canceled successfully"));
});

// Get Traveller User
const travelleruser = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(400, "User ID not found");

    const travelleruser = await TravellingUser.findOne({ userInfo: user })
        .select("-TravellingUserKey")
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .populate("AllRide"); // Populate ride info if they have one

    if (!travelleruser) throw new ApiError(404, "Traveller user not found");

    return res
        .status(200)
        .json(new ApiResponse(200, travelleruser, "Fetched successfully"));
});

export { 
    TravellingUserRegister, 
    TravellingLogin, 
    setuserIntoadmin, 
    travelleruser, 
    cancelRide 
};
