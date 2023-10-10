import nodemailer from "nodemailer";
import { codeEmailTemplete } from "./codeEmailTemplete.js";

export default async function codeSendEmail(options) {
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
    html: codeEmailTemplete(options),
  });

  console.log("Message sent: %s", info);
}
