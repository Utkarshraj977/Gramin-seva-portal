import { Router } from 'express';
import {
    uploadDocument,
    getRoomDocuments,
    updateDocumentStatus,
    deleteDocument
} from "../controllers/document.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/upload").post(
    upload.fields([{ name: "document", maxCount: 1 }]),
    uploadDocument
);

router.route("/room/:roomId").get(getRoomDocuments);
router.route("/status/:documentId").patch(updateDocumentStatus);
router.route("/delete/:documentId").delete(deleteDocument);

export default router;