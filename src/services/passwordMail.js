const crypto = require("crypto");
const { createTransport } = require("./contactMail");

const oneHourMs = 60 * 60 * 1000;

function buildResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function tokenExpiry() {
  return new Date(Date.now() + oneHourMs);
}

function baseUrl() {
  return process.env.CLIENT_URL || "https://jd2meditechpvtltd.com";
}

async function sendPasswordResetEmail(adminUser, token, transport = createTransport()) {
  const resetUrl = `${baseUrl()}/admin/reset-password?token=${encodeURIComponent(token)}`;
  const result = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminUser.email,
    subject: "JD2 Admin Password Reset",
    text: `You requested a password reset for the JD2 admin panel.\n\nAdmin email: ${adminUser.email}\n\nUse the link below to choose a new password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this reset, you can safely ignore this email.`
  });
  return result;
}

async function sendPasswordChangedNotification(adminUser, transport = createTransport()) {
  const result = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminUser.email,
    subject: "JD2 Admin Password Changed",
    text: `Your JD2 admin panel password was successfully changed.\n\nAdmin email: ${adminUser.email}\n\nIf you did not make this change, please use the Forgot Password link immediately to reset your password.`
  });
  return result;
}

module.exports = { buildResetToken, tokenExpiry, sendPasswordResetEmail, sendPasswordChangedNotification };
