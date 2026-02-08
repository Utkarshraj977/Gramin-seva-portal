import { Router } from 'express';
import {
  registerCyberUser,
  loginCyberUser,
  getAllCyberAdmins,
  applyToCyber,
  getCyberUserProfile,
  withdrawApplication,
  updateCyberUserProfile  // Add this
} from "../controllers/cyberUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// Auth & Profile
router.route("/register").post(registerCyberUser);
router.route("/login").post(loginCyberUser);
router.route("/profile")
    .get(getCyberUserProfile)
    .patch(updateCyberUserProfile);  // Add this

// Actions
router.route("/allcyber").get(getAllCyberAdmins);
router.route("/apply/:username").post(applyToCyber);
router.route("/withdraw").post(withdrawApplication);

export default router;