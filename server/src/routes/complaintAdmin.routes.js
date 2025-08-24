import { Router } from 'express';
import {adminregister,adminlogin,getAllcomplaint,getbyusername,getuserbyid} from "../controllers/complaintAdmin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";  // import added

const router = Router();
router.use(verifyJWT);

router.route("/register").post(
  upload.fields([
    {
      name: "complaintAdmin_certificate",
      maxCount: 1
    }
  ]),
  adminregister
);
router.route("/adminlogin").post(adminlogin);
 router.route("/allcomplaint").post(getAllcomplaint);
 router.route("/:username").post(getbyusername);
router.route("/getuserbyid").get(getuserbyid);

// router.route("/cyberSumbit").post(CyberSumbit);



export default router;