import { Router } from 'express';
import { 
    adminregister, 
    adminlogin, 
    getAllcomplaint, 
    getbyusername, 
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

// --- AUTH ROUTES ---
// Admin Register (Certificate Upload ke sath)
router.route("/register").post(
    verifyJWT,
    upload.fields([
        {
            name: "complaintAdmin_certificate",
            maxCount: 1
        }
    ]),
    adminregister
);

router.route("/login").post(verifyJWT, adminlogin);

// --- DASHBOARD & PROFILE ---
router.route("/dashboard/stats").get(verifyJWT, getAdminStats); // New Stats Route
router.route("/profile/update").patch(verifyJWT, updateAdminProfile);
router.route("/getuserbyid").get(verifyJWT, getuserbyid);
router.route("/admin/:username").get(verifyJWT, getbyusername);

// --- COMPLAINT MANAGEMENT ---
router.route("/allcomplaints").get(verifyJWT, getAllcomplaint); // Note: Method GET kar diya hai (Standard)
router.route("/public/officials").get( getAllOfficials);
// Actions on Complaints
router.route("/resolve/:id").patch(verifyJWT, resolveComplaint); // Status -> Resolved
router.route("/reject/:id").patch(verifyJWT, rejectComplaint);   // Status -> Rejected

router.route("/requests").get(verifyJWT, getConnectionRequests);
router.route("/connection/:status/:userId").post(verifyJWT, handleConnectionRequest);

export default router;