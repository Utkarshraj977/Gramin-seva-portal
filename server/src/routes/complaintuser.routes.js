import {userregister,UserLogin,selecteduser,getuserbyid} from "../controllers/complaintUser.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/userregister").post(verifyJWT,userregister)
router.route("/userlogin").post(verifyJWT,UserLogin)
router.route("/selectuser/:id").patch(verifyJWT,selecteduser)
router.route("/getuserbyid").get(verifyJWT,getuserbyid)

export default router

