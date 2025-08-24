import { Router } from 'express';
import {adminregister,adminlogin,getAllcyberUser,CyberSumbit} from "../controllers/cyber.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router();
router.use(verifyJWT);

router.route("/adminregister").post(
  upload.fields([
    {
      name: "cyber_shopPic",
      maxCount: 1
    }
  ]),
  adminregister
);
router.route("/adminlogin").post(adminlogin);
router.route("/allcyber").post(getAllcyberUser);
router.route("/cyberSumbit").post(CyberSumbit);



export default router;