import {TravellingUserRegister,TravellingLogin,setuserIntoadmin,travelleruser} from "../controllers/travelleruser.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/traveluserregister").post(verifyJWT,TravellingUserRegister)
router.route("/traveluserlogin").post(verifyJWT,TravellingLogin)
router.route("/setuserIntoadmin/:id").patch(verifyJWT,setuserIntoadmin)
router.route("/getuserbyid").get(verifyJWT,travelleruser)


export default router

