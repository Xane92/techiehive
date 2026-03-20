import { Router } from "express";
import pkg from "pg";

const { Pool } = pkg;
const router = Router();
const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

router.get("/questions/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) return res.status(400).json({ error: "Invalid courseId." });

  try {
    const result = await pool.query(
      "SELECT id, course_id, question, option_a, option_b, option_c, option_d FROM questions WHERE course_id = $1 ORDER BY id ASC",
      [courseId]
    );
    return res.json({ questions: result.rows });
  } catch (err) {
    console.error("Questions fetch error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/test/submit", async (req, res) => {
  const { userId, courseId, answers } = req.body as {
    userId?: number;
    courseId?: number;
    answers?: Record<number, string>;
  };

  if (!userId || !courseId || !answers) {
    return res.status(400).json({ error: "userId, courseId, and answers are required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, correct_answer FROM questions WHERE course_id = $1 ORDER BY id ASC",
      [courseId]
    );

    const questions = result.rows as { id: number; correct_answer: string }[];
    let score = 0;
    for (const q of questions) {
      if ((answers[q.id] ?? "").toUpperCase() === q.correct_answer.toUpperCase()) {
        score++;
      }
    }

    const passed = score >= 3;

    await pool.query(
      "INSERT INTO test_results (user_id, course_id, score, passed) VALUES ($1, $2, $3, $4)",
      [userId, courseId, score, passed]
    );

    if (passed) {
      await pool.query(
        `INSERT INTO certificates (user_id, course_id) VALUES ($1, $2)
         ON CONFLICT (user_id, course_id) DO UPDATE SET issued_at = NOW()`,
        [userId, courseId]
      );
    }

    return res.json({ score, total: questions.length, passed });
  } catch (err) {
    console.error("Test submit error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/certificates/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId." });

  try {
    const result = await pool.query(
      "SELECT id, course_id, issued_at FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC",
      [userId]
    );
    return res.json({ certificates: result.rows });
  } catch (err) {
    console.error("Certificates fetch error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
