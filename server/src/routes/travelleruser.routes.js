import { 
    TravellingUserRegister, 
    TravellingLogin, 
    setuserIntoadmin, 
    travelleruser, 
    cancelRide 
} from "../controllers/travelleruser.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route: /api/v1/traveller/traveluserregister
router.route("/traveluserregister").post(verifyJWT, TravellingUserRegister);

// Route: /api/v1/traveller/traveluserlogin
router.route("/traveluserlogin").post(verifyJWT, TravellingLogin);

// Route: /api/v1/traveller/user (Matches frontend 'fetchUser')
router.route("/user").get(verifyJWT, travelleruser);

// Route: /api/v1/traveller/setuserintoadmin/:id (Changed to POST to match frontend action)
router.route("/setuserintoadmin/:id").post(verifyJWT, setuserIntoadmin);

// Route: /api/v1/traveller/cancelride (Changed to POST because it modifies data)
router.route("/cancelride").post(verifyJWT, cancelRide);

export default router;