import { Request, Response } from "express";
import { createUpload, getUploadHistory } from "./upload.service";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

// Preview — read headers only
export const previewUpload = asyncHandler(async (req: Request, res: Response) => {

    const file = req.file;
    if (!file) throw new AppError("File is required", 400);

    const fullPath = path.join(process.cwd(), file.path);

    try {
        const headers: string[] = [];

        const workbook = new ExcelJS.stream.xlsx.WorkbookReader(fullPath, {
            entries: "emit",
            sharedStrings: "cache",
            hyperlinks: "ignore",
            styles: "ignore",
            worksheets: "emit",
        });

        for await (const worksheet of workbook) {
            for await (const row of worksheet) {
                if (row.number === 1) {
                    row.eachCell((cell) => {
                        const val = String(cell.value ?? "").trim();
                        if (val) headers.push(val);
                    });
                    break;
                }
            }
            break;
        }

        return ApiResponse.success(res, { headers }, "Headers fetched successfully");

    } finally {
        try { fs.unlinkSync(fullPath); } catch { }
    }
});

// Upload — with column mapping
export const uploadExcel = asyncHandler(async (req: Request, res: Response) => {

    const file = req.file;
    const userId = (req as any).userId;

    if (!file) throw new AppError("File is required", 400);

    const mappingRaw = req.body.mapping;
    if (!mappingRaw) throw new AppError("Column mapping is required", 400);

    let mapping: Record<string, string>;
    try {
        mapping = JSON.parse(mappingRaw);
    } catch {
        throw new AppError("Invalid column mapping format", 400);
    }

    const required = ["employeeId", "employeeName", "department", "basicPay", "variablePay", "allowance", "bonus"];
    const missing = required.filter(k => !mapping[k]);
    if (missing.length > 0) {
        throw new AppError(`Missing column mapping for: ${missing.join(", ")}`, 400);
    }

    const upload = await createUpload(file.originalname, file.path, userId, mapping);

    return ApiResponse.created(res, { uploadId: upload.id }, "File uploaded successfully");
});

// Get upload history
export const getUploads = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const uploads = await getUploadHistory(userId);
    return ApiResponse.success(res, { uploads }, "Uploads fetched successfully");
});