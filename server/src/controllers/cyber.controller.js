import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Cyber } from "../models/cyberAdmin.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { CyberUser} from "../models/cyberUser.model.js"
import mongoose from "mongoose"

//admin register
const adminregister = asyncHandler(async (req, res) => {
    const { Experience, Start_time, End_time, cyberKey, location } = req.body
    if (
        [cyberKey, Experience, Start_time, End_time, location].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");

    }

    const cyber_shopPicpath = req.files?.cyber_shopPic?.[0]?.path;
    console.log( req.files);
    if (!cyber_shopPicpath) {
        throw new ApiError(400, "cyber_shopPicpath is required");
    }


    console.log(cyber_shopPicpath);
    

    const cyber_shopPic = await uploadOnCloudinary(cyber_shopPicpath);

    if (!cyber_shopPic) throw new ApiError(500, "cyber_shopPic upload failed")

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingcyber = await Cyber.findOne({
        "userInfo._id": req.user?._id,
        iscyber: true
    });
    if (existingcyber) {
        throw new ApiError(409, "cyber user is already registered");
    }

    const { password, refreshToken, ...cyberData } = user; // bina kaam ke data ko htana

    // Create new education doc
    const cyberuser = await Cyber.create({
        Experience,
        Start_time,
        End_time,
        cyberKey,
        location,
        cyber_shopPic: {
            url: cyber_shopPic?.url || "",
            public_id: cyber_shopPic?.public_id || "",
        },
        location,
        iscyber:true,
        userInfo: cyberData
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            cyberuser,
            "cyberuser detail created successfully"
        ));
})

const adminlogin = asyncHandler(async (req, res) => {
    const {cyberKey} = req.body
    if (
        [cyberKey].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");

    }

    const existingCyber = await Cyber.findOne({
         "cyberKey": cyberKey,
         iscyber: true
       });


    if (!existingCyber) {
     throw new ApiError(409, "EducatorKey is wrong");
   }

    return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingCyber,
       "login suceesfully"
     ));
})

const getAllcyberUser = asyncHandler(async (req, res) => {
    const existcyber = await Cyber.findOne({
        "userInfo._id": req.user?._id,
        iscyber: true
    });
    
  if (!existcyber) {
    throw new ApiError(404, "cyber not found or not registered as teacher");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      existcyber.cyberUsers, 
      "All cyber fetched successfully"
    )
  );
});

const CyberSumbit = asyncHandler(async (req, res) => {
  const { username } = req.params; 

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const updatedCyberUser = await CyberUser.findOneAndUpdate(
    { "userInfo.username": username.toLowerCase() },
    { $set: { message: "selected" } },
    { new: true }
  ).select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedCyberUser) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedCyberUser, "Message updated for student successfully")
  );
});

export { adminregister,adminlogin,getAllcyberUser,CyberSumbit}