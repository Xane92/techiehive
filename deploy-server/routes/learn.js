const { Router } = require("express");
const { pool } = require("../db");

const router = Router();

router.get("/courses/:courseId/lessons", async (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) return res.status(400).json({ error: "Invalid courseId." });

  try {
    const result = await pool.query(
      "SELECT id, course_id, title, youtube_url, order_index FROM lessons WHERE course_id = $1 ORDER BY order_index ASC",
      [courseId]
    );
    return res.json({ lessons: result.rows });
  } catch (err) {
    console.error("Lessons fetch error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/progress/complete", async (req, res) => {
  const { userId, lessonId } = req.body;
  if (!userId || !lessonId) return res.status(400).json({ error: "userId and lessonId are required." });

  try {
    await pool.query(
      `INSERT INTO progress (user_id, lesson_id, completed, completed_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = TRUE, completed_at = NOW()`,
      [userId, lessonId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Progress complete error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/progress/:userId/:courseId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(userId) || isNaN(courseId)) return res.status(400).json({ error: "Invalid userId or courseId." });

  try {
    const result = await pool.query(
      `SELECT p.lesson_id FROM progress p
       JOIN lessons l ON l.id = p.lesson_id
       WHERE p.user_id = $1 AND l.course_id = $2 AND p.completed = TRUE`,
      [userId, courseId]
    );
    const completedLessonIds = result.rows.map((r) => r.lesson_id);
    return res.json({ completedLessonIds });
  } catch (err) {
    console.error("Progress fetch error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
