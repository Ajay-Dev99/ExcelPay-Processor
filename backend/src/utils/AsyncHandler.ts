import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
