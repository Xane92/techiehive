import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from '@/lib/api';

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

interface Enrollment {
  id: number;
  course_id: number;
  paid_at: string;
  amount: number;
}

interface StoredUser {
  id: number;
  full_name: string;
  email: string;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      setLocation("/login");
      return;
    }
    try {
      const parsedUser: StoredUser = JSON.parse(stored);
      setUser(parsedUser);

      fetch(`${API_BASE}/api/enrollments/${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setEnrollments(data.enrollments ?? []);
        })
        .catch(() => {
          setEnrollments([]);
        })
        .finally(() => {
          setEnrollmentsLoading(false);
        });
    } catch {
      setLocation("/login");
    }
  }, [setLocation]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  }

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", color: "var(--th-text)" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 24px 96px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
          <div>
            <p style={{ color: "var(--th-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Welcome back
            </p>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
              {user.full_name} 👋
            </h1>
            <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", marginTop: "6px" }}>{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "1.5px solid #333333", color: "var(--th-muted)", padding: "8px 18px", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b6b"; e.currentTarget.style.color = "#ff6b6b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333333"; e.currentTarget.style.color = "var(--th-muted)"; }}
          >
            Log Out
          </button>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "var(--th-text)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "24px" }}>
            My Courses
          </h2>

          {enrollmentsLoading ? (
            <div style={{ display: "flex", gap: "16px" }}>
              {[1, 2].map((n) => (
                <div key={n} style={{ flex: 1, background: "var(--th-surface)", borderRadius: "12px", height: "120px", border: "1.5px solid var(--th-border)", opacity: 0.5 }} />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ background: "var(--th-surface)", border: "1.5px solid var(--th-border)", borderRadius: "12px", padding: "40px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>📚</div>
              <p style={{ color: "var(--th-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
                You have no enrolled courses yet. Browse our courses to get started.
              </p>
              <Link href="/courses">
                <button
                  style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "12px 24px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                >
                  Browse Courses
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  style={{
                    background: "var(--th-surface)",
                    border: "1.5px solid rgba(245,196,0,0.25)",
                    borderRadius: "12px",
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", background: "rgba(245,196,0,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>

                  <div>
                    <h3 style={{ color: "var(--th-text)", fontSize: "1rem", fontWeight: 700, margin: "0 0 6px" }}>
                      {COURSE_NAMES[enrollment.course_id] ?? `Course #${enrollment.course_id}`}
                    </h3>
                    <p style={{ color: "var(--th-muted)", fontSize: "0.78rem", margin: 0 }}>
                      Enrolled {new Date(enrollment.paid_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", flexShrink: 0 }} />
                    <span style={{ color: "#22c55e", fontSize: "0.78rem", fontWeight: 600 }}>Enrolled</span>
                  </div>

                  <Link href={`/learn/${enrollment.course_id}`} style={{ textDecoration: "none", marginTop: "auto" }}>
                    <button
                      style={{ width: "100%", background: "#F5C400", border: "none", color: "#0A0A0A", padding: "10px 18px", borderRadius: "7px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                    >
                      Start Learning
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
