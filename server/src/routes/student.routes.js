import { Router } from 'express';
import {
  createDetail,
  loginStudent,
//   getAllStudent,
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router();
router.use(verifyJWT);

router.route("/register").post(createDetail);


router.route("/login").post(loginStudent)
// router.route("/allstudent").post(getAllStudent)

export default router;
