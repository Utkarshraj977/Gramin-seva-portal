import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Education } from "../models/educationAdmin.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/educationStudent.model.js"; 

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

  // Validation: Added Start_time & End_time checks
  if (
    [fee, Experience, category, EducatorKey, location, Start_time, End_time].some(
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

  const existingEducation = await Education.findOne({
    "userInfo._id": req.user?._id,
    isEducator: true
  });

  if (existingEducation) {
    throw new ApiError(409, "Teacher is already registered");
  }

  // Optimize user data storage
  const { password, refreshToken, ...userData } = user.toObject(); 

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

  return res.status(201).json(new ApiResponse(
      201,
      education,
      "Education detail created successfully"
  ));
});


const loginTeacher = asyncHandler(async (req, res) => {
   const { EducatorKey } = req.body;

   if (!EducatorKey) throw new ApiError(400, "Educator Key is required");

   const existingEducation = await Education.findOne({
     "EducatorKey": EducatorKey,
     isEducator: true
   });

   if (!existingEducation) {
     throw new ApiError(409, "EducatorKey is wrong");
   }

   return res.status(200).json(new ApiResponse(
       200,
       existingEducation,
       "Login successfully"
   ));
});

const getAllStudent = asyncHandler(async (req, res) => {
  const existingEducation = await Education.findOne({
    "userInfo._id": req.user?._id,
    isEducator: true
  }).populate("student"); // 👈 FIX: Sirf "student" likhein, nested populate hata dein.
  
  // Note: Student model ke andar userInfo pehle se hi saved hai, 
  // isliye use alag se populate karne ki zarurat nahi hai.

  if (!existingEducation) {
    throw new ApiError(404, "Educator not found");
  }

  return res.status(200).json(new ApiResponse(
      200,
      existingEducation.student, 
      "All students fetched successfully"
  ));
});

const teacherSubmit = asyncHandler(async (req, res) => {
  const { username } = req.params; 

  if (!username?.trim()) throw new ApiError(400, "Username is missing");

  const updatedStudent = await Student.findOneAndUpdate(
    { "userInfo.username": username.toLowerCase() },
    { $set: { message: "selected" } },
    { new: true }
  ).select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedStudent) throw new ApiError(404, "Student not found");

  return res.status(200).json(new ApiResponse(
      200, 
      updatedStudent, 
      "Student approved successfully"
  ));
});


const rejectStudent = asyncHandler(async (req, res) => {
    const { username } = req.params;
    
    const updatedStudent = await Student.findOneAndUpdate(
        { "userInfo.username": username.toLowerCase() },
        { $set: { message: "rejected" } },
        { new: true }
    );

    if (!updatedStudent) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(
        200, 
        updatedStudent, 
        "Student rejected successfully"
    ));
});

const updateTeacherProfile = asyncHandler(async (req, res) => {
    const { fee, Start_time, End_time, location } = req.body;

    const updateFields = {};
    if (fee) updateFields.fee = fee;
    if (Start_time) updateFields.Start_time = Start_time;
    if (End_time) updateFields.End_time = End_time;
    if (location) updateFields.location = location;

    const updatedEducation = await Education.findOneAndUpdate(
        { "userInfo._id": req.user?._id, isEducator: true },
        { $set: updateFields },
        { new: true }
    );

    if (!updatedEducation) throw new ApiError(404, "Educator profile not found");

    return res.status(200).json(new ApiResponse(
        200, 
        updatedEducation, 
        "Profile updated successfully"
    ));
});


const getDashboardStats = asyncHandler(async (req, res) => {
    const education = await Education.findOne({
        "userInfo._id": req.user?._id,
        isEducator: true
    }).populate("student");

    if (!education) throw new ApiError(404, "Educator not found");

    const totalStudents = education.student.length;
    const activeStudents = education.student.filter(s => s.message === "selected").length;
    const pendingRequests = education.student.filter(s => !s.message || s.message === "pending").length;
    const estimatedEarnings = activeStudents * (education.fee || 0);

    const stats = {
        totalStudents,
        activeStudents,
        pendingRequests,
        estimatedEarnings,
        fee: education.fee
    };

    return res.status(200).json(new ApiResponse(
        200, 
        stats, 
        "Stats fetched successfully"
    ));
});

export { 
    createDetail, 
    loginTeacher, 
    getAllStudent, 
    teacherSubmit, 
    rejectStudent, 
    updateTeacherProfile, 
    getDashboardStats 
};