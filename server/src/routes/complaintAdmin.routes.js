import { Router } from 'express';
import { 
    adminregister, 
    adminlogin, 
    getAllcomplaint, 
    getuserbyid,
    resolveComplaint,
    rejectComplaint,
    getAdminStats,
    updateAdminProfile,
    getAllOfficials,
    getConnectionRequests,
    handleConnectionRequest
} from "../controllers/complaintAdmin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Authentication
router.route("/register").post(
    verifyJWT,
    upload.fields([{ name: "complaintAdmin_certificate", maxCount: 1 }]),
    adminregister
);
router.route("/login").post(verifyJWT, adminlogin);

// Profile
router.route("/getuserbyid").get(verifyJWT, getuserbyid);
router.route("/profile/update").patch(verifyJWT, updateAdminProfile);

// Dashboard
router.route("/dashboard/stats").get(verifyJWT, getAdminStats);
router.route("/allcomplaints").get(verifyJWT, getAllcomplaint);

// ✅ Connection Requests
router.route("/requests").get(verifyJWT, getConnectionRequests);
router.route("/requests/:status/:userId").patch(verifyJWT, handleConnectionRequest);

// Complaint Actions
router.route("/resolve/:id").patch(verifyJWT, resolveComplaint);
router.route("/reject/:id").patch(verifyJWT, rejectComplaint);

// Public Route
router.route("/public/officials").get(getAllOfficials);

export default router;