import { Router } from 'express';
import {
  resistorCyberUser,
  loginCyberUser,
  getAllCyber,
  slectCyber,
//   getAllStudent,
} from "../controllers/cyberUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router();
router.use(verifyJWT);

router.route("/register").post(resistorCyberUser);


router.route("/login").post(loginCyberUser)
router.route("/allcyber").post(getAllCyber)
router.route("/allcyber/:username").get(verifyJWT, slectCyber)

export default router;
