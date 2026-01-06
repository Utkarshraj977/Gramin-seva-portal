import { Router } from 'express';
import {
  registerCyberUser,
  loginCyberUser,
  getAllCyberAdmins,
  applyToCyber,
  getCyberUserProfile,
  withdrawApplication
} from "../controllers/cyberUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// Auth & Profile
router.route("/register").post(registerCyberUser);
router.route("/login").post(loginCyberUser);
router.route("/profile").get(getCyberUserProfile);

// Actions
router.route("/allcyber").get(getAllCyberAdmins);      // List shops
router.route("/apply/:username").post(applyToCyber);   // Apply
router.route("/withdraw").post(withdrawApplication);   // Cancel

export default router;