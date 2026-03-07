import { Router } from "express";
import { uploadExcel, uploadHistory, uploadStatus } from "./upload.controller";
import { uploadFile } from "./upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const uploadRouter = Router();

uploadRouter.post(
    "/",
    authMiddleware,
    uploadFile.single("file"),
    uploadExcel
);

uploadRouter.get("/", authMiddleware, uploadHistory);
uploadRouter.get("/:id/status", authMiddleware, uploadStatus);
export default uploadRouter;