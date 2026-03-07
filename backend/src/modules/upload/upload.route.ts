import { Router } from "express";
import { uploadExcel } from "./upload.controller";
import { uploadFile } from "./upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const uploadRouter = Router();

uploadRouter.post(
    "/",
    authMiddleware,
    uploadFile.single("file"),
    uploadExcel
);

export default uploadRouter;