import { Router } from "express";
import { previewUpload, uploadExcel, getUploads } from "./upload.controller";
import { uploadFile } from "./upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/preview", authMiddleware, uploadFile.single("file"), previewUpload);
router.post("/", authMiddleware, uploadFile.single("file"), uploadExcel);
router.get("/", authMiddleware, getUploads);

export default router;