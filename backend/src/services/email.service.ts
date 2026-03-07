import nodemailer from "nodemailer";
import { env } from "../config/env";


const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

export const sendProcessingEmail = async (
    to: string,
    fileName: string,
    status: string,
    processedRows: number,
    processedAt: Date
) => {

    console.log("env loading check", env.SMTP_HOST, env.SMTP_PORT, env.SMTP_USER, env.SMTP_PASS)


    const mailOptions = {
        from: `"ExcelPay Processor" <${env.SMTP_USER}>`,
        to,
        subject: "Excel File Processing Completed",
        html: `
      <h2>Excel Processing Completed</h2>

      <p><strong>File Name:</strong> ${fileName}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Processed Rows:</strong> ${processedRows}</p>
      <p><strong>Processed At:</strong> ${processedAt}</p>

      <p>Your Excel file has been successfully processed.</p>
    `
    };

    await transporter.sendMail(mailOptions);
};