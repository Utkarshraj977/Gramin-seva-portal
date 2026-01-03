import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { TravellingUser } from "../models/travellingUser.model.js"
import { TravellingAdmin } from "../models/travellingAdmin.model.js"

import mongoose from "mongoose"

//Traveller user Register
const TravellingUserRegister = asyncHandler(async (req, res) => {
    const { from, To, message, TravellingUserKey, location } = req.body;
    if ([from, To, message, TravellingUserKey, location].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are reqired");
    }
    const user = req.user?._id;

    if (!user) throw new ApiError(404, "User not found")
    if (!/^\d{6}$/.test(TravellingUserKey)) {
        throw new ApiError(400, "TravellingUserKey must be exactly 6 digits (numbers only)");
    }
    const existeduser = await TravellingUser.findOne({ userInfo: user })
    if (existeduser) throw new ApiError(409, "TravellingUser is allready registered")

    const createdTravellingUser = await TravellingUser.create(
        {
            from,
            To,
            message,
            isTravellingUser: true,
            TravellingUserKey,
            location,
            userInfo: user
        }
    )
    const fullTravellingUser = await createdTravellingUser.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { Traveller: fullTravellingUser },
                "Travelling User registered succesfully"
            )
        );
})

//patient Login
const TravellingLogin = asyncHandler(async (req, res) => {
    const { TravellingUserKey } = req.body;
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found")
    if (!TravellingUserKey) throw new ApiError(401, "Travelling key required for login")
    const Travelling = await TravellingUser.findOne({ userInfo: user })

        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!Travelling) throw new ApiError(401, "unauthorized access")

    const isTravellingkeyvalid = await Travelling.isTravellingkeyvalid(TravellingUserKey)
    if (!isTravellingkeyvalid) throw new ApiError(401, "Invalid Travelling credentials")
    Travelling.TravellingUserKey = undefined; //remove to send the key in the response

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                Travelling,
                "Travelling user login successful"
            )
        )

})

//selectedpatient
const setuserIntoadmin = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "user not found")

    const travelUser = await TravellingUser.findOne({ userInfo: user }).populate("userInfo", "username fullname coverImage email phone avatar")
    if (!travelUser) throw new ApiError(404, "Traveelor user profile not found. Please register first.");

    const admin_id = req.params.id;
    const admin = await TravellingAdmin.findByIdAndUpdate(
        admin_id,
        { $addToSet: { AllTraveller: travelUser } },
        { new: true }
    ).populate("userInfo", "username fullname coverImage email phone avatar")
    if (!admin) throw new ApiError(404, "admin not exist");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                admin,
                "Traveller user is added in doctor"
            )
        )
})

//get Traveller user by id

const travelleruser = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(400, "user id not found")
    const travelleruser = await TravellingUser.find(
        { userInfo:new mongoose.Types.ObjectId(user) }
    )
        .select("-TravellingUserKey")
        .populate("userInfo", "username fullname coverImage email phone avatar")

    if (!travelleruser) throw new ApiError(404, "traveller user is not found")
    return res
        .status(200)
        .json(
            new ApiResponse(200, travelleruser, "Traveller user is fetched succesfully")
        )
})

export { TravellingUserRegister, TravellingLogin, setuserIntoadmin, travelleruser }


