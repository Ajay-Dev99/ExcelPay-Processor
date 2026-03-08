import { Redis } from "ioredis";
import { env } from "./env";

export const redisConnection = new Redis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    maxRetriesPerRequest: null
});