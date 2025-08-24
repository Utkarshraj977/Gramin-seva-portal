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


export {createDetail,loginStudent}