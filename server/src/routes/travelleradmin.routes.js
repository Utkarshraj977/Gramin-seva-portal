import { 
    travellingAdminReg, 
    travellerAdminLogin, 
    allTravellerAdmin, 
    gettravelleradmin,
    getTravellerAdminByParams, 
    getalltravellorAdbycategory, 
    getalltravellorAdbytype,
    leaveAdmin,
    deleteServetravelleruser,
    // ✅ 1. IMPORT THIS NEW CONTROLLER
    acceptTraveller 
} from "../controllers/travelleradmin.controller.js";

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/traveladminregister").post(verifyJWT,
    upload.fields([
        { name: "Driver_License", maxCount: 1 },
        { name: "CarPhoto", maxCount: 1 }
    ]),
    travellingAdminReg
);

router.route("/traveladminlogin").post(verifyJWT, travellerAdminLogin);
router.route("/allTravelAdmin").get(verifyJWT, allTravellerAdmin);
router.route("/gettraveladminbyid").get(verifyJWT, gettravelleradmin);

// Params routes
router.route("/gettraveladmin/:param").get(verifyJWT, getTravellerAdminByParams);
router.route("/gettraveladminCat/:categ").get(getalltravellorAdbycategory);
router.route("/gettraveladminTyp/:type").get(verifyJWT, getalltravellorAdbytype);

// Delete/Reject route
router.route("/deleteserveuser/:param").delete(verifyJWT, deleteServetravelleruser);

// ✅ 2. ADD THIS ACCEPT ROUTE
// This connects the 'Accept' button in frontend to the backend logic
router.route("/accepttraveller/:travellerId").patch(verifyJWT, acceptTraveller);
router.route("/leave-admin/:adminId").patch(verifyJWT, leaveAdmin);

export default router;