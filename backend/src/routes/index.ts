import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import uploadRouter from "../modules/upload/upload.route";

const router = Router();


router.use("/auth", authRouter);
router.use("/upload", uploadRouter);

export default router;
