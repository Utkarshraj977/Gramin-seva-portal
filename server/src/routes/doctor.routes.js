import { 
    doctorRegister,
    doctorLogin,
    getalldoctor,
    getdoctorbyid,
    removePatient,
    alldoctorbycatog,
    alldoctorbytype, 
    getCurrentDoctor,
    acceptPatientRequest,
    rejectPatientRequest,
    updateDoctorProfile
} from "../controllers/doctor.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/doctorregister").post(
    verifyJWT,
    upload.fields([
        {
            name: "Doctor_certificate",
            maxCount: 1
        }
    ]),
    doctorRegister
)

router.route("/doctorlogin").post(verifyJWT, doctorLogin)
router.route("/getdoctorbyid/:id").get(verifyJWT, getdoctorbyid)
router.route("/getalldoctor").get(verifyJWT, getalldoctor)
router.route("/currentdoctor").get(verifyJWT, getCurrentDoctor)
router.route("/removepatient/:patientid").patch(verifyJWT, removePatient)
router.route("/alldoctorbycatog/:category").get(verifyJWT, alldoctorbycatog)
router.route("/alldoctorbytype/:type").get(verifyJWT, alldoctorbytype)

// ✅ NEW ROUTES
router.route("/accept-request/:id").patch(verifyJWT, acceptPatientRequest)
router.route("/reject-request/:id").patch(verifyJWT, rejectPatientRequest)
router.route("/update-profile").patch(verifyJWT, updateDoctorProfile)

export default router