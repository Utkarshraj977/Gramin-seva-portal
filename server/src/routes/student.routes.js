import { Router } from 'express';
import {
  createDetail,
  loginStudent,
  getAllTeacher,
  selectTeacher,      // Spelling corrected (slect -> select)
  getStudentDashboard, // New Feature
  updateStudentProfile,// New Feature
  withdrawApplication  // New Feature
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ==================================================
// 1. PUBLIC ROUTE (Bina Token ke Login)
// ==================================================
// Isko sabse upar rakhna zaroori hai
router.route("/login").post(loginStudent);


// ==================================================
// 2. PROTECTED ROUTES (Login hona zaroori hai)
// ==================================================
// Is line ke niche sab routes par Token check hoga
router.use(verifyJWT);

// Register Student Profile
router.route("/register").post(createDetail);

// Get All Teachers List
router.route("/allteacher").post(getAllTeacher);

// Apply to a specific Teacher (Select Teacher)
router.route("/allteacher/:username").get(selectTeacher);

// 👇 NEW DASHBOARD ROUTES 👇

// Student Dashboard Stats (Applied teachers, status, etc.)
router.route("/dashboard").get(getStudentDashboard);

// Update Class/Subject/Board
router.route("/profile/update").patch(updateStudentProfile);

// Withdraw Application (Remove teacher)
router.route("/withdraw/:username").post(withdrawApplication);

export default router;