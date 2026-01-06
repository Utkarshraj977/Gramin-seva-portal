import { Router } from 'express';
import {
  createDetail,
  loginTeacher,
  getAllStudent,
  teacherSubmit,
  rejectStudent,       
  removeStudent,       // <--- NEW: Added this import
  updateTeacherProfile,
  getDashboardStats    
} from "../controllers/education.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================
router.route("/login").post(loginTeacher);

// ============================================================================
// PROTECTED ROUTES (Requires Login)
// ============================================================================
router.use(verifyJWT);

// 1. Register Profile
router.route("/register").post(
    upload.fields([{ name: "Education_certificate", maxCount: 1 }]),
    createDetail
);

// 2. Student Management
router.route("/allstudent").post(getAllStudent);               // Fetch List
router.route("/allstudent/submit/:username").post(teacherSubmit); // Accept
router.route("/student/reject/:username").post(rejectStudent);    // Reject
router.route("/student/remove/:username").delete(removeStudent);  // Remove/Delete (New)

// 3. Dashboard & Settings
router.route("/profile/update").patch(updateTeacherProfile);
router.route("/dashboard/stats").get(getDashboardStats);

export default router;