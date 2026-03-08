import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');
};

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
};

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        errorCode: err.errorCode
    });
};

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            errorCode: 'INTERNAL_SERVER_ERROR'
        });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Prevent sending response if headers already sent
    if (res.headersSent) {
        return next(err);
    }

    console.log(err, "error in errorHandler");
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const isDevelopment = env.NODE_ENV === 'development' || !env.NODE_ENV;

    if (isDevelopment) {
        sendErrorDev(err, res);
    } else {
        let error = Object.assign({}, err);
        error.message = err.message;
        error.name = err.name;
        error.statusCode = err.statusCode;
        error.isOperational = err.isOperational;
        error.errorCode = err.errorCode;

        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new AppError(
        `Route ${req.originalUrl} not found on this server`,
        404,
        'ROUTE_NOT_FOUND'
    );
    next(err);
};
