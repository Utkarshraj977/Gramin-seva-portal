import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Student } from "../models/educationStudent.model.js"; 
import { Education } from "../models/educationAdmin.model.js"; // Teacher Model
import { ApiResponse } from "../utils/ApiResponse.js";

// ==================================================
// 1. REGISTER STUDENT
// ==================================================
const createDetail = asyncHandler(async (req, res) => {
    const { clas, subject, board, location, StudentKey } = req.body;

    if ([clas, subject, board, location, StudentKey].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingStudent = await Student.findOne({ "userInfo._id": req.user?._id, isStudent: true });
    if (existingStudent) throw new ApiError(409, "Student profile already exists");

    const { password, refreshToken, ...userData } = user.toObject();

    const student = await Student.create({
        clas, subject, board, location,
        isStudent: true,
        StudentKey,
        userInfo: userData,
        message: "pending"
    });

    return res.status(201).json(new ApiResponse(201, student, "Student registered successfully"));
});

// ==================================================
// 2. LOGIN STUDENT
// ==================================================
const loginStudent = asyncHandler(async (req, res) => {
    const { StudentKey } = req.body;
    if (!StudentKey) throw new ApiError(400, "Key is required");

    const existingStudent = await Student.findOne({ "StudentKey": StudentKey, isStudent: true });
    if (!existingStudent) throw new ApiError(401, "Invalid Key");

    return res.status(200).json(new ApiResponse(200, existingStudent, "Login successful"));
});

// ==================================================
// 3. GET ALL TEACHERS (With Search Filters)
// ==================================================
const getAllTeacher = asyncHandler(async (req, res) => {
    // Search Filters (Subject, Location, Fee)
    const { subject, location, minFee, maxFee } = req.query;
    
    const query = { isEducator: true };
    if (subject) query.category = { $regex: subject, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    let teachers = await Education.find(query)
        .select("-EducatorKey -userInfo.password -userInfo.refreshToken"); 

    // Custom Fee Filter
    if (minFee || maxFee) {
        teachers = teachers.filter(t => {
            const feeVal = parseInt(t.fee) || 0;
            const min = minFee ? parseInt(minFee) : 0;
            const max = maxFee ? parseInt(maxFee) : 100000;
            return feeVal >= min && feeVal <= max;
        });
    }

    return res.status(200).json(new ApiResponse(200, teachers, "Teachers fetched successfully"));
});

// ==================================================
// 4. GET SINGLE TEACHER PROFILE (View Details)
// ==================================================
const getTeacherProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) throw new ApiError(400, "Username required");

    const teacher = await Education.findOne({ "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } })
        .select("-EducatorKey -userInfo.password");

    if (!teacher) throw new ApiError(404, "Teacher not found");
    return res.status(200).json(new ApiResponse(200, teacher, "Teacher details fetched"));
});

// ==================================================
// 5. APPLY TO TEACHER (Select)
// ==================================================
const selectTeacher = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    const userId = req.user?._id;

    const currentStudent = await Student.findOne({ "userInfo._id": userId });
    if (!currentStudent) throw new ApiError(404, "Register as student first");

    const updatedTeacher = await Education.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } },
        { $addToSet: { student: currentStudent._id } }, 
        { new: true }
    ).select("-EducatorKey");

    if (!updatedTeacher) throw new ApiError(404, "Teacher not found");

    // Status pending set karein
    currentStudent.message = "pending";
    await currentStudent.save();

    return res.status(200).json(new ApiResponse(200, updatedTeacher, "Applied successfully"));
});

// ==================================================
// 6. STUDENT DASHBOARD (Stats & Status)
// ==================================================
// ==================================================
// 6. STUDENT DASHBOARD (Updated Fix)
// ==================================================
const getStudentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // 1. Student Profile Dhundho
    const currentStudent = await Student.findOne({ "userInfo._id": userId });

    // ✅ FIX: Agar student profile nahi mili, to 404 Error mat phenko.
    // Balki "null" profile return karo taaki frontend crash na ho.
    if (!currentStudent) {
        return res.status(200).json(new ApiResponse(200, {
            profile: null,
            appliedTeachers: [],
            stats: {
                totalApplications: 0,
                currentStatus: "Not Registered",
                totalFees: 0
            }
        }, "New user - No profile created yet"));
    }

    // 2. Agar student mil gaya, to aage ka data fetch karo
    const myTeachers = await Education.find({
        student: currentStudent._id
    }).select("-EducatorKey -userInfo.password");

    const totalApplied = myTeachers.length;
    let totalEstimatedFees = 0;
    myTeachers.forEach(t => { totalEstimatedFees += (parseInt(t.fee) || 0); });

    const dashboardData = {
        profile: currentStudent,
        appliedTeachers: myTeachers,
        stats: {
            totalApplications: totalApplied,
            currentStatus: currentStudent.message,
            totalFees: totalEstimatedFees
        }
    };

    return res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard ready"));
});
// ==================================================
// 7. WITHDRAW APPLICATION
// ==================================================
const withdrawApplication = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    const userId = req.user?._id;

    const currentStudent = await Student.findOne({ "userInfo._id": userId });
    if (!currentStudent) throw new ApiError(404, "Student not found");

    const updatedTeacher = await Education.findOneAndUpdate(
        { "userInfo.username": { $regex: new RegExp("^" + username + "$", "i") } },
        { $pull: { student: currentStudent._id } },
        { new: true }
    );

    if (!updatedTeacher) throw new ApiError(404, "Teacher not found or not applied");
    return res.status(200).json(new ApiResponse(200, null, "Application withdrawn"));
});

// ==================================================
// 8. UPDATE PROFILE
// ==================================================
const updateStudentProfile = asyncHandler(async (req, res) => {
    const { clas, subject, board, location } = req.body;
    const updateFields = {};

    if (clas) updateFields.clas = clas;
    if (subject) updateFields.subject = subject;
    if (board) updateFields.board = board;
    if (location) updateFields.location = location;

    const updatedStudent = await Student.findOneAndUpdate(
        { "userInfo._id": req.user?._id },
        { $set: updateFields },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedStudent, "Profile updated"));
});

// Exports (Dhyan dein yahan function names par)
export { 
    createDetail, loginStudent, getAllTeacher, getTeacherProfile,
    selectTeacher, getStudentDashboard, withdrawApplication, updateStudentProfile 
};