import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";

export const uploadWorker = new Worker(
    "excel-processing",
    async (job) => {
        const { uploadId, filePath } = job.data;

        console.log("Processing upload:", uploadId);
        console.log("File path:", filePath);

        // Excel processing will go here
    },
    {
        connection: redisConnection as any
    }
);