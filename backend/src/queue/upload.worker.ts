import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { prisma } from "../config/prisma";
import { getIO } from "../config/socket";
import { sendProcessingEmail } from "../services/email.service";

const BATCH_SIZE = 500;
const EMIT_EVERY = 10000;

function getCellNumber(cell: any): number {
    if (!cell) return 0;
    if (typeof cell === "number") return cell;
    if (typeof cell === "string") return Number(cell) || 0;
    if (typeof cell === "object") {
        if ("result" in cell) return Number(cell.result) || 0;
        if ("richText" in cell) return 0;
    }
    return 0;
}

export const uploadWorker = new Worker(
    "excel-processing",
    async (job) => {

        const io = getIO();
        const { uploadId, filePath, mapping } = job.data; // ← get mapping
        const fullPath = path.join(process.cwd(), filePath);

        console.log("Processing upload:", uploadId);
        console.log("Column mapping:", mapping);

        let userId = 0;
        let upload: any = null;

        try {

            upload = await prisma.upload.findUnique({
                where: { id: uploadId },
                include: { user: true }
            });

            if (!upload) throw new Error("Upload not found");
            userId = upload.userId;

            if (upload.status !== "processing") {
                console.log("Skipping duplicate processing:", uploadId);
                return;
            }

            let batch: any[] = [];
            let processedRows = 0;
            let headerIndexMap: Record<string, number> = {};

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
                        row.eachCell((cell, colNumber) => {
                            const val = String(cell.value ?? "").trim();
                            if (val) headerIndexMap[val] = colNumber;
                        });
                        continue;
                    }

                    console.log(headerIndexMap , "map in index")

                    const getVal = (field: string) =>
                        row.getCell(headerIndexMap[mapping[field]] ?? 0).value;

                    const employeeId = String(getVal("employeeId") ?? "").trim();
                    const employeeName = String(getVal("employeeName") ?? "").trim();
                    const department = String(getVal("department") ?? "").trim();

                    if (!employeeId || !employeeName) continue;

                    const basicPay = getCellNumber(getVal("basicPay"));
                    const variablePay = getCellNumber(getVal("variablePay"));
                    const allowance = getCellNumber(getVal("allowance"));
                    const bonus = getCellNumber(getVal("bonus"));
                    const ctc = basicPay + variablePay + allowance + bonus;

                    batch.push({
                        employeeId,
                        employeeName,
                        department,
                        basicPay,
                        variablePay,
                        allowance,
                        bonus,
                        ctc,
                        uploadId
                    });

                    if (batch.length >= BATCH_SIZE) {
                        await prisma.employee.createMany({
                            data: batch,
                            skipDuplicates: true
                        });
                        processedRows += batch.length;
                        batch = [];

                        if (processedRows % EMIT_EVERY === 0) {
                            io.to(`user-${userId}`).emit("upload-progress", { uploadId, processedRows });
                            console.log("Processed rows:", processedRows);
                        }

                        await new Promise(resolve => setImmediate(resolve));
                    }
                }
            }

            if (batch.length > 0) {
                await prisma.employee.createMany({
                    data: batch,
                    skipDuplicates: true
                });
                processedRows += batch.length;
                batch = [];
            }

            if (processedRows === 0) {
                throw new Error("No valid employee rows found in the file");
            }

            const processedAt = new Date();

            await prisma.upload.update({
                where: { id: uploadId },
                data: { status: "completed", processedRows, processedAt }
            });

            io.to(`user-${userId}`).emit("upload-completed", {
                uploadId,
                status: "completed",
                processedRows,
                processedAt
            });

            if (upload.user?.email) {
                await sendProcessingEmail(
                    upload.user.email,
                    upload.fileName,
                    "completed",
                    processedRows,
                    processedAt
                );
            }

        } catch (error) {

            console.error("Worker error:", error);

            await prisma.upload.update({
                where: { id: uploadId },
                data: { status: "failed" }
            });

            io.to(`user-${userId}`).emit("upload-failed", { uploadId });

            if (upload?.user?.email) {
                await sendProcessingEmail(
                    upload.user.email,
                    upload.fileName,
                    "failed",
                    0,
                    new Date()
                );
            }

        } finally {
            try {
                fs.unlinkSync(fullPath);
                console.log("File deleted:", fullPath);
            } catch (err) {
                console.error("File delete failed:", err);
            }
        }
    },
    {
        connection: redisConnection as any,
        concurrency: 2
    }
);