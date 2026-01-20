import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Gramin Seva" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error("Mail Error:", error);
    return false;
  }
};
