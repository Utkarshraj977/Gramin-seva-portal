import { Router } from 'express';
import {
  createDetail,
  loginTeacher,
  getAllStudent,
  teacherSumbit,
} from "../controllers/education.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ==================================================
// 1. PUBLIC ROUTES (Jo bina Login ke chalenge)
// ==================================================

// Login ko sabse upar rakho taaki ispe verifyJWT ka asar na ho
router.route("/login").post(loginTeacher);


// ==================================================
// 2. SECURE ROUTES (Jinke liye Login zaroori hai)
// ==================================================

// Ab is line ke neeche jo bhi route hoga, uspe apne aap Token check hoga
router.use(verifyJWT); 

router.route("/register").post(
    // Yahan alag se verifyJWT likhne ki zaroorat nahi hai, upar router.use ne laga diya hai
    upload.fields([
        {
            name: "Education_certificate",
            maxCount: 1
        }
    ]),
    createDetail
);

router.route("/allstudent").post(getAllStudent);
router.route("/allstudent/sumbit/:username").post(teacherSumbit);

export default router;