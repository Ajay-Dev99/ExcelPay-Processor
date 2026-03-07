import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { prisma } from "../config/prisma";

const BATCH_SIZE = 1000;

export const uploadWorker = new Worker(
    "excel-processing",
    async (job) => {
        try {

            const { uploadId, filePath } = job.data;

            console.log("Processing upload:", uploadId);

            const fullPath = path.join(process.cwd(), filePath);

            const workbook = new ExcelJS.stream.xlsx.WorkbookReader(fullPath, {});

            let batch: any[] = [];
            let processedRows = 0;

            for await (const worksheet of workbook) {

                for await (const row of worksheet) {

                    if (row.number === 1) continue;

                    const employeeId = String(row.getCell(1).value || "");
                    const employeeName = String(row.getCell(2).value || "");

                    const basicPay = Number(row.getCell(4).value || 0);
                    const variablePay = Number(row.getCell(5).value || 0);
                    const allowance = Number(row.getCell(6).value || 0);
                    const bonus = Number(row.getCell(7).value || 0);

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

                        console.log("Processed rows:", processedRows);
                    }

                }

            }

            // Insert remaining rows
            if (batch.length > 0) {

                await prisma.employee.createMany({
                    data: batch
                });

                processedRows += batch.length;

            }

            await prisma.upload.update({
                where: { id: uploadId },
                data: {
                    status: "completed",
                    processedRows
                }
            });

            console.log("Upload completed:", uploadId);

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

        }
    },
    {
        connection: redisConnection as any
    }
);