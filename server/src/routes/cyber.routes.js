import { Router } from 'express';
import { 
    adminregister, 
    adminlogin, 
    getAllcyberUser, 
    CyberSumbit, 
    getCyberProfile,
    updateCyberProfile,
    getDashboardStats
} from "../controllers/cyber.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Middleware sabke liye
router.use(verifyJWT);

// Auth Routes
router.route("/adminregister").post(
    upload.fields([{ name: "cyber_shopPic", maxCount: 1 }]), 
    adminregister
);
router.route("/adminlogin").post(adminlogin);

// Dashboard Routes
router.route("/profile")
    .get(getCyberProfile)
    .patch(upload.fields([{ name: "cyber_shopPic", maxCount: 1 }]), updateCyberProfile);

router.route("/allcyber").get(getAllcyberUser);  
router.route("/cyberSumbit").post(CyberSumbit);
router.route("/stats").get(getDashboardStats);  

export default router;