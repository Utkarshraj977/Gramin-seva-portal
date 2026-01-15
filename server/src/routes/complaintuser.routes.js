import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    userregister,
    UserLogin,
    requestConnection, // Renamed from selecteduser to match logic
    acceptRequest,     // New controller for Admin to accept
    getMyStatus,       // New controller for User dashboard
    getuserbyid
} from "../controllers/complaintUser.controller.js";

const router = Router();

// Auth Routes
router.route("/userregister").post(verifyJWT, userregister);
router.route("/userlogin").post(verifyJWT, UserLogin);

// Connection Logic Routes
// 1. User requests connection to an Admin (ID passed in params)
router.route("/select-user/:id").patch(verifyJWT, requestConnection);

// 2. Admin accepts a specific User (User ID passed in body)
router.route("/accept-request").post(verifyJWT, acceptRequest);

// 3. User checks their own current status (Pending/Accepted)
router.route("/my-status").get(verifyJWT, getMyStatus);

// Utility
router.route("/getuserbyid").get(verifyJWT, getuserbyid);

export default router;
