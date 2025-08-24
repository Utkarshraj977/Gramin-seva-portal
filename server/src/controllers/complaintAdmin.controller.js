import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { CyberUser} from "../models/cyberUser.model.js"
import mongoose from "mongoose"

//admin register
const adminregister = asyncHandler(async (req, res) => {
    const { category, Start_time, End_time, ComplaintAdminKey,location } = req.body
    if (
        [category, ComplaintAdminKey, Start_time, End_time, location].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");

    }

    const complaintAdmin_certificatepath = req.files?.complaintAdmin_certificate?.[0]?.path;
    console.log(complaintAdmin_certificatepath);
    
    if (!complaintAdmin_certificatepath) {
        throw new ApiError(400, "complaintAdmin_certificatepath is required");
    }

    

    const complaintAdmin_certificatePic = await uploadOnCloudinary(complaintAdmin_certificatepath);

    if (!complaintAdmin_certificatePic) throw new ApiError(500, "complaintAdmin_certificatepath upload failed")

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingcomplaint = await ComplaintAdmin.findOne({
        "userInfo._id": req.user?._id,
        iscomplaintAdmin: true
    });
    if (existingcomplaint) {
        throw new ApiError(409, "cyber user is already registered");
    }

    const { password, refreshToken, ...complaintData } = user; // bina kaam ke data ko htana

    // Create new complaint doc
    const complaintAdminn = await ComplaintAdmin.create({
        category,
        Start_time,
        End_time,
        ComplaintAdminKey,
        location,
        complaintAdmin_certificate: {
            url: complaintAdmin_certificatePic?.url || "",
            public_id: complaintAdmin_certificatePic?.public_id || "",
        },
        location,
        iscomplaintAdmin:true,
        userInfo: complaintData
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            complaintAdminn,
            "complaintAdmin detail created successfully"
        ));
})

const adminlogin = asyncHandler(async (req, res) => {
    const {ComplaintAdminKey} = req.body
    if (
        [ComplaintAdminKey].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "fields must be non-empty");

    }

    const existingComplaint = await ComplaintAdmin.find({
         "ComplaintAdminKey": ComplaintAdminKey,
         iscomplaintAdmin: true
       });


    if (!existingComplaint) {
     throw new ApiError(409, "complaintkey is wrong");
   }

    return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingComplaint,
       "login suceesfully"
     ));
})

const getAllcomplaint = asyncHandler(async (req, res) => {
    const existcomplaint = await ComplaintAdmin.find({});
    
  if (!existcomplaint) {
    throw new ApiError(404, "complaint not found or not registered as teacher");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      existcomplaint, 
      "All cyber fetched successfully"
    )
  );
});

const getbyusername = asyncHandler(async (req, res) => {
  const { username } = req.params; 

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const updatedComplaint = await ComplaintAdmin.findOne(
    { "userInfo.username": username.toLowerCase() }

  )//.select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedComplaint) {
    throw new ApiError(404, "complaint not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedComplaint, "complaint find successfully")
  );
});

//by params id
const getuserbyid = asyncHandler(async (req, res) => {
  const  user  = req.user?._id; 
  console.log(user);

  if (!user) {
    throw new ApiError(400, "User is missing");
  }

  const updatedComplaint = await ComplaintAdmin.find(
    {"userInfo._id":user}
  )//.select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedComplaint) {
    throw new ApiError(404, "complaint not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedComplaint, "complaint find successfully")
  );
});


export { adminregister,adminlogin,getAllcomplaint,getbyusername,getuserbyid}