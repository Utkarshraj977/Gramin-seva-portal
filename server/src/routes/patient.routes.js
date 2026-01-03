import {PatientLogin,PatientRegister,selectPatient,getCurrentPatient} from "../controllers/patient.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/patientregister").post(verifyJWT,PatientRegister)
router.route("/patientlogin").post(verifyJWT,PatientLogin)
router.route("/selectpatient/:id").patch(verifyJWT,selectPatient)
router.route("/currentpatient").get(verifyJWT,getCurrentPatient)

export default router

