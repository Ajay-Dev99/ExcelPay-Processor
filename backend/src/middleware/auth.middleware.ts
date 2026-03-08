import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET!;

export const authMiddleware = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Authorization token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError("Invalid authorization format", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
    };

    (req as any).userId = decoded.userId;

    next();
});