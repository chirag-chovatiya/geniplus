import { createTransport, nodemailer } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (obj) => {
  try {
    const transporter = createTransport({
      // host: "smtp.gmail.com",
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.PASSWORD,
      },
      timeout: 5000,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: obj.receivers,
      subject: obj.subject,
      text: obj.text,
      html:obj.html
    });

    console.log("info==>", info);
    return info;
  } catch (error) {
    throw error;
  }
};
