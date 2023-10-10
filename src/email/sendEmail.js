import nodemailer from "nodemailer";
import { emailTemplete } from "./emailTemplete.js";

export default async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <process.env.EMAIL_SENDER>',
    to: options.email,
    subject: "Hello ✔",
    text: "first",
    html: emailTemplete(options),
  });

  console.log("Message sent: %s", info);
}
