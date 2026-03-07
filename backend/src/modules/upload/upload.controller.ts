import { Request, Response } from "express";
import { createUpload, getUploadHistory, getUploadStatus } from "./upload.service";
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

export const uploadHistory = asyncHandler(async (req: Request, res: Response) => {

    const userId = (req as any).userId;

    const uploads = await getUploadHistory(userId);

    return ApiResponse.success(res, { uploads }, "Upload history fetched successfully");

});


export const uploadStatus = asyncHandler(async (req: Request, res: Response) => {

    const uploadId = Number(req.params.id);
    const userId = (req as any).userId;

    const status = await getUploadStatus(uploadId, userId);

    return ApiResponse.success(res, { status }, "Upload status fetched successfully");

});