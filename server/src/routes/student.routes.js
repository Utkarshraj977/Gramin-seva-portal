import { Router } from 'express';
import {
  createDetail,
  loginStudent,
  getAllTeacher,
  selectTeacher,
  getTeacherProfile,      // New feature to see teacher details
  getStudentDashboard,    // New feature for stats
  updateStudentProfile,   // New feature to edit profile
  withdrawApplication     // New feature to cancel
} from "../controllers/student.controller.js"; // <--- IMPORT PATH FIXED
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ==================================================
// 1. PUBLIC ROUTE
// ==================================================
router.route("/login").post(loginStudent);

// ==================================================
// 2. PROTECTED ROUTES
// ==================================================
router.use(verifyJWT);

// Register
router.route("/register").post(createDetail);

// Get All Teachers (Search & Filter)
// Note: Changed to GET method because we use req.query for filters
router.route("/allteacher").get(getAllTeacher);

// View Specific Teacher Profile (Before Apply)
router.route("/teacher/:username").get(getTeacherProfile);

// Apply to Teacher (Select)
router.route("/apply/:username").post(selectTeacher);

// Dashboard
router.route("/dashboard").get(getStudentDashboard);

// Update Profile
router.route("/profile/update").patch(updateStudentProfile);

// Withdraw
router.route("/withdraw/:username").post(withdrawApplication);

export default router;