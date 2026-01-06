import { Router } from 'express';
import {
  createDetail,
  loginTeacher,
  getAllStudent,
  teacherSubmit,
  rejectStudent,       // New
  updateTeacherProfile,// New
  getDashboardStats    // New
} from "../controllers/education.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Route
router.route("/login").post(loginTeacher);

// Protected Routes
router.use(verifyJWT);

router.route("/register").post(
    upload.fields([{ name: "Education_certificate", maxCount: 1 }]),
    createDetail
);

router.route("/allstudent").post(getAllStudent);
router.route("/allstudent/submit/:username").post(teacherSubmit);

// 👇 Ye Routes Missing the, isliye 404 aa raha tha
router.route("/student/reject/:username").post(rejectStudent);
router.route("/profile/update").patch(updateTeacherProfile);
router.route("/dashboard/stats").get(getDashboardStats);

export default router;