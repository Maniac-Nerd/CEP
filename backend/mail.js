const nodemailer = require("nodemailer");

async function sendReplyEmail({ to, name, reply }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user;

  if (!host || !user || !pass || !from) {
    return { sent: false };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Your EverLocker support reply",
    text: `Hello ${name || "there"},\n\nAn admin has replied to your EverLocker query:\n\n${reply}\n\nPlease do not share OTPs or sensitive identity details by email.\n\nEverLocker support`
  });

  return { sent: true };
}

module.exports = { sendReplyEmail };