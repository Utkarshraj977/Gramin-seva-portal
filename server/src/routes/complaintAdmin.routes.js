import { Router } from 'express';
import {
    adminregister,
    updateComplaintStatus,
    getDashboardData,
    adminlogin,
    getAllcomplaint,
    getbyusername,
    getuserbyid
} from "../controllers/complaintAdmin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

// 1. Static Routes (Specific Paths) - MUST BE AT THE TOP
router.route("/register").post(
  upload.fields([{ name: "complaintAdmin_certificate", maxCount: 1 }]),
  adminregister
);

router.route("/adminlogin").post(adminlogin);
router.route("/allcomplaint").post(getAllcomplaint);
router.route("/getuserbyid").get(getuserbyid);

// ✅ FIX: These specific routes must come BEFORE /:username
router.route("/dashboard").get(getDashboardData);
router.route("/update-status").post(updateComplaintStatus);

// 2. Dynamic Routes (Variable Paths) - MUST BE AT THE BOTTOM
// If this was at the top, it would catch "dashboard" as a username!
router.route("/:username").post(getbyusername);

export default router;
