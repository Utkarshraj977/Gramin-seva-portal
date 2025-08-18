import { doctorRegister, doctorLogin } from "../controllers/doctor.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.route("/doctorregister").post(
    upload.fields([
        {
            name: "Doctor_certificate",
            maxCount: 1
        }
    ]),
    doctorRegister
)

router.route("/doctorlogin").post(doctorLogin)

export default router
