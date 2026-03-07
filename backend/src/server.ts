import http from "http";
import { env } from "./config/env";
import app from "./app";

const PORT = env.PORT;


const server = http.createServer(app);



server.listen(PORT, () => {
    console.log(`🚀 ExcelPay Processor running on port ${PORT}`);
});