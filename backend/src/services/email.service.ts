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

    const isSuccess = status === "completed";

    const mailOptions = {
        from: `"ExcelPay Processor" <${env.SMTP_USER}>`,
        to,
        subject: isSuccess
            ? `✅ Processing Complete — ${fileName}`
            : `❌ Processing Failed — ${fileName}`,
        html: isSuccess ? `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background: #dcfce7; border-radius: 50%; padding: 12px;">
                        <span style="font-size: 28px;">✅</span>
                    </div>
                    <h2 style="color: #16a34a; margin: 12px 0 4px;">Processing Complete</h2>
                    <p style="color: #6b7280; margin: 0;">Your Excel file has been successfully processed.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">File Name</td>
                        <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${fileName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Status</td>
                        <td style="padding: 10px 0; text-align: right;">
                            <span style="background: #dcfce7; color: #16a34a; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;">Completed</span>
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Rows Processed</td>
                        <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${processedRows.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Processed At</td>
                        <td style="padding: 10px 0; color: #111827; font-size: 14px; text-align: right;">${processedAt.toLocaleString()}</td>
                    </tr>
                </table>

                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">ExcelPay Processor — automated notification</p>
            </div>
        ` : `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background: #fee2e2; border-radius: 50%; padding: 12px;">
                        <span style="font-size: 28px;">❌</span>
                    </div>
                    <h2 style="color: #dc2626; margin: 12px 0 4px;">Processing Failed</h2>
                    <p style="color: #6b7280; margin: 0;">Unfortunately your file could not be processed.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">File Name</td>
                        <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${fileName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Status</td>
                        <td style="padding: 10px 0; text-align: right;">
                            <span style="background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;">Failed</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Failed At</td>
                        <td style="padding: 10px 0; color: #111827; font-size: 14px; text-align: right;">${processedAt.toLocaleString()}</td>
                    </tr>
                </table>

                <p style="color: #6b7280; font-size: 13px; text-align: center; margin-bottom: 16px;">Please try uploading the file again. If the issue persists, check that your file follows the correct format.</p>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">ExcelPay Processor — automated notification</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};