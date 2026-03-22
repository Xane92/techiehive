const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const { pool } = require("../db");

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const SALT_ROUNDS = 10;
const FRONTEND_URL = "https://techiehive-techiehive.vercel.app";

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/auth/register", async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "full_name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, 'student') RETURNING id, full_name, email, role, created_at",
      [full_name.trim(), email.toLowerCase().trim(), password_hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const userResult = await pool.query(
      "SELECT id, full_name FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    // Always return success to prevent email enumeration
    if (userResult.rows.length === 0) {
      return res.json({ success: true });
    }

    const user = userResult.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      "INSERT INTO reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Techiehive <onboarding@resend.dev>",
      to: email.trim(),
      subject: "Reset Your Techiehive Password",
      text: `Hi ${user.full_name},\n\nClick the link below to reset your password. This link expires in 1 hour.\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n\n— Techiehive Team`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
          <div style="background:#0A0A0A;padding:24px 28px;">
            <span style="color:#F5C400;font-size:1.2rem;font-weight:800;">Techiehive</span>
          </div>
          <div style="padding:32px 28px;">
            <h2 style="color:#111;margin-top:0;font-size:1.3rem;">Reset Your Password</h2>
            <p style="color:#444;font-size:0.95rem;line-height:1.6;">Hi <strong>${user.full_name}</strong>,</p>
            <p style="color:#444;font-size:0.95rem;line-height:1.6;">
              We received a request to reset your Techiehive password. Click the button below to set a new password. This link will expire in <strong>1 hour</strong>.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetLink}" style="background:#F5C400;color:#0A0A0A;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:0.95rem;display:inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color:#888;font-size:0.82rem;line-height:1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetLink}" style="color:#F5C400;word-break:break-all;">${resetLink}</a>
            </p>
            <p style="color:#888;font-size:0.82rem;margin-top:24px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f0f0f0;padding:16px 28px;font-size:0.78rem;color:#888;">
            © Techiehive · techiehive001@gmail.com
          </div>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const result = await pool.query(
      "SELECT id, user_id, expires_at, used FROM reset_tokens WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset link." });
    }

    const row = result.rows[0];

    if (row.used) {
      return res.status(400).json({ error: "This reset link has already been used." });
    }

    if (new Date(row.expires_at) < new Date()) {
      return res.status(400).json({ error: "This reset link has expired. Please request a new one." });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [password_hash, row.user_id]);
    await pool.query("UPDATE reset_tokens SET used = TRUE WHERE id = $1", [row.id]);

    return res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
