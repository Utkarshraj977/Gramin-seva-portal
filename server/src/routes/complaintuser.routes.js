import { Router } from "express";
import { 
    userregister, 
    UserLogin, 
    connectToAdmin,
    fileComplaint, 
    getUserDashboard, 
    deleteComplaint, 
    getComplaintDetails
} from "../controllers/complaintUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Authentication
router.route("/register").post(verifyJWT, userregister);
router.route("/login").post(verifyJWT, UserLogin);

// Dashboard
router.route("/dashboard").get(verifyJWT, getUserDashboard);

// ✅ Connection Management
router.route("/connect/:adminId").post(verifyJWT, connectToAdmin);

// ✅ File Complaint (to specific connected admin)
router.route("/file-complaint/:adminId").post(
    verifyJWT,
    upload.fields([{ name: "complaintImage", maxCount: 1 }]),
    fileComplaint
);

// Complaint Management
router.route("/details/:id").get(verifyJWT, getComplaintDetails);
router.route("/withdraw/:id").delete(verifyJWT, deleteComplaint);

export default router;