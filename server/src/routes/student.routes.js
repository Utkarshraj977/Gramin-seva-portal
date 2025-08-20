import { Router } from 'express';
import {
  createDetail,
  loginStudent,
  getAllTeacher,
  slectTeacher,
//   getAllStudent,
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router();
router.use(verifyJWT);

router.route("/register").post(createDetail);


router.route("/login").post(loginStudent)
router.route("/allteacher").post(getAllTeacher)
router.route("/allteacher/:username").get(verifyJWT, slectTeacher)

export default router;
