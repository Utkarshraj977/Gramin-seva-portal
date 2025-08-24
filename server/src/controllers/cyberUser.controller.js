import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { CyberUser} from "../models/cyberUser.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cyber } from "../models/cyberAdmin.model.js"

const resistorCyberUser = asyncHandler(async (req, res) => {
  const { message, Start_time, End_time, location, cyberUserKey } = req.body;

  // Validation (safe check for string fields only)
 // Only check for required fields
  if (!message || message.trim() === "" || !cyberUserKey || cyberUserKey.trim() === "") {
  throw new ApiError(400, "Message and CyberUserKey must be non-empty");
}

  if (!Start_time || !End_time) {
    throw new ApiError(400, "Start_time and End_time are required");
  }

  // Find logged in user
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  // Check if already registered
  const existingStudent = await CyberUser.findOne({
    "userInfo._id": req.user?._id,
    iscyberUser: true
  });

  if (existingStudent) {
    throw new ApiError(409, "CyberUser is already registered");
  }

  // Remove sensitive data
  const { password, refreshToken, ...cyberuserData } = user.toObject();

  // Create new cyber user
  const cyberuserDetail = await CyberUser.create({
    message,
    Start_time,
    End_time,
    location,
    iscyberUser: true,
    cyberUserKey,
    userInfo: cyberuserData
  });

  return res.status(201).json(
    new ApiResponse(201, cyberuserDetail, "CyberUser detail created successfully")
  );
});

const loginCyberUser = asyncHandler(async (req, res) => {
   const { cyberUserKey } = req.body;

   const existingStudent = await CyberUser.findOne({
    "userInfo._id": req.user?._id,
    iscyberUser: true
  });

   if (!existingStudent) {
     throw new ApiError(409, "cyberUserKey is wrong");
   }

   return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingStudent,
       "login suceesfully"
     ));
})

const getAllCyber = asyncHandler(async (req, res) => {
  const allcyber = await Cyber.find({});

  if (!allcyber) {
    throw new ApiError(404, "no any teacher");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      allcyber, 
      "All teacher fetched successfully"
    )
  );
});

const slectCyber = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const cyberuserid = req.user?._id;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  if (!cyberuserid) {
    throw new ApiError(400, "CyberUser not logged in");
  }

  const cyberData = await User.findById(cyberuserid).select(
    "-password -refreshToken -__v"
  );
  if (!cyberData) {
    throw new ApiError(404, "CyberUser not found");
  }

  const cleanUsername = username.trim().replace(/,+$/, "").toLowerCase();

  const updateCyberUser = await Cyber.findOneAndUpdate(
    { "userInfo.username": { $regex: new RegExp("^" + cleanUsername + "[, ]*$", "i") } },
    { $addToSet: { cyberUsers: cyberData } },
    { new: true }
  );
  console.log(updateCyberUser);
  
  
  if (!updateCyberUser) {
    throw new ApiError(404, "Cyber not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updateCyberUser, "Cyber user added successfully")
  );
});


export {resistorCyberUser,loginCyberUser,getAllCyber,slectCyber}