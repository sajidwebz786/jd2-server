function validateEnquiry(body) {
  const values = {};
  const limits = { name: 150, email: 254, phone: 40, subject: 200, message: 5000 };
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] != null && typeof body[key] !== "string") throw new Error(`Invalid ${key}`);
    values[key] = (body[key] || "").trim();
    if (values[key].length > limit) throw new Error(`${key} exceeds ${limit} characters`);
  }
  if (!values.name || !values.message) throw new Error("Name and message are required");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) throw new Error("A valid email address is required");
  return values;
}

function contactHandler({ Enquiry, sendContactMail }) {
  return async (req, res) => {
    let values;
    try { values = validateEnquiry(req.body || {}); }
    catch (error) { return res.status(400).json({ message: error.message }); }
    let enquiry;
    try { enquiry = await Enquiry.create({ ...values, type: "contact", status: "new" }); }
    catch { return res.status(503).json({ message: "We could not save your message. Please try again or email jd2meditechpvtltd@gmail.com." }); }
    try {
      await sendContactMail(enquiry);
      return res.status(201).json({ message: "Your message has been saved and emailed to our team.", emailSent: true, reference: enquiry.id });
    } catch {
      // The message remains in the admin inbox even if the SMTP service fails.
      console.error(`Contact email delivery failed for enquiry ${enquiry.id}`);
      return res.status(202).json({ message: "Your message was saved for our team, but the email notification could not be delivered. For urgent enquiries, email jd2meditechpvtltd@gmail.com or call +91 99595 97383.", emailSent: false, reference: enquiry.id });
    }
  };
}

module.exports = { validateEnquiry, contactHandler };
