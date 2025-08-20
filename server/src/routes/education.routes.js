import { Router } from 'express';
import {
  createDetail,
  loginTeacher,
  getAllStudent,
} from "../controllers/education.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router();
router.use(verifyJWT);

router.route("/register").post(
  upload.fields([
    {
      name: "Education_certificate",
      maxCount: 1
    }
  ]),
  createDetail
);


router.route("/login").post(loginTeacher)
router.route("/allstudent").post(getAllStudent)

export default router;
