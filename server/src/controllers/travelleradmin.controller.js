import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TravellingAdmin } from "../models/travellingAdmin.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Traveller Admin (Car Owner) Register
const travellingAdminReg = asyncHandler(async (req, res) => {
    const { carNumber, category, TravellingAdminKey, location, Type } = req.body;

    // Validate fields
    if ([carNumber, category, TravellingAdminKey, location, Type].some(
        (field) => typeof field !== "string" || field.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required");
    }

    // Find user
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    // Validate TravellingAdminKey
    if (!/^\d{6}$/.test(TravellingAdminKey)) {
        throw new ApiError(400, "TravellingAdminKey must be exactly 6 digits (numbers only)");
    }

    // Check if already registered
    const existedUser = await TravellingAdmin.findOne({ userInfo: user._id });
    if (existedUser) throw new ApiError(409, "Traveller Admin is already registered");

    // File uploads
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

    // Create Traveller Admin
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

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { travellerAdmin },
                "Traveller admin login succesfully"
            )
        );
});

// Get all Traveller Admin 
const allTravellerAdmin = asyncHandler(async (req, res) => {
    const Alladmin = await TravellingAdmin.find().populate("userInfo", "username fullname coverImage email phone avatar");

    if (!Alladmin || Alladmin.length === 0) {
        throw new ApiError(404, "No Traveller Admin Found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { Alladmin },
                "All Traveller Admin Fetched Succesfully"
            )
        );
});

// Get TravellerAdmin By id (Modified to include populated passenger info)
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

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { admin },
                "Traveller data fetched with full passenger details"
            )
        );
});

// Get TravellerAdmin by Params Id or params username
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

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { travelleradmin },
                "Traveller Admin data is fetched"
            )
        );
});

// filter By Category
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

// filter By Type
const getalltravellorAdbytype = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const para = type.trim();
    if (!para) throw new ApiError(401, "Type is required for filter");
    const travellerAdmin = await TravellingAdmin.find({ Type: para }).select("-TravellingAdminKey")
        .populate("userInfo", "username fullname coverImage email phone avatar");
    if (!travellerAdmin) throw new ApiError(401, "traveller admin with this type not exist");

    return res
        .status(200)
        .json(
            new ApiResponse(200, travellerAdmin, "All Traveller Admin is fetched")
        );
});

// Delete (Reject) traveller
const deleteServetravelleruser = asyncHandler(async (req, res) => {
    const { param } = req.params; // Ye passenger ki User ID honi chahiye
    const para = param.trim();
    const adminUserId = req.user._id; // Login Admin ki ID

    if (!para) throw new ApiError(400, "Passenger ID is required");

    const travelleradmin = await TravellingAdmin.findOneAndUpdate(
        {
            userInfo: adminUserId, // Admin ki apni profile check karega
            // ✅ FIX: "AllTraveller.userInfo" check karein, na ki "_id"
            "AllTraveller.userInfo": new mongoose.Types.ObjectId(para)
        },
        {
            // ✅ FIX: userInfo ke basis par array se nikalein
            $pull: { AllTraveller: { userInfo: new mongoose.Types.ObjectId(para) } }
        },
        {
            new: true
        }
    )
    .select("-TravellingAdminKey")
    .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!travelleradmin) {
        throw new ApiError(404, "Passenger not found in your trip list");
    }

    // Ek extra step: Agar aapne Passenger ki profile mein bhi 'AllRide' field rakha hai, 
    // toh usey bhi null karna chahiye (optional, aapke schema par depend karta hai)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                travelleradmin,
                "Passenger removed successfully"
            )
        );
});

// ✅ ACCEPT TRAVELLER LOGIC
const acceptTraveller = asyncHandler(async (req, res) => {
    const { travellerId } = req.params;
    const user = req.user._id;

    if (!travellerId) throw new ApiError(400, "Traveller ID is required");

    // Update the specific element in the AllTraveller array
    // We set 'message' and 'status' to 'accepted'
    const travelleradmin = await TravellingAdmin.findOneAndUpdate(
        {
            userInfo: user,
            "AllTraveller._id": new mongoose.Types.ObjectId(travellerId)
        },
        {
            $set: {
                "AllTraveller.$.message": "accepted",
                "AllTraveller.$.status": "accepted"
            }
        },
        { new: true }
    );

    if (!travelleradmin) throw new ApiError(404, "Traveller not found in your requests");

    return res
        .status(200)
        .json(
            new ApiResponse(200, travelleradmin, "Traveller accepted successfully")
        );
});

// User leaves an Admin (Cancel request/ride)
const leaveAdmin = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { adminId } = req.params;

    if (!user) throw new ApiError(404, "User not found");
    
    // Find admin and pull the current user from their list
    const admin = await TravellingAdmin.findByIdAndUpdate(
        adminId,
        { 
            $pull: { 
                AllTraveller: { userInfo: user } 
            } 
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
    acceptTraveller // Export the new function
};
