import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { API_BASE } from '@/lib/api';

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

type Section = "overview" | "users" | "enrollments" | "lessons" | "completions" | "tests";

interface Stats { students: number; enrollments: number; certificates: number; }
interface AdminUser { id: number; full_name: string; email: string; enrollment_count: number; created_at: string; }
interface Enrollment { id: number; student_name: string; course_id: number; course_name: string; amount: number; paid_at: string; }
interface Lesson { id: number; course_id: number; title: string; youtube_url: string; order_index: number; }
interface CourseSummary { course_id: number; course_name: string; total_enrolled: number; completed_all_lessons: number; passed_test: number; certificates_issued: number; }
interface StudentProgress { user_id: number; full_name: string; email: string; course_id: number; course_name: string; lessons_completed: number; total_lessons: number; test_status: string; test_score: number | null; certificate_issued: boolean; }
interface TestResult { id: number; user_id: number; student_name: string; course_id: number; course_name: string; score: number; passed: boolean; taken_at: string; }
interface Certificate { id: number; user_id: number; student_name: string; course_id: number; course_name: string; issued_at: string; }

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "28px 24px" }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "12px" }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F5C400", lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#555555", fontSize: "0.82rem", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#555555", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1f1f1f", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ padding: "32px 16px", textAlign: "center", color: "#444444" }}>No data yet</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #141414" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "12px 16px", color: "#CCCCCC" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "green" | "red" | "yellow" | "grey" }) {
  const colors = {
    green: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", text: "#22c55e" },
    red: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#ef4444" },
    yellow: { bg: "rgba(245,196,0,0.1)", border: "rgba(245,196,0,0.25)", text: "#F5C400" },
    grey: { bg: "rgba(136,136,136,0.1)", border: "rgba(136,136,136,0.2)", text: "#888888" },
  }[color];
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "100px", background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ActionBtn({ label, onClick, variant = "default" }: { label: string; onClick: () => void; variant?: "danger" | "default" | "success" }) {
  const styles = {
    danger: { border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" },
    success: { border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" },
    default: { border: "1px solid #2a2a2a", color: "#888888" },
  }[variant];
  return (
    <button onClick={onClick} style={{ ...styles, background: "transparent", padding: "5px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const [stats, setStats] = useState<Stats>({ students: 0, enrollments: 0, certificates: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseSummaries, setCourseSummaries] = useState<CourseSummary[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [allCerts, setAllCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({ course_id: 1, title: "", youtube_url: "", order_index: 1 });
  const [addingFor, setAddingFor] = useState<number | null>(null);
  const [lessonMsg, setLessonMsg] = useState("");
  const [testsMsg, setTestsMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issueCertForm, setIssueCertForm] = useState<{ userId: number; courseId: number } | null>(null);

  const fetchLessons = useCallback(async (tok: string) => {
    const results = await Promise.all([1, 2, 3].map((cid) =>
      fetch(`${API_BASE}/api/courses/${cid}/lessons`, { headers: authHeaders(tok) }).then((r) => r.json())
    ));
    setLessons(results.flatMap((r) => r.lessons ?? []));
  }, []);

  const fetchTestsAndCerts = useCallback(async (tok: string) => {
    const [testRes, certRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/tests`, { headers: authHeaders(tok) }).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/certificates-all`, { headers: authHeaders(tok) }).then((r) => r.json()),
    ]);
    setTests(testRes.tests ?? []);
    setAllCerts(certRes.certificates ?? []);
  }, []);

  const fetchCompletionsDetail = useCallback(async (tok: string) => {
    const res = await fetch(`${API_BASE}/api/admin/completions-detail`, { headers: authHeaders(tok) }).then((r) => r.json());
    setCourseSummaries(res.courseSummaries ?? []);
    setStudentProgress(res.studentProgress ?? []);
  }, []);

  useEffect(() => {
    const tok = localStorage.getItem("adminToken");
    const stored = localStorage.getItem("adminUser");
    if (!tok || !stored) { setLocation("/admin/login"); return; }
    try {
      const u = JSON.parse(stored);
      if (u.role !== "admin") { setLocation("/admin/login"); return; }
      setToken(tok);
      setAdminName(u.full_name);
    } catch { setLocation("/admin/login"); return; }

    async function init(tok: string) {
      setLoading(true);
      try {
        const [statsRes, usersRes, enrollRes, lessonResults, compDetailRes, testRes, certAllRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats`, { headers: authHeaders(tok) }).then((r) => r.json()),
          fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders(tok) }).then((r) => r.json()),
          fetch(`${API_BASE}/api/admin/enrollments`, { headers: authHeaders(tok) }).then((r) => r.json()),
          Promise.all([1, 2, 3].map((cid) => fetch(`${API_BASE}/api/courses/${cid}/lessons`).then((r) => r.json()))),
          fetch(`${API_BASE}/api/admin/completions-detail`, { headers: authHeaders(tok) }).then((r) => r.json()),
          fetch(`${API_BASE}/api/admin/tests`, { headers: authHeaders(tok) }).then((r) => r.json()),
          fetch(`${API_BASE}/api/admin/certificates-all`, { headers: authHeaders(tok) }).then((r) => r.json()),
        ]);
        setStats(statsRes);
        setUsers(usersRes.users ?? []);
        setEnrollments(enrollRes.enrollments ?? []);
        setLessons(lessonResults.flatMap((r: { lessons?: Lesson[] }) => r.lessons ?? []));
        setCourseSummaries(compDetailRes.courseSummaries ?? []);
        setStudentProgress(compDetailRes.studentProgress ?? []);
        setTests(testRes.tests ?? []);
        setAllCerts(certAllRes.certificates ?? []);
      } finally {
        setLoading(false);
      }
    }
    init(tok);
  }, [setLocation]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setLocation("/admin/login");
  }

  async function handleDeleteLesson(id: number) {
    if (!confirm("Delete this lesson?")) return;
    await fetch(`${API_BASE}/api/admin/lessons/${id}`, { method: "DELETE", headers: authHeaders(token) });
    setLessonMsg("Lesson deleted.");
    await fetchLessons(token);
    setTimeout(() => setLessonMsg(""), 2500);
  }

  async function handleUpdateLesson() {
    if (!editingLesson) return;
    await fetch(`${API_BASE}/api/admin/lessons/${editingLesson.id}`, {
      method: "PUT", headers: authHeaders(token),
      body: JSON.stringify({ title: editingLesson.title, youtube_url: editingLesson.youtube_url, order_index: editingLesson.order_index }),
    });
    setEditingLesson(null);
    setLessonMsg("Lesson updated.");
    await fetchLessons(token);
    setTimeout(() => setLessonMsg(""), 2500);
  }

  async function handleAddLesson(courseId: number) {
    if (!newLesson.title || !newLesson.youtube_url) { setLessonMsg("Title and YouTube URL are required."); return; }
    await fetch(`${API_BASE}/api/admin/lessons`, {
      method: "POST", headers: authHeaders(token),
      body: JSON.stringify({ ...newLesson, course_id: courseId }),
    });
    setNewLesson({ course_id: courseId, title: "", youtube_url: "", order_index: 1 });
    setAddingFor(null);
    setLessonMsg("Lesson added.");
    await fetchLessons(token);
    setTimeout(() => setLessonMsg(""), 2500);
  }

  async function handleResetTest(userId: number, courseId: number, studentName: string) {
    if (!confirm(`Reset all test attempts for ${studentName} in ${COURSE_NAMES[courseId]}?`)) return;
    await fetch(`${API_BASE}/api/admin/tests/${userId}/${courseId}`, { method: "DELETE", headers: authHeaders(token) });
    setTestsMsg(`Test reset for ${studentName}.`);
    await fetchTestsAndCerts(token);
    await fetchCompletionsDetail(token);
    setTimeout(() => setTestsMsg(""), 3000);
  }

  async function handleRevokeCert(userId: number, courseId: number, studentName: string) {
    if (!confirm(`Revoke certificate for ${studentName} in ${COURSE_NAMES[courseId]}?`)) return;
    await fetch(`${API_BASE}/api/admin/certificates/${userId}/${courseId}`, { method: "DELETE", headers: authHeaders(token) });
    setTestsMsg(`Certificate revoked for ${studentName}.`);
    const [statsRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/stats`, { headers: authHeaders(token) }).then((r) => r.json()),
    ]);
    setStats(statsRes);
    await fetchTestsAndCerts(token);
    await fetchCompletionsDetail(token);
    setTimeout(() => setTestsMsg(""), 3000);
  }

  async function handleIssueCert() {
    if (!issueCertForm) return;
    await fetch(`${API_BASE}/api/admin/certificates`, {
      method: "POST", headers: authHeaders(token),
      body: JSON.stringify({ userId: issueCertForm.userId, courseId: issueCertForm.courseId }),
    });
    setIssueCertForm(null);
    setTestsMsg("Certificate issued successfully.");
    const [statsRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/stats`, { headers: authHeaders(token) }).then((r) => r.json()),
    ]);
    setStats(statsRes);
    await fetchTestsAndCerts(token);
    await fetchCompletionsDetail(token);
    setTimeout(() => setTestsMsg(""), 3000);
  }

  const inputStyle: React.CSSProperties = {
    background: "#0A0A0A", border: "1.5px solid #1f1f1f", color: "#FFFFFF",
    padding: "9px 12px", borderRadius: "7px", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box",
  };

  const sidebarItems: { key: Section; label: string; icon: string }[] = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "enrollments", label: "Enrollments", icon: "📋" },
    { key: "lessons", label: "Manage Lessons", icon: "🎬" },
    { key: "completions", label: "Completions", icon: "🏆" },
    { key: "tests", label: "Tests & Certificates", icon: "📝" },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ color: "#F5C400", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em" }}>Techiehive</div>
        <div style={{ color: "#444444", fontSize: "0.72rem", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Admin Panel</div>
      </div>
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {sidebarItems.map(({ key, label, icon }) => (
          <button key={key} onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", cursor: "pointer", textAlign: "left", marginBottom: "2px",
              background: activeSection === key ? "rgba(245,196,0,0.1)" : "transparent",
              border: activeSection === key ? "1px solid rgba(245,196,0,0.2)" : "1px solid transparent",
              color: activeSection === key ? "#F5C400" : "#888888",
              fontSize: "0.875rem", fontWeight: activeSection === key ? 700 : 500, transition: "all 0.15s",
            }}
          >
            <span>{icon}</span><span>{label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ padding: "10px 12px", marginBottom: "8px" }}>
          <div style={{ color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 600 }}>{adminName}</div>
          <div style={{ color: "#444444", fontSize: "0.74rem" }}>Administrator</div>
        </div>
        <button onClick={handleLogout}
          style={{ width: "100%", background: "transparent", border: "1px solid #1f1f1f", color: "#666666", padding: "9px 12px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.borderColor = "#1f1f1f"; }}
        >
          Log Out
        </button>
      </div>
    </>
  );

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #1f1f1f", borderTopColor: "#F5C400", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0A", color: "#FFFFFF" }}>
      <aside style={{ width: "220px", background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", flexShrink: 0 }} className="admin-sidebar-desktop">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ width: "220px", background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", zIndex: 201 }}>
            <SidebarContent />
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "32px 28px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <button onClick={() => setSidebarOpen(true)} className="admin-menu-btn"
              style={{ background: "transparent", border: "1.5px solid #1f1f1f", color: "#888888", padding: "7px 10px", borderRadius: "7px", cursor: "pointer", display: "none" }}>
              ☰
            </button>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
                {sidebarItems.find((s) => s.key === activeSection)?.icon}{" "}
                {sidebarItems.find((s) => s.key === activeSection)?.label}
              </h1>
              <p style={{ color: "#444444", fontSize: "0.8rem", margin: "3px 0 0" }}>Techiehive Admin Dashboard</p>
            </div>
          </div>

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                <StatCard label="Total Students" value={stats.students} icon="👥" />
                <StatCard label="Total Enrollments" value={stats.enrollments} icon="📋" />
                <StatCard label="Certificates Issued" value={stats.certificates} icon="🏆" />
              </div>
              <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", color: "#888888" }}>Recent Enrollments</h2>
                <Table headers={["Student", "Course", "Amount", "Date"]}
                  rows={enrollments.slice(0, 5).map((e) => [
                    e.student_name, e.course_name, `₦${e.amount.toLocaleString()}`,
                    new Date(e.paid_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
                  ])}
                />
              </div>
            </div>
          )}

          {/* USERS */}
          {activeSection === "users" && (
            <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>All Students ({users.length})</h2>
              <Table headers={["Name", "Email", "Courses Enrolled", "Joined"]}
                rows={users.map((u) => [
                  u.full_name, u.email, u.enrollment_count,
                  new Date(u.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
                ])}
              />
            </div>
          )}

          {/* ENROLLMENTS */}
          {activeSection === "enrollments" && (
            <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>All Enrollments ({enrollments.length})</h2>
              <Table headers={["Student", "Course", "Amount Paid", "Date"]}
                rows={enrollments.map((e) => [
                  e.student_name, e.course_name, `₦${e.amount.toLocaleString()}`,
                  new Date(e.paid_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
                ])}
              />
            </div>
          )}

          {/* LESSONS */}
          {activeSection === "lessons" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {lessonMsg && (
                <div style={{ background: "rgba(245,196,0,0.08)", border: "1px solid rgba(245,196,0,0.25)", borderRadius: "8px", padding: "12px 16px", color: "#F5C400", fontSize: "0.875rem" }}>
                  {lessonMsg}
                </div>
              )}
              {[1, 2, 3].map((cid) => {
                const courseLessons = lessons.filter((l) => l.course_id === cid).sort((a, b) => a.order_index - b.order_index);
                return (
                  <div key={cid} style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                      <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{COURSE_NAMES[cid]}</h2>
                      <button onClick={() => { setAddingFor(addingFor === cid ? null : cid); setNewLesson({ course_id: cid, title: "", youtube_url: "", order_index: courseLessons.length + 1 }); }}
                        style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "8px 16px", borderRadius: "7px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                        + Add Lesson
                      </button>
                    </div>
                    {addingFor === cid && (
                      <div style={{ background: "#0d0d0d", border: "1px solid rgba(245,196,0,0.2)", borderRadius: "9px", padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p style={{ color: "#F5C400", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>New Lesson</p>
                        <input style={inputStyle} placeholder="Title" value={newLesson.title} onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))} />
                        <input style={inputStyle} placeholder="YouTube URL" value={newLesson.youtube_url} onChange={(e) => setNewLesson((p) => ({ ...p, youtube_url: e.target.value }))} />
                        <input style={{ ...inputStyle, width: "100px" }} type="number" placeholder="Order" value={newLesson.order_index} onChange={(e) => setNewLesson((p) => ({ ...p, order_index: parseInt(e.target.value) || 1 }))} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleAddLesson(cid)} style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "9px 18px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>Save</button>
                          <button onClick={() => setAddingFor(null)} style={{ background: "transparent", border: "1px solid #333333", color: "#666666", padding: "9px 14px", borderRadius: "7px", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {courseLessons.length === 0 && <p style={{ color: "#444444", fontSize: "0.85rem", margin: 0 }}>No lessons yet.</p>}
                      {courseLessons.map((l) => (
                        <div key={l.id}>
                          {editingLesson?.id === l.id ? (
                            <div style={{ background: "#0d0d0d", border: "1px solid rgba(245,196,0,0.2)", borderRadius: "9px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                              <input style={inputStyle} value={editingLesson.title} onChange={(e) => setEditingLesson((p) => p ? { ...p, title: e.target.value } : p)} />
                              <input style={inputStyle} value={editingLesson.youtube_url} onChange={(e) => setEditingLesson((p) => p ? { ...p, youtube_url: e.target.value } : p)} />
                              <input style={{ ...inputStyle, width: "100px" }} type="number" value={editingLesson.order_index} onChange={(e) => setEditingLesson((p) => p ? { ...p, order_index: parseInt(e.target.value) || 1 } : p)} />
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={handleUpdateLesson} style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "8px 16px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>Update</button>
                                <button onClick={() => setEditingLesson(null)} style={{ background: "transparent", border: "1px solid #333333", color: "#666666", padding: "8px 14px", borderRadius: "7px", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: "#0d0d0d", borderRadius: "9px", border: "1px solid #141414" }}>
                              <span style={{ color: "#F5C400", fontSize: "0.75rem", fontWeight: 700, width: "20px", flexShrink: 0 }}>{l.order_index}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: "#FFFFFF", fontSize: "0.875rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</p>
                                <p style={{ color: "#444444", fontSize: "0.74rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.youtube_url}</p>
                              </div>
                              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                <button onClick={() => setEditingLesson(l)} style={{ background: "transparent", border: "1px solid #333333", color: "#888888", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer" }}>Edit</button>
                                <button onClick={() => handleDeleteLesson(l.id)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer" }}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* COMPLETIONS */}
          {activeSection === "completions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {courseSummaries.map((cs) => (
                  <div key={cs.course_id} style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "20px 22px" }}>
                    <h3 style={{ color: "#F5C400", fontSize: "0.85rem", fontWeight: 700, marginBottom: "16px", lineHeight: 1.3 }}>{cs.course_name}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { label: "Enrolled", value: cs.total_enrolled, color: "#FFFFFF" },
                        { label: "Lessons Done", value: cs.completed_all_lessons, color: "#F5C400" },
                        { label: "Test Passed", value: cs.passed_test, color: "#22c55e" },
                        { label: "Certificates", value: cs.certificates_issued, color: "#a78bfa" },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: "#0d0d0d", borderRadius: "8px", padding: "12px" }}>
                          <div style={{ fontSize: "1.4rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                          <div style={{ color: "#555555", fontSize: "0.72rem", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>Student Progress Detail</h2>
                <Table
                  headers={["Student", "Course", "Lessons", "Test Status", "Certificate"]}
                  rows={studentProgress.map((sp) => [
                    sp.full_name,
                    sp.course_name,
                    `${sp.lessons_completed}/${sp.total_lessons}`,
                    <Badge
                      label={sp.test_status === "Passed" ? `Passed (${sp.test_score}/5)` : sp.test_status === "Failed" ? `Failed (${sp.test_score}/5)` : "Not Taken"}
                      color={sp.test_status === "Passed" ? "green" : sp.test_status === "Failed" ? "red" : "grey"}
                    />,
                    sp.certificate_issued
                      ? <Badge label="Issued" color="yellow" />
                      : <Badge label="No" color="grey" />,
                  ])}
                />
              </div>
            </div>
          )}

          {/* TESTS & CERTIFICATES */}
          {activeSection === "tests" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {testsMsg && (
                <div style={{ background: "rgba(245,196,0,0.08)", border: "1px solid rgba(245,196,0,0.25)", borderRadius: "8px", padding: "12px 16px", color: "#F5C400", fontSize: "0.875rem" }}>
                  {testsMsg}
                </div>
              )}

              <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>All Test Attempts ({tests.length})</h2>
                <Table
                  headers={["Student", "Course", "Score", "Result", "Date", "Action"]}
                  rows={tests.map((t) => [
                    t.student_name,
                    t.course_name,
                    `${t.score}/5`,
                    <Badge label={t.passed ? "Passed" : "Failed"} color={t.passed ? "green" : "red"} />,
                    new Date(t.taken_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
                    <ActionBtn label="Reset" variant="danger" onClick={() => handleResetTest(t.user_id, t.course_id, t.student_name)} />,
                  ])}
                />
              </div>

              <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Issued Certificates ({allCerts.length})</h2>
                  <button
                    onClick={() => setIssueCertForm(issueCertForm ? null : { userId: users[0]?.id ?? 0, courseId: 1 })}
                    style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "8px 16px", borderRadius: "7px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    + Issue Certificate
                  </button>
                </div>

                {issueCertForm && (
                  <div style={{ background: "#0d0d0d", border: "1px solid rgba(245,196,0,0.2)", borderRadius: "9px", padding: "16px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ color: "#F5C400", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Manual Certificate Issuance</p>
                    <div>
                      <label style={{ color: "#666666", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>Student</label>
                      <select
                        value={issueCertForm.userId}
                        onChange={(e) => setIssueCertForm((p) => p ? { ...p, userId: parseInt(e.target.value) } : p)}
                        style={{ ...inputStyle }}
                      >
                        {users.map((u) => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: "#666666", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>Course</label>
                      <select
                        value={issueCertForm.courseId}
                        onChange={(e) => setIssueCertForm((p) => p ? { ...p, courseId: parseInt(e.target.value) } : p)}
                        style={{ ...inputStyle }}
                      >
                        {[1, 2, 3].map((cid) => <option key={cid} value={cid}>{COURSE_NAMES[cid]}</option>)}
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={handleIssueCert} style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "9px 18px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>Issue Certificate</button>
                      <button onClick={() => setIssueCertForm(null)} style={{ background: "transparent", border: "1px solid #333333", color: "#666666", padding: "9px 14px", borderRadius: "7px", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                <Table
                  headers={["Student", "Course", "Issued On", "Actions"]}
                  rows={allCerts.map((c) => [
                    c.student_name,
                    c.course_name,
                    new Date(c.issued_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
                    <ActionBtn label="Revoke" variant="danger" onClick={() => handleRevokeCert(c.user_id, c.course_id, c.student_name)} />,
                  ])}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: flex !important; }
        }
        select option { background: #111111; color: #FFFFFF; }
      `}</style>
    </div>
  );
}
