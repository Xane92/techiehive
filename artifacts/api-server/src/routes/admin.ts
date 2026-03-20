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
const COURSE_IDS = [1, 2, 3];

router.get("/admin/users", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.full_name, u.email, u.created_at,
        COUNT(DISTINCT e.id)::int AS enrollment_count
      FROM users u
      LEFT JOIN enrollments e ON e.user_id = u.id
      WHERE u.role = 'student'
      GROUP BY u.id ORDER BY u.created_at DESC
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
      SELECT e.id, u.full_name AS student_name, e.course_id, e.amount, e.paid_at
      FROM enrollments e JOIN users u ON u.id = e.user_id ORDER BY e.paid_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r, course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
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
    course_id?: number; title?: string; youtube_url?: string; order_index?: number;
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
    title?: string; youtube_url?: string; order_index?: number;
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
      SELECT c.id, u.full_name AS student_name, c.course_id, c.issued_at
      FROM certificates c JOIN users u ON u.id = c.user_id ORDER BY c.issued_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r, course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
    }));
    return res.json({ completions: rows });
  } catch (err) {
    console.error("Admin completions error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/completions-detail", adminAuth, async (_req, res) => {
  try {
    const [lessonCounts, enrolledStudents, progressRows, testRows, certRows] = await Promise.all([
      pool.query("SELECT course_id, COUNT(*)::int AS total FROM lessons GROUP BY course_id"),
      pool.query(`
        SELECT e.user_id, e.course_id, u.full_name, u.email
        FROM enrollments e JOIN users u ON u.id = e.user_id ORDER BY u.full_name
      `),
      pool.query(`
        SELECT p.user_id, l.course_id, COUNT(*)::int AS completed_count
        FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.completed = TRUE
        GROUP BY p.user_id, l.course_id
      `),
      pool.query(`
        SELECT DISTINCT ON (user_id, course_id) user_id, course_id, score, passed, taken_at
        FROM test_results ORDER BY user_id, course_id, taken_at DESC
      `),
      pool.query("SELECT user_id, course_id, issued_at FROM certificates"),
    ]);

    const lessonCountMap: Record<number, number> = {};
    for (const r of lessonCounts.rows) lessonCountMap[r.course_id] = r.total;

    const progressMap: Record<string, number> = {};
    for (const r of progressRows.rows) progressMap[`${r.user_id}_${r.course_id}`] = r.completed_count;

    const testMap: Record<string, { score: number; passed: boolean }> = {};
    for (const r of testRows.rows) testMap[`${r.user_id}_${r.course_id}`] = { score: r.score, passed: r.passed };

    const certSet = new Set(certRows.rows.map((r: { user_id: number; course_id: number }) => `${r.user_id}_${r.course_id}`));

    const studentProgress = (enrolledStudents.rows as { user_id: number; course_id: number; full_name: string; email: string }[]).map((e) => {
      const key = `${e.user_id}_${e.course_id}`;
      const totalLessons = lessonCountMap[e.course_id] ?? 0;
      const completedLessons = progressMap[key] ?? 0;
      const test = testMap[key];
      const hasCert = certSet.has(key);
      return {
        user_id: e.user_id,
        full_name: e.full_name,
        email: e.email,
        course_id: e.course_id,
        course_name: COURSE_NAMES[e.course_id] ?? `Course #${e.course_id}`,
        lessons_completed: completedLessons,
        total_lessons: totalLessons,
        test_status: !test ? "Not Taken" : test.passed ? "Passed" : "Failed",
        test_score: test ? test.score : null,
        certificate_issued: hasCert,
      };
    });

    const courseSummaries = COURSE_IDS.map((cid) => {
      const enrolled = enrolledStudents.rows.filter((r: { course_id: number }) => r.course_id === cid);
      const total = lessonCountMap[cid] ?? 0;
      const completedAll = enrolled.filter((r: { user_id: number }) => (progressMap[`${r.user_id}_${cid}`] ?? 0) >= total && total > 0).length;
      const passedTest = enrolled.filter((r: { user_id: number }) => testMap[`${r.user_id}_${cid}`]?.passed).length;
      const certs = enrolled.filter((r: { user_id: number }) => certSet.has(`${r.user_id}_${cid}`)).length;
      return {
        course_id: cid,
        course_name: COURSE_NAMES[cid],
        total_enrolled: enrolled.length,
        completed_all_lessons: completedAll,
        passed_test: passedTest,
        certificates_issued: certs,
      };
    });

    return res.json({ courseSummaries, studentProgress });
  } catch (err) {
    console.error("Admin completions-detail error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/tests", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT tr.id, u.id AS user_id, u.full_name AS student_name, tr.course_id,
        tr.score, tr.passed, tr.taken_at
      FROM test_results tr JOIN users u ON u.id = tr.user_id ORDER BY tr.taken_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r, course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
    }));
    return res.json({ tests: rows });
  } catch (err) {
    console.error("Admin tests error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/admin/tests/:userId/:courseId", adminAuth, async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(userId) || isNaN(courseId)) return res.status(400).json({ error: "Invalid userId or courseId." });
  try {
    await pool.query("DELETE FROM test_results WHERE user_id = $1 AND course_id = $2", [userId, courseId]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Admin reset test error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/admin/certificates-all", adminAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.user_id, u.full_name AS student_name, c.course_id, c.issued_at
      FROM certificates c JOIN users u ON u.id = c.user_id ORDER BY c.issued_at DESC
    `);
    const rows = result.rows.map((r: { course_id: number; [k: string]: unknown }) => ({
      ...r, course_name: COURSE_NAMES[r.course_id] ?? `Course #${r.course_id}`,
    }));
    return res.json({ certificates: rows });
  } catch (err) {
    console.error("Admin certificates error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/admin/certificates/:userId/:courseId", adminAuth, async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(userId) || isNaN(courseId)) return res.status(400).json({ error: "Invalid userId or courseId." });
  try {
    await pool.query("DELETE FROM certificates WHERE user_id = $1 AND course_id = $2", [userId, courseId]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Admin revoke cert error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/admin/certificates", adminAuth, async (req, res) => {
  const { userId, courseId } = req.body as { userId?: number; courseId?: number };
  if (!userId || !courseId) return res.status(400).json({ error: "userId and courseId are required." });
  try {
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'student'", [userId]);
    if (userCheck.rows.length === 0) return res.status(404).json({ error: "Student not found." });
    await pool.query(
      "INSERT INTO certificates (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO UPDATE SET issued_at = NOW()",
      [userId, courseId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Admin issue cert error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
