import { Response } from 'express';

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ApiResponseBody<T> {
    success: boolean;
    message: string;
    data: T | null;
    pagination?: Pagination;
    timestamp: string;
}

class ApiResponse<T = unknown> implements ApiResponseBody<T> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly data: T | null;
    public readonly pagination?: Pagination;
    public readonly timestamp: string;

    private constructor(statusCode: number, data: T | null, message: string = 'Success', pagination?: Pagination) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
        if (pagination) {
            this.pagination = pagination;
        }
    }

    static success<T>(res: Response, data: T, message: string = 'Operation successful', statusCode: number = 200): Response {
        return res.status(statusCode).json(new ApiResponse<T>(statusCode, data, message));
    }

    static created<T>(res: Response, data: T, message: string = 'Resource created successfully'): Response {
        return res.status(201).json(new ApiResponse<T>(201, data, message));
    }

    static noContent(res: Response): Response {
        return res.status(204).end();
    }

    static paginated<T>(res: Response, data: T[], pagination: Pagination, message: string = 'Operation successful'): Response {
        const response = new ApiResponse<T[]>(200, data, message, pagination);
        return res.status(200).json(response);
    }
}

export default ApiResponse;