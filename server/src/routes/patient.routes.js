import {
    PatientLogin,
    PatientRegister,
    requestDoctor,
    getCurrentPatient,
    cancelDoctorRequest,
    removeDoctor,
    updatePatientProfile
} from "../controllers/patient.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/patientregister").post(verifyJWT, PatientRegister)
router.route("/patientlogin").post(verifyJWT, PatientLogin)
router.route("/currentpatient").get(verifyJWT, getCurrentPatient)

// ✅ NEW ROUTES
router.route("/request-doctor/:id").patch(verifyJWT, requestDoctor)
router.route("/cancel-request/:id").patch(verifyJWT, cancelDoctorRequest)
router.route("/remove-doctor/:id").patch(verifyJWT, removeDoctor)
router.route("/update-profile").patch(verifyJWT, updatePatientProfile)

export default router