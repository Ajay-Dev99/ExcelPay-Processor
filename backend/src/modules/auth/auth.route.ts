import { Router } from "express";
import { signup, login } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { signupSchema, loginSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/signup", validateRequest(signupSchema), signup);
authRouter.post("/login", validateRequest(loginSchema), login);

export default authRouter;