import dotenv from "dotenv";

dotenv.config();
console.log(process.env.PORT, "env from .env")
export const env = {
    PORT: process.env.PORT || "5000",
    NODE_ENV: process.env.NODE_ENV || "development"
};