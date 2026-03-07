import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const uploadQueue = new Queue("excel-processing", {
    connection: redisConnection as any,
    defaultJobOptions: {

        removeOnComplete: true,
        removeOnFail: false,

        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 2000
        }

    }
});