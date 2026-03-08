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
        if ("result" in cell) return Number(cell.result) || 0; // formula cell
        if ("richText" in cell) return 0;                      // rich text, not a number
    }
    return 0;
}

export const uploadWorker = new Worker(
    "excel-processing",
    async (job) => {

        const io = getIO();
        const { uploadId, filePath } = job.data;
        const fullPath = path.join(process.cwd(), filePath);

        console.log("Processing upload:", uploadId);
        let userId = 0;

        try {

            const upload = await prisma.upload.findUnique({
                where: { id: uploadId },
                include: { user: true }
            });


            if (!upload) throw new Error("Upload not found");
            userId = upload?.userId

            if (upload.status !== "processing") {
                console.log("Skipping duplicate processing:", uploadId);
                return;
            }

            let batch: any[] = [];
            let processedRows = 0;

            const workbook = new ExcelJS.stream.xlsx.WorkbookReader(fullPath, {
                entries: "emit",
                sharedStrings: "cache", // cache shared strings (text cells), not all data
                hyperlinks: "ignore",
                styles: "ignore",       // biggest memory saver — skips style parsing
                worksheets: "emit",
            });

            for await (const worksheet of workbook) {
                for await (const row of worksheet) {

                    if (row.number === 1) continue; // skip header row

                    const employeeId = String(row.getCell(1).value ?? "").trim();
                    const employeeName = String(row.getCell(2).value ?? "").trim();

                    if (!employeeId || !employeeName) continue; // skip empty rows

                    const basicPay = getCellNumber(row.getCell(3).value);
                    const variablePay = getCellNumber(row.getCell(4).value);
                    const allowance = getCellNumber(row.getCell(5).value);
                    const bonus = getCellNumber(row.getCell(6).value);
                    const ctc = basicPay + variablePay + allowance + bonus;

                    batch.push({
                        employeeId,
                        employeeName,
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
                        batch = []; // release memory immediately

                        // throttled socket emit — not every batch
                        if (processedRows % EMIT_EVERY === 0) {
                            io.to(`user-${userId}`).emit("upload-progress", { uploadId, processedRows });
                            console.log("Processed rows:", processedRows);

                        }

                        // yield to event loop — prevents freezing other workers/requests
                        await new Promise(resolve => setImmediate(resolve));
                    }
                }
            }

            // flush remaining rows
            if (batch.length > 0) {
                await prisma.employee.createMany({
                    data: batch,
                    skipDuplicates: true
                });
                processedRows += batch.length;
                batch = [];
            }

            const processedAt = new Date();

            await prisma.upload.update({
                where: { id: uploadId },
                data: {
                    status: "completed",
                    processedRows,
                    processedAt
                }
            });

            console.log("Upload completed:", uploadId);

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

        } finally {

            // always clean up — runs on both success and failure
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