const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateEnquiry, contactHandler } = require("./contactEnquiry");
const { sendContactMail, recipient, createTransport } = require("./contactMail");

const valid = { name: "Test Buyer", email: "buyer@example.com", phone: "1234567890", subject: "Implant enquiry", message: "Please share your catalogue." };
function response() { return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; }

test("validation trims input and excludes privileged fields", () => {
  const data = validateEnquiry({ ...valid, name: " Buyer ", status: "responded", response: "injected", type: "other" });
  assert.equal(data.name, "Buyer");
  assert.equal(data.status, undefined);
  assert.equal(data.response, undefined);
  assert.equal(data.type, undefined);
});
test("validation rejects missing fields, header injection, objects and oversized content", () => {
  for (const body of [{ ...valid, name: " " }, { ...valid, message: "" }, { ...valid, email: "buyer@example.com\r\nBcc:other@example.com" }, { ...valid, name: {} }, { ...valid, message: "x".repeat(5001) }]) {
    assert.throws(() => validateEnquiry(body));
  }
});
test("invalid submission never saves or sends", async () => {
  const res = response();
  await contactHandler({ Enquiry: { create: () => assert.fail("must not save") }, sendContactMail: () => assert.fail("must not send") })({ body: {} }, res);
  assert.equal(res.statusCode, 400);
});
test("successful submission saves and then emails", async () => {
  const actions = [];
  const res = response();
  await contactHandler({ Enquiry: { create: async (data) => { actions.push("save"); return { ...data, id: 7 }; } }, sendContactMail: async (data) => { actions.push("email"); assert.equal(data.id, 7); } })({ body: valid }, res);
  assert.deepEqual(actions, ["save", "email"]);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.emailSent, true);
  assert.equal(res.body.reference, 7);
  assert.equal(res.body.enquiry, undefined);
});
test("SMTP failure preserves a saved enquiry and returns an honest partial success", async () => {
  let saved = false;
  const res = response();
  await contactHandler({ Enquiry: { create: async (data) => { saved = true; return { ...data, id: 8 }; } }, sendContactMail: async () => { throw Error("SMTP unavailable"); } })({ body: valid }, res);
  assert.equal(saved, true);
  assert.equal(res.statusCode, 202);
  assert.equal(res.body.emailSent, false);
});
test("database failure does not email or report success", async () => {
  const res = response();
  await contactHandler({ Enquiry: { create: async () => { throw Error("offline"); } }, sendContactMail: () => assert.fail("must not email") })({ body: valid }, res);
  assert.equal(res.statusCode, 503);
});
test("mail always targets JD2 and uses the visitor as reply-to", async () => {
  await sendContactMail({ ...valid, id: 9, to: "attacker@example.com" }, { sendMail: async (mail) => {
    assert.equal(mail.to, recipient);
    assert.equal(mail.replyTo, valid.email);
    assert.ok(mail.text.includes(valid.message));
    assert.ok(mail.subject.includes("#9"));
    return { accepted: [recipient] };
  } });
});
test("rejected SMTP recipient and missing SMTP configuration fail explicitly", async () => {
  assert.throws(() => createTransport({}), /not configured/);
  await assert.rejects(sendContactMail({ ...valid, id: 10 }, { sendMail: async () => ({ accepted: [] }) }), /not accepted/);
});
