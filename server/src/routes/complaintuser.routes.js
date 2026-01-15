import { Router } from "express";
import { 
    userregister, 
    UserLogin, 
    fileComplaint, 
    getUserDashboard, 
    getAllPublicComplaints, 
    deleteComplaint, 
    getComplaintDetails, 
    connectToAdmin
} from "../controllers/complaintUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Route (Bina Login ke dekhne ke liye)
router.route("/public-feed").get(getAllPublicComplaints);

// --- SECURED ROUTES (Login Required) ---
// Note: Iska matlab user ko pehle main website par login hona padega
router.use(verifyJWT);

// Register Route (Ab ye Image + Data dono lega)
router.route("/register").post(
    upload.fields([
        {
            name: "complaintImage", // Frontend se field name yahi hona chahiye
            maxCount: 1
        }
    ]),
    verifyJWT,userregister
);

// Login Route
router.route("/login").post( verifyJWT, UserLogin);

// Existing User Add Complaint Route
router.route("/add").post(
    upload.fields([
        {
            name: "complaintImage",
            maxCount: 1
        }
    ]),
    verifyJWT,fileComplaint
);

router.route("/dashboard").get( getUserDashboard);
router.route("/details/:id").get(verifyJWT, getComplaintDetails);
router.route("/withdraw/:id").delete(verifyJWT ,deleteComplaint);
router.route("/connect/:adminId").post(verifyJWT, connectToAdmin);
export default router;