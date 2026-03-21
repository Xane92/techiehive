import { Router } from "express";
import axios from "axios";
import { pool } from "../db";

const router = Router();
const PAYSTACK_SECRET = process.env["PAYSTACK_SECRET_KEY"] ?? "";

router.post("/payment/initialize", async (req, res) => {
  const { email, amount, courseId, callbackUrl } = req.body as {
    email?: string;
    amount?: number;
    courseId?: number;
    callbackUrl?: string;
  };

  if (!email || !amount || !courseId) {
    return res.status(400).json({ error: "email, amount, and courseId are required." });
  }

  try {
    const userLookup = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userLookup.rows.length > 0) {
      const userId: number = userLookup.rows[0].id;
      const existing = await pool.query(
        "SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2",
        [userId, courseId]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "You are already enrolled in this course." });
      }
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "NGN",
        callback_url: callbackUrl ?? "",
        metadata: { courseId },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } = response.data.data;
    return res.json({ authorization_url, reference });
  } catch (err: unknown) {
    console.error("Paystack init error:", err);
    const message =
      axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : "Payment initialization failed.";
    return res.status(502).json({ error: message });
  }
});

router.get("/payment/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    const txData = response.data.data;

    if (txData.status !== "success") {
      return res.status(402).json({ error: "Payment was not successful.", status: txData.status });
    }

    const courseId: number = parseInt(String(txData.metadata?.courseId ?? "0"), 10);
    const amountPaid: number = Math.round(txData.amount / 100);
    const email: string = txData.customer?.email ?? "";

    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const userId: number = userResult.rows[0].id;

    const existing = await pool.query(
      "SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2",
      [userId, courseId]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        "INSERT INTO enrollments (user_id, course_id, amount) VALUES ($1, $2, $3)",
        [userId, courseId, amountPaid]
      );
    }

    return res.json({ success: true, userId, courseId, amount: amountPaid });
  } catch (err: unknown) {
    console.error("Paystack verify error:", err);
    const message =
      axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : "Verification failed.";
    return res.status(502).json({ error: message });
  }
});

router.get("/enrollments/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId." });

  try {
    const result = await pool.query(
      "SELECT id, course_id, paid_at, amount FROM enrollments WHERE user_id = $1 ORDER BY paid_at DESC",
      [userId]
    );
    return res.json({ enrollments: result.rows });
  } catch (err) {
    console.error("Enrollments fetch error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
