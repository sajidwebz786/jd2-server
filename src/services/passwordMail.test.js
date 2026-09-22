const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildResetToken, sendPasswordResetEmail, sendPasswordChangedNotification } = require("./passwordMail");

const admin = { id: 1, name: "JD2 Admin", email: "admin@jd2meditech.com" };

function fakeTransport() {
  const calls = [];
  const transport = {
    sendMail: async (mail) => {
      calls.push(mail);
      return { accepted: [mail.to] };
    }
  };
  transport.calls = calls;
  return transport;
}

test("buildResetToken generates a 64-character hex string", () => {
  const token = buildResetToken();
  assert.equal(token.length, 64);
  assert.match(token, /^[0-9a-f]{64}$/);
  assert.notEqual(token, buildResetToken());
});

test("sendPasswordResetEmail sends a link to the admin email with a 1-hour token", async () => {
  const transport = fakeTransport();
  const token = buildResetToken();
  await sendPasswordResetEmail(admin, token, transport);
  const mail = transport.calls[0];
  assert.equal(mail.to, admin.email);
  assert.equal(mail.subject, "JD2 Admin Password Reset");
  assert.ok(mail.text.includes(token));
  assert.ok(mail.text.includes("/admin/reset-password?token="));
  assert.ok(mail.text.includes("expires in 1 hour"));
});

test("sendPasswordChangedNotification sends a confirmation email to the admin", async () => {
  const transport = fakeTransport();
  await sendPasswordChangedNotification(admin, transport);
  const mail = transport.calls[0];
  assert.equal(mail.to, admin.email);
  assert.equal(mail.subject, "JD2 Admin Password Changed");
  assert.ok(mail.text.includes(admin.email));
  assert.ok(mail.text.includes("successfully changed"));
});

test("reset email does not accept a spoofed recipient", async () => {
  const transport = fakeTransport();
  const token = buildResetToken();
  await sendPasswordResetEmail({ ...admin, email: "attacker@example.com" }, token, transport);
  const mail = transport.calls[0];
  assert.equal(mail.to, "attacker@example.com");
  assert.ok(!mail.text.includes("Bcc:"));
});

test("notification email does not accept a spoofed recipient", async () => {
  const transport = fakeTransport();
  await sendPasswordChangedNotification({ ...admin, email: "attacker@example.com" }, transport);
  const mail = transport.calls[0];
  assert.equal(mail.to, "attacker@example.com");
  assert.ok(!mail.text.includes("Bcc:"));
});

test("sendPasswordResetEmail rejects when SMTP is not configured", async () => {
  const original = { ...process.env };
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  try {
    await assert.rejects(() => sendPasswordResetEmail(admin, "token"), /not configured/);
  } finally {
    Object.assign(process.env, original);
  }
});
