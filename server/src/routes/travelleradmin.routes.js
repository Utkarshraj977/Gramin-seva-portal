import {travellingAdminReg,travellerAdminLogin,allTravellerAdmin,gettravelleradmin,
    getTravellerAdminByParams,getalltravellorAdbycategory,getalltravellorAdbytype,
    deleteServetravelleruser} from "../controllers/travelleradmin.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";  // ✅ import added

const router = Router()

router.route("/traveladminregister").post(verifyJWT,
        upload.fields([
            {
                name: "Driver_License",
                maxCount: 1
            },
            {
                name:"CarPhoto",
                maxCount:1
            }
        ]),
    travellingAdminReg)
router.route("/traveladminlogin").post(verifyJWT,travellerAdminLogin)
router.route("/allTravelAdmin").get(verifyJWT,allTravellerAdmin)
router.route("/gettraveladminbyid").get(verifyJWT,gettravelleradmin)

router.route("/gettraveladmin/:param").get(verifyJWT,getTravellerAdminByParams)
router.route("/gettraveladminCat/:categ").get(getalltravellorAdbycategory)
router.route("/gettraveladminTyp/:type").get(verifyJWT,getalltravellorAdbytype)
router.route("/deleteserveuser/:param").delete(verifyJWT,deleteServetravelleruser)


export default router
