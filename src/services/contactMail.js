const nodemailer = require("nodemailer");

const recipient = "jd2meditechpvtltd@gmail.com";

function createTransport(env = process.env) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("SMTP is not configured");
  }
  const port = Number(env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  });
}

async function sendContactMail(enquiry, transport = createTransport()) {
  const result = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipient,
    replyTo: enquiry.email,
    subject: `Website enquiry #${enquiry.id}: ${(enquiry.subject || "Contact feedback").replace(/[\r\n]/g, " ")}`,
    text: `New website enquiry\n\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone || "Not provided"}\nSubject: ${enquiry.subject || "Contact feedback"}\n\n${enquiry.message}\n\nReference: ${enquiry.id}`
  });
  if (!result.accepted?.some((address) => String(address).toLowerCase() === recipient)) {
    throw new Error("Recipient was not accepted by the mail server");
  }
}

module.exports = { createTransport, sendContactMail, recipient };
