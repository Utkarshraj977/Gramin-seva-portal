import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Education} from "../models/educationAdmin.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student} from "../models/educationStudent.model.js"

const createDetail = asyncHandler(async (req, res) => {
  const { 
    fee, 
    Experience, 
    category, 
    Start_time, 
    End_time, 
    EducatorKey, 
    location 
  } = req.body;


  if (
    [ fee, Experience, category, EducatorKey, location].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All required fields must be non-empty");
  }


 
  const certificatepath = req.files?.Education_certificate?.[0]?.path;
  if (!certificatepath) {
    throw new ApiError(400, "Education_certificate is required");
  }


  const avatar = await uploadOnCloudinary(certificatepath);


  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");


  //    if(user.userInfo.isEducator) {
  //     throw new ApiError(400, "teacher is alrady login");
  //   }

  // const hasUserInfo = !!user.userInfo;

  // check karo ki user already educator hai ya nahi
  const existingEducation = await Education.findOne({
    "userInfo._id": req.user?._id,
    isEducator: true
  });

  if (existingEducation) {
    throw new ApiError(409, "Teacher is already registered");
  }


    const { password,refreshToken, ...userData } = user; // bina kaam ke data ko htana

    // Create new education doc
    const education = await Education.create({
      fee,
      Experience,
      category,
      Start_time,
      End_time,
      isEducator: true,
      EducatorKey,
      Education_certificate: {
        url: avatar?.url || "",
        public_id: avatar?.public_id || "",
      },
      location,
      userInfo: userData  
    });



  return res
    .status(201)
    .json(new ApiResponse(
      201,
      education,
      "Education detail created successfully"
    ));
});

const loginTeacher = asyncHandler(async (req, res) => {
   const { EducatorKey } = req.body;

   const existingEducation = await Education.findOne({
     "EducatorKey": EducatorKey,
     isEducator: true
   });

   if (!existingEducation) {
     throw new ApiError(409, "EducatorKey is wrong");
   }

   return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingEducation,
       "login suceesfully"
     ));
})


const getAllStudent = asyncHandler(async (req, res) => {
  const existingEducation = await Education.findOne({
    "userInfo._id": req.user?._id,
    isEducator: true
  }).populate("student", "-password -refreshToken -__v");
  
  if (!existingEducation) {
    throw new ApiError(404, "Educator not found or not registered as teacher");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      existingEducation.student, 
      "All students fetched successfully"
    )
  );
});

const teacherSumbit = asyncHandler(async (req, res) => {
  const { username } = req.params; 

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const updatedStudent = await Student.findOneAndUpdate(
    { "userInfo.username": username.toLowerCase() },
    { $set: { message: "selected" } },
    { new: true }
  ).select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedStudent, "Message updated for student successfully")
  );
});

export {createDetail,loginTeacher,getAllStudent,teacherSumbit}

 