import { doctorRegister,
         doctorLogin,
         getalldoctor,
         getdoctorbyid,
         deleteServePatient,
         alldoctorbycatog,
         alldoctorbytype, 
         getCurrentDoctor
        } from "../controllers/doctor.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/doctorregister").post(verifyJWT,
    upload.fields([
        {
            name: "Doctor_certificate",
            maxCount: 1
        }
    ]),
    doctorRegister
)
router.route("/doctorlogin").post(verifyJWT,doctorLogin)
router.route("/getdoctorbyid/:id").get(verifyJWT,getdoctorbyid)
router.route("/getalldoctor").get(verifyJWT,getalldoctor)
router.route("/currentdoctor").get(verifyJWT,getCurrentDoctor)
router.route("/deleteServePatient/:patientid").patch(verifyJWT,deleteServePatient)
router.route("/alldoctorbycatog/:category").get(verifyJWT,alldoctorbycatog)
router.route("/alldoctorbytype/:type").get(verifyJWT,alldoctorbytype)

export default router
