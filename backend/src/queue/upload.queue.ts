import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const uploadQueue = new Queue("excel-processing", {
    connection: redisConnection as any
});