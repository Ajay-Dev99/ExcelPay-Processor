import jwt from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET!;

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "1d",
    });
};