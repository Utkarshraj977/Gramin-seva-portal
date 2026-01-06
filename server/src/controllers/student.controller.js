import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Education } from "../models/educationAdmin.model.js"; // Teacher Model
import { Student } from "../models/educationStudent.model.js"; // Student Model
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

  const existingStudent = await Student.findOne({
    "userInfo._id": req.user?._id,
    isStudent: true
  });

  if (existingStudent) {
    throw new ApiError(409, "Student is already registered");
  }

  // Optimize: User data plain object mein convert karein
  const { password, refreshToken, ...userData } = user.toObject();

  const studentDetail = await Student.create({
    clas,
    subject,
    board,
    location,
    massage, // Keeping your variable name 'massage'
    isStudent: true,
    StudentKey,
    userInfo: userData
  });

  return res.status(201).json(new ApiResponse(
      201, 
      studentDetail, 
      "Student profile created successfully"
  ));
});


const loginStudent = asyncHandler(async (req, res) => {
   const { StudentKey } = req.body;

   if (!StudentKey) throw new ApiError(400, "Student Key is required");

   // FIX: find() array deta hai, findOne() single object deta hai. Login ke liye findOne chahiye.
   const existingStudent = await Student.findOne({
     "StudentKey": StudentKey,
     isStudent: true
   });

   if (!existingStudent) {
     throw new ApiError(409, "Student Key is wrong");
   }

   return res.status(200).json(new ApiResponse(
       200,
       existingStudent,
       "Login successful"
   ));
});

const getAllTeacher = asyncHandler(async (req, res) => {
  // Sirf woh teachers dikhayein jo teaching kar rahe hain (optional filter)
  const allTeacher = await Education.find({ isEducator: true })
    .select("-EducatorKey -userInfo.password -userInfo.refreshToken"); // Sensitive data hide karein

  if (!allTeacher || allTeacher.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No teachers found"));
  }

  return res.status(200).json(new ApiResponse(
      200,
      allTeacher, 
      "All teachers fetched successfully"
  ));
});


const selectTeacher = asyncHandler(async (req, res) => {
  const { username } = req.params; // Teacher ka username
  const userId = req.user?._id;

  if (!username?.trim()) throw new ApiError(400, "Teacher username is missing");

  // 1. Find the Student Document for the current logged-in user
  const currentStudent = await Student.findOne({ "userInfo._id": userId });
  if (!currentStudent) {
      throw new ApiError(404, "Please register as a student first");
  }

  // 2. Find the Teacher and Push Student ID (Education Model ka ID, not User ID)
  // Hum currentStudent._id bhejenge taaki Teacher controller mein populate kaam kare.
  const updatedTeacher = await Education.findOneAndUpdate(
      { "userInfo.username": username.toLowerCase() },
      { $addToSet: { student: currentStudent._id } }, // $addToSet duplicate entry rokta hai
      { new: true }
  ).select("-EducatorKey");

  if (!updatedTeacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res.status(200).json(new ApiResponse(
      200, 
      updatedTeacher, 
      "Applied to teacher successfully"
  ));
});


const getStudentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // 1. Find current student
    const currentStudent = await Student.findOne({ "userInfo._id": userId });
    if (!currentStudent) throw new ApiError(404, "Student profile not found");

    // 2. Find all teachers where this student ID exists in their 'student' array
    const myTeachers = await Education.find({
        student: currentStudent._id
    }).select("userInfo.fullname userInfo.username fee category Start_time End_time location");

    const stats = {
        studentProfile: currentStudent,
        appliedTeachers: myTeachers,
        totalApplications: myTeachers.length,
        status: currentStudent.message || "pending" // 'selected' or 'pending'
    };

    return res.status(200).json(new ApiResponse(
        200,
        stats,
        "Dashboard data fetched successfully"
    ));
});


const updateStudentProfile = asyncHandler(async (req, res) => {
    const { clas, subject, board, location, massage } = req.body;
    const userId = req.user?._id;

    const updateFields = {};
    if (clas) updateFields.clas = clas;
    if (subject) updateFields.subject = subject;
    if (board) updateFields.board = board;
    if (location) updateFields.location = location;
    if (massage) updateFields.massage = massage;

    const updatedStudent = await Student.findOneAndUpdate(
        { "userInfo._id": userId },
        { $set: updateFields },
        { new: true }
    );

    if (!updatedStudent) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(
        200,
        updatedStudent,
        "Profile updated successfully"
    ));
});


const withdrawApplication = asyncHandler(async (req, res) => {
    const { username } = req.params; // Teacher username to remove
    const userId = req.user?._id;

    const currentStudent = await Student.findOne({ "userInfo._id": userId });
    if (!currentStudent) throw new ApiError(404, "Student not found");

    // Teacher ke 'student' array se is student ki ID remove karo
    const updatedTeacher = await Education.findOneAndUpdate(
        { "userInfo.username": username.toLowerCase() },
        { $pull: { student: currentStudent._id } },
        { new: true }
    );

    if (!updatedTeacher) throw new ApiError(404, "Teacher not found or not applied to");

    return res.status(200).json(new ApiResponse(
        200,
        null,
        "Application withdrawn successfully"
    ));
});

export { 
    createDetail, 
    loginStudent, 
    getAllTeacher, 
    selectTeacher, 
    getStudentDashboard, 
    updateStudentProfile,
    withdrawApplication
};