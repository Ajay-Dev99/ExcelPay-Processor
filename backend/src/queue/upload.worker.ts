import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { prisma } from "../config/prisma";
import { getIO } from "../config/socket";
import { sendProcessingEmail } from "../services/email.service";

const BATCH_SIZE = 1000;

export const uploadWorker = new Worker(
    "excel-processing",
    async (job) => {

        const io = getIO();

        try {

            const { uploadId, filePath } = job.data;

            console.log("Processing upload:", uploadId);

            const upload = await prisma.upload.findUnique({
                where: { id: uploadId },
                include: { user: true }
            });

            if (!upload) {
                throw new Error("Upload not found");
            }

            if (upload.status !== "processing") {
                console.log("Skipping duplicate processing:", uploadId);
                return;
            }

            const fullPath = path.join(process.cwd(), filePath);

            const workbook = new ExcelJS.stream.xlsx.WorkbookReader(fullPath, {});

            let batch: any[] = [];
            let processedRows = 0;
            let totalRows = 0;

            const tempWorkbook = new ExcelJS.Workbook();
            await tempWorkbook.xlsx.readFile(fullPath);

            const sheet = tempWorkbook.worksheets[0];
            totalRows = sheet.rowCount - 1;

            await prisma.upload.update({
                where: { id: uploadId },
                data: { totalRows }
            });

            for await (const worksheet of workbook) {

                for await (const row of worksheet) {

                    if (row.number === 1) continue;

                    const employeeId = String(row.getCell(1).value || "");
                    const employeeName = String(row.getCell(2).value || "");

                    const basicPay = Number(row.getCell(3).value || 0);
                    const variablePay = Number(row.getCell(4).value || 0);
                    const allowance = Number(row.getCell(5).value || 0);
                    const bonus = Number(row.getCell(6).value || 0);

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
                            data: batch
                        });

                        processedRows += batch.length;
                        batch = [];

                        const progress = Math.floor((processedRows / totalRows) * 100);

                        io.emit("upload-progress", {
                            uploadId,
                            processedRows,
                            totalRows,
                            progress
                        });

                        console.log("Processed rows:", processedRows);
                    }

                }

            }

            if (batch.length > 0) {

                await prisma.employee.createMany({
                    data: batch
                });

                processedRows += batch.length;

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

            io.emit("upload-completed", {
                uploadId,
                status: "completed",
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

            try {

                fs.unlinkSync(fullPath);

                console.log("File deleted:", fullPath);

            } catch (err) {

                console.error("File delete failed:", err);

            }

        } catch (error) {

            console.error("Worker error:", error);

            await prisma.upload.update({
                where: { id: job.data.uploadId },
                data: { status: "failed" }
            });

            const io = getIO();

            io.emit("upload-failed", {
                uploadId: job.data.uploadId,
                status: "failed",
                processedAt: new Date()
            });

        }

    },
    {
        connection: redisConnection as any
    }
);