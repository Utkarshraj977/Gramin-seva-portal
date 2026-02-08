import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TravellingAdmin } from "../models/travellingAdmin.model.js";
import { User } from "../models/user.model.js";
import { TravellingUser } from "../models/travellingUser.model.js"; // Added import
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { log } from "console";

// Traveller Admin (Car Owner) Register
const travellingAdminReg = asyncHandler(async (req, res) => {
    const { carNumber, category, TravellingAdminKey, location, Type } = req.body;

    if ([carNumber, category, TravellingAdminKey, location, Type].some(
        (field) => typeof field !== "string" || field.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    if (!/^\d{6}$/.test(TravellingAdminKey)) {
        throw new ApiError(400, "TravellingAdminKey must be exactly 6 digits (numbers only)");
    }

    const existedUser = await TravellingAdmin.findOne({ userInfo: user._id });
    if (existedUser) throw new ApiError(409, "Traveller Admin is already registered");

    const Driver_License = req.files?.Driver_License?.[0]?.path;
    const CarPhoto = req.files?.CarPhoto?.[0]?.path;
    if (!CarPhoto) throw new ApiError(400, "Car photo is required");

    let upload1 = null;
    if (Driver_License) {
        upload1 = await uploadOnCloudinary(Driver_License);
        if (!upload1) throw new ApiError(400, "Driver License upload failed");
    }

    const upload = await uploadOnCloudinary(CarPhoto);
    if (!upload) throw new ApiError(400, "Car photo upload failed");

    let createdTraveller = await TravellingAdmin.create({
        userInfo: user._id,
        carNumber,
        category: category.trim(),
        TravellingAdminKey,
        location,
        Type,
        CarPhoto: upload.url,
        Driver_License: upload1 ? upload1.url : null,
        isTravellingAdmin: true,
    });

    createdTraveller = await createdTraveller.populate(
        "userInfo",
        "username fullname coverImage email phone avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            { traveller: createdTraveller },
            "Traveller Admin registered successfully"
        )
    );
});

// Traveller Admin login
const travellerAdminLogin = asyncHandler(async (req, res) => {
    const { TravellingAdminKey } = req.body;
    const user = req.user?._id;

    if (!user) throw new ApiError(404, "user not found");
    if (!TravellingAdminKey) throw new ApiError(401, "Trevelling Admin Key is Required");

    const travellerAdmin = await TravellingAdmin.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar");
    if (!travellerAdmin) throw new ApiError(404, "Traveller Admin not found");

    const istravellervalid = await travellerAdmin.isTravellerKeyCorrect(TravellingAdminKey);
    if (!istravellervalid) throw new ApiError(401, "unauthorized access");

    return res.status(200).json(
        new ApiResponse(200, { travellerAdmin }, "Traveller admin login succesfully")
    );
});

// Get all Traveller Admin 
const allTravellerAdmin = asyncHandler(async (req, res) => {
    const Alladmin = await TravellingAdmin.find().populate("userInfo", "username fullName coverImage email phone avatar");

    
    if (!Alladmin || Alladmin.length === 0) {
        throw new ApiError(404, "No Traveller Admin Found");
    }

    return res.status(200).json(
        new ApiResponse(200, { Alladmin }, "All Traveller Admin Fetched Succesfully")
    );
});

// Get TravellerAdmin By id
const gettravelleradmin = asyncHandler(async (req, res) => {
    const user = req.user._id;
    if (!user) throw new ApiError(404, "User not found");

    const admin = await TravellingAdmin.findOne({ userInfo: user })
        .populate("userInfo", "username fullname fullName coverImage email phone avatar")
        .populate({
            path: "AllTraveller.userInfo",
            model: "User",
            select: "username fullname fullName email phone avatar coverImage"
        });

    if (!admin) throw new ApiError(404, "Traveller Admin not found");

    return res.status(200).json(
        new ApiResponse(200, { admin }, "Traveller data fetched with full passenger details")
    );
});

// Get TravellerAdmin by Params
const getTravellerAdminByParams = asyncHandler(async (req, res) => {
    const { param } = req.params;
    const para = param.trim();
    if (!para) throw new ApiError(400, "detail not found");

    let travelleradmin;
    if (/^[0-9a-fA-F]{24}$/.test(para)) {
        travelleradmin = await TravellingAdmin.findById(para)
            .populate("userInfo", "username fullname coverImage email phone avatar");
    } else {
        const user = await User.findOne({ username: para }).select("_id");
        if (!user) throw new ApiError(404, "user not found");

        travelleradmin = await TravellingAdmin.findOne({ userInfo: user._id })
            .populate("userInfo", "username fullname coverImage email phone avatar");
    }

    if (!travelleradmin) throw new ApiError(404, "Traveller Admin not found");

    return res.status(200).json(
        new ApiResponse(200, { travelleradmin }, "Traveller Admin data is fetched")
    );
});

// Filter By Category
const getalltravellorAdbycategory = asyncHandler(async (req, res) => {
    const { categ } = req.params;
    if (!categ) throw new ApiError(400, "category is required for filter");

    const travellerAdmins = await TravellingAdmin.find({ category: categ })
        .select("-TravellingAdminKey")
        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!travellerAdmins || travellerAdmins.length === 0) {
        throw new ApiError(404, "No traveller admin found with this category");
    }

    return res.status(200).json(
        new ApiResponse(200, travellerAdmins, "All Traveller Admins fetched")
    );
});

// Filter By Type
const getalltravellorAdbytype = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const para = type.trim();
    if (!para) throw new ApiError(401, "Type is required for filter");

    const travellerAdmin = await TravellingAdmin.find({ Type: para }).select("-TravellingAdminKey")
        .populate("userInfo", "username fullname coverImage email phone avatar");
    if (!travellerAdmin) throw new ApiError(401, "traveller admin with this type not exist");

    return res.status(200).json(
        new ApiResponse(200, travellerAdmin, "All Traveller Admin is fetched")
    );
});

// ✅ REJECT/REMOVE USER (Fixes 500/400 Error)
const deleteServetravelleruser = asyncHandler(async (req, res) => {
    const { param } = req.params;

    
    const passengerUserId = param.trim();
    const adminUserId = req.user._id;

    if (!passengerUserId || passengerUserId === 'undefined') {
        throw new ApiError(400, "Invalid Passenger User ID provided");
    }

    // 1. Find Admin Profile
    const adminProfile = await TravellingAdmin.findOne({ userInfo: adminUserId });
    if (!adminProfile) throw new ApiError(404, "Admin profile not found");
   
    
    // 2. Remove from Admin's List using 'userInfo' match
    const updatedAdmin = await TravellingAdmin.findByIdAndUpdate(
        adminProfile._id,
        {
            $pull: { AllTraveller: { userInfo: passengerUserId } }
        },
        { new: true }
    ).populate("userInfo", "username fullname coverImage email phone avatar");

    if (!updatedAdmin) throw new ApiError(404, "Admin not found or update failed");

    // 3. Clear the passenger's AllRide status
    await TravellingUser.findOneAndUpdate(
        { userInfo: passengerUserId },
        { $set: { AllRide: null } }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedAdmin, "Passenger removed successfully")
    );
});

// ✅ ACCEPT TRAVELLER LOGIC (Fixes 500/400 Error)
// ✅ ACCEPT TRAVELLER (CORRECT)
const acceptTraveller = asyncHandler(async (req, res) => {
    const { travellerId } = req.params;
    const adminUserId = req.user._id;

    if (!travellerId || travellerId === "undefined") {
        throw new ApiError(400, "Traveller User ID is required");
    }

    const adminProfile = await TravellingAdmin.findOne({ userInfo: adminUserId });
    if (!adminProfile) {
        throw new ApiError(404, "Admin profile not found");
    }

    const updatedAdmin = await TravellingAdmin.findOneAndUpdate(
        {
            _id: adminProfile._id,
            "AllTraveller.userInfo": travellerId,
            "AllTraveller.status": "pending"
        },
        {
            $set: {
                "AllTraveller.$.status": "accepted"
            }
        },
        { new: true }
    );

    if (!updatedAdmin) {
        throw new ApiError(400, "Traveller not found or already processed");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedAdmin, "Traveller accepted successfully")
    );
});


// User leaves an Admin (Cancel request/ride)
const leaveAdmin = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { adminId } = req.params;

    if (!user) throw new ApiError(404, "User not found");

    const admin = await TravellingAdmin.findByIdAndUpdate(
        adminId,
        {
            $pull: { AllTraveller: { userInfo: user } }
        },
        { new: true }
    );

    if (!admin) throw new ApiError(404, "Admin not found");

    return res.status(200).json(
        new ApiResponse(200, {}, "Left ride successfully")
    );
});

export {
    leaveAdmin,
    travellingAdminReg,
    travellerAdminLogin,
    allTravellerAdmin,
    getalltravellorAdbytype,
    deleteServetravelleruser,
    getalltravellorAdbycategory,
    getTravellerAdminByParams,
    gettravelleradmin,
    acceptTraveller
};