import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Education} from "../models/educationAdmin.model.js"
import { Student} from "../models/educationStudent.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createDetail = asyncHandler(async (req, res) => {
  const { clas, subject, board, location, massage, StudentKey } = req.body;

  if ([clas, subject, board, location, massage, StudentKey].some(
    (field) => !field || field.trim() === ""
  )) {
    throw new ApiError(400, "All required fields must be non-empty");
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  // check if student already registered
  const existingStudent = await Student.findOne({
    "userInfo._id": req.user?._id,
    isStudent: true
  });
  

  if (existingStudent) {
    throw new ApiError(409, "student is already registered");
  }

  const { password, refreshToken, ...userData } = user;

  const studentDetail = await Student.create({
    clas,
    subject,
    board,
    location,
    massage,
    isStudent: true,
    StudentKey,
    userInfo: userData
  });

  return res.status(201).json(
    new ApiResponse(201, studentDetail, "Student detail created successfully")
  );
});


const loginStudent = asyncHandler(async (req, res) => {
   const { StudentKey } = req.body;

   const existingStudent = await Student.find({
     "StudentKey": StudentKey,
     isStudent: true
   });

   if (!existingStudent) {
     throw new ApiError(409, "StudentKey is wrong");
   }

   return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingStudent,
       "login suceesfully"
     ));
})

const getAllTeacher = asyncHandler(async (req, res) => {
  const allTeacher = await Education.find({})
    .populate("student", "-password -refreshToken -__v");

  if (!allTeacher) {
    throw new ApiError(404, "no any teacher");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      allTeacher, 
      "All teacher fetched successfully"
    )
  );
});


const slectTeacher = asyncHandler(async (req, res) => {
  const { username } = req.params; 
  const studentId = req.user?._id;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  if (!studentId) {
    throw new ApiError(400, "Student not logged in");
  }

  const studentData = await User.findById(req.user._id).select("-password -refreshToken -__v");


  if (!studentData) {
    throw new ApiError(404, "Student not found");
  }
  const updatedTeacher = await Education.findOneAndUpdate(
  { "userInfo.username": username.toLowerCase() },
  { $addToSet: { student: studentId } },
  { new: true }
  ).populate("student", "-password -refreshToken -__v");
  if (!updatedTeacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedTeacher, "Student embedded in teacher successfully")
  );
});


export {createDetail,loginStudent,getAllTeacher,slectTeacher}

