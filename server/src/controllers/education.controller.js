import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Education } from "../models/educationAdmin.model.js"; // Aapka Model
import { Student } from "../models/educationStudent.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ============================================================================
// 1. REGISTER TEACHER
// ============================================================================
const createDetail = asyncHandler(async (req, res) => {
    const { 
        fee, Experience, category, Start_time, End_time, EducatorKey, location 
    } = req.body;

    if ([fee, Experience, category, EducatorKey, location, Start_time, End_time].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const certificatepath = req.files?.Education_certificate?.[0]?.path;
    if (!certificatepath) throw new ApiError(400, "Certificate is required");

    const avatar = await uploadOnCloudinary(certificatepath);
    if (!avatar) throw new ApiError(500, "Upload failed");

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingEducation = await Education.findOne({ "userInfo._id": req.user?._id, isEducator: true });
    if (existingEducation) throw new ApiError(409, "Teacher already registered");

    const { password, refreshToken, ...userData } = user.toObject(); 

    const education = await Education.create({
        fee, // Schema me String hai, direct save karein
        Experience,
        category,
        Start_time,
        End_time,
        isEducator: true,
        EducatorKey,
        Education_certificate: { url: avatar.url, public_id: avatar.public_id },
        location,
        userInfo: userData,
        student: [] 
    });

    return res.status(201).json(new ApiResponse(201, education, "Teacher registered successfully"));
});

// ============================================================================
// 2. LOGIN TEACHER
// ============================================================================
const loginTeacher = asyncHandler(async (req, res) => {
    const { EducatorKey } = req.body;
    if (!EducatorKey) throw new ApiError(400, "Educator Key is required");

    const existingEducation = await Education.findOne({ "EducatorKey": EducatorKey, isEducator: true });
    if (!existingEducation) throw new ApiError(401, "Invalid Key");

    return res.status(200).json(new ApiResponse(200, existingEducation, "Login successful"));
});

// ============================================================================
// 3. GET ALL STUDENTS (List Fetch)
// ============================================================================
const getAllStudent = asyncHandler(async (req, res) => {
    const existingEducation = await Education.findOne({ "userInfo._id": req.user?._id, isEducator: true })
        .populate("student"); // Schema me ObjectId hai, isliye .populate() mast kaam karega

    if (!existingEducation) throw new ApiError(404, "Teacher profile not found");

    return res.status(200).json(new ApiResponse(200, existingEducation.student || [], "Students fetched"));
});

// ============================================================================
// 4. ACCEPT STUDENT (Status Update)
// ============================================================================
const teacherSubmit = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    if (!username?.trim()) throw new ApiError(400, "Username missing");

    const updatedStudent = await Student.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } },
        { $set: { message: "selected", status: "selected" } },
        { new: true }
    );

    if (!updatedStudent) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(200, updatedStudent, "Student Accepted"));
});

// ============================================================================
// 5. REJECT STUDENT (Status Update)
// ============================================================================
const rejectStudent = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const updatedStudent = await Student.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } },
        { $set: { message: "rejected", status: "rejected" } },
        { new: true }
    );

    if (!updatedStudent) throw new ApiError(404, "Student not found");
    return res.status(200).json(new ApiResponse(200, updatedStudent, "Student Rejected"));
});

// ============================================================================
// 6. REMOVE STUDENT (Delete from List - FIXED FOR OBJECT_ID)
// ============================================================================
const removeStudent = asyncHandler(async (req, res) => {
    const { username } = req.params;
    
    // Pehle Student ka ID nikalo username se
    const studentToRemove = await Student.findOne({ "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } });
    if (!studentToRemove) throw new ApiError(404, "Student not found");

    // $pull use karein (Schema me ObjectId hai, toh ye perfect kaam karega)
    const updatedEducation = await Education.findOneAndUpdate(
        { "userInfo._id": req.user?._id, isEducator: true },
        { $pull: { student: studentToRemove._id } },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, null, "Student removed from list"));
});

// ============================================================================
// 7. UPDATE PROFILE
// ============================================================================
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

    return res.status(200).json(new ApiResponse(200, updatedEducation, "Profile Updated"));
});

// ============================================================================
// 8. DASHBOARD STATS (Calculations)
// ============================================================================
const getDashboardStats = asyncHandler(async (req, res) => {
    const education = await Education.findOne({ "userInfo._id": req.user?._id, isEducator: true })
        .populate("student");

    if (!education) throw new ApiError(404, "Teacher not found");

    const students = education.student || [];
    const totalStudents = students.length;
    
    // Active = Selected
    const activeStudents = students.filter(s => s.message === "selected" || s.status === "selected").length;
    
    // Pending = Not selected & Not rejected
    const pendingRequests = students.filter(s => s.message !== "selected" && s.message !== "rejected").length;

    // Earnings Calculation (Fee String hai, Number me convert karein)
    // Agar fee "500" hai to thik, agar "500/month" hai to parseInt sirf 500 uthayega
    const numericFee = parseInt(education.fee) || 0; 
    const estimatedEarnings = activeStudents * numericFee;

    const stats = {
        totalStudents,
        activeStudents,
        pendingRequests,
        estimatedEarnings,
        fee: education.fee,
        location: education.location,
        timings: `${education.Start_time} - ${education.End_time}`
    };

    return res.status(200).json(new ApiResponse(200, stats, "Stats Fetched"));
});

export { 
    createDetail, loginTeacher, getAllStudent, teacherSubmit, 
    rejectStudent, removeStudent, updateTeacherProfile, getDashboardStats 
};