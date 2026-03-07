import { Request, Response } from "express";
import { createUpload } from "./upload.service";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

export const uploadExcel = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        throw new AppError("File is required", 400);
    }

    const userId = (req as any).userId;

    const upload = await createUpload(
        file.originalname,
        file.path,
        userId
    );

    return ApiResponse.created(res, {
        uploadId: upload.id,
        status: upload.status
    }, "File uploaded successfully");
});