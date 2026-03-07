import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/appError";

export const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body ?? {});
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const zodError = error as any;
                const message = zodError.issues.map((err: any) => {
                    return err.message;
                }).join(', ');
                return next(new AppError(message, 400, "VALIDATION_ERROR"));
            }
            next(error);
        }
    };
};
