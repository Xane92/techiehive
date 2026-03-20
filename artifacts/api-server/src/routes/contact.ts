import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const EMAIL_USER = "techiehive001@gmail.com";
const EMAIL_PASS = "dyzsar-Wekpi9-kejmoc";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required." });
  }

  try {
    await transporter.sendMail({
      from: `"Techiehive Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email.trim(),
      subject: `New Contact Form Message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
          <div style="background:#0A0A0A;padding:24px 28px;">
            <span style="color:#F5C400;font-size:1.2rem;font-weight:800;">Techiehive</span>
          </div>
          <div style="padding:28px;">
            <h2 style="color:#111;margin-top:0;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
              <tr><td style="padding:10px 0;color:#555;width:90px;vertical-align:top;font-weight:600;">Name</td><td style="padding:10px 0;color:#111;">${name.trim()}</td></tr>
              <tr><td style="padding:10px 0;color:#555;vertical-align:top;font-weight:600;">Email</td><td style="padding:10px 0;"><a href="mailto:${email.trim()}" style="color:#F5C400;">${email.trim()}</a></td></tr>
              <tr><td style="padding:10px 0;color:#555;vertical-align:top;font-weight:600;">Message</td><td style="padding:10px 0;color:#111;white-space:pre-line;">${message.trim()}</td></tr>
            </table>
          </div>
          <div style="background:#f0f0f0;padding:16px 28px;font-size:0.8rem;color:#888;">
            Sent via Techiehive contact form · techiehive001@gmail.com
          </div>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
