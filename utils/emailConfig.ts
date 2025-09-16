import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // auto set based on port
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // sometimes needed for self-hosted mail servers
  },
});

export const getMailOptions = (
  toEmail: string,
  subject: string,
  htmlContent: string,
  attachments: any[] = []
) => ({
  from: `"SohCahToa Onboarding Form" <${process.env.SMTP_USER}>`,
  to: toEmail,
  subject,
  html: htmlContent,
  attachments,
});
