import { Router } from "express";
import pkg from "pg";
import { adminAuth } from "../middleware/adminAuth";

const { Pool } = pkg;
const router = Router();
const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

router.get("/admin/users", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.created_at,
        COUNT(DISTINCT e.id)::int AS enrollment_count
      FROM users u
      LEFT JOIN enrollments e ON e.user_id = u.id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    return res.json({ users: result.rows });
  } catch (err) {
    console.error("Admin users error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/enrollments", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        u.full_name AS student_name,
        e.course_id,
        e.amount,
        e.paid_at
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      ORDER BY e.paid_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r,
      course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
    }));
    return res.json({ enrollments: rows });
  } catch (err) {
    console.error("Admin enrollments error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/stats", adminAuth, async (_req, res) => {
  try {
    const [studentsRes, enrollRes, certRes] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'student'"),
      pool.query("SELECT COUNT(*)::int AS count FROM enrollments"),
      pool.query("SELECT COUNT(*)::int AS count FROM certificates"),
    ]);
    return res.json({
      students: studentsRes.rows[0].count,
      enrollments: enrollRes.rows[0].count,
      certificates: certRes.rows[0].count,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/admin/lessons", adminAuth, async (req, res) => {
  const { course_id, title, youtube_url, order_index } = req.body as {
    course_id?: number;
    title?: string;
    youtube_url?: string;
    order_index?: number;
  };

  if (!course_id || !title || !youtube_url || !order_index) {
    return res.status(400).json({ error: "course_id, title, youtube_url, and order_index are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO lessons (course_id, title, youtube_url, order_index) VALUES ($1, $2, $3, $4) RETURNING *",
      [course_id, title.trim(), youtube_url.trim(), order_index]
    );
    return res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    console.error("Admin add lesson error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/admin/lessons/:id", adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, youtube_url, order_index } = req.body as {
    title?: string;
    youtube_url?: string;
    order_index?: number;
  };

  if (!title || !youtube_url || !order_index) {
    return res.status(400).json({ error: "title, youtube_url, and order_index are required." });
  }

  try {
    const result = await pool.query(
      "UPDATE lessons SET title = $1, youtube_url = $2, order_index = $3 WHERE id = $4 RETURNING *",
      [title.trim(), youtube_url.trim(), order_index, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Lesson not found." });
    return res.json({ lesson: result.rows[0] });
  } catch (err) {
    console.error("Admin update lesson error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/admin/lessons/:id", adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query("DELETE FROM lessons WHERE id = $1", [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Admin delete lesson error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/completions", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        u.full_name AS student_name,
        c.course_id,
        c.issued_at
      FROM certificates c
      JOIN users u ON u.id = c.user_id
      ORDER BY c.issued_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r,
      course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
    }));
    return res.json({ completions: rows });
  } catch (err) {
    console.error("Admin completions error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
