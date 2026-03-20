import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

interface Question {
  id: number;
  course_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface StoredUser {
  id: number;
  full_name: string;
  email: string;
}

type TestState = "loading" | "idle" | "submitting" | "passed" | "failed";

export default function TestPage() {
  const { courseId: courseIdStr } = useParams<{ courseId: string }>();
  const courseId = parseInt(courseIdStr ?? "0", 10);
  const [, setLocation] = useLocation();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testState, setTestState] = useState<TestState>("loading");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) { setLocation("/login"); return; }

    let parsedUser: StoredUser;
    try { parsedUser = JSON.parse(stored); setUser(parsedUser); }
    catch { setLocation("/login"); return; }

    async function init() {
      const [enrollRes, qRes] = await Promise.all([
        fetch(`/api/enrollments/${parsedUser.id}`),
        fetch(`/api/questions/${courseId}`),
      ]);
      const enrollData = await enrollRes.json();
      const isEnrolled = (enrollData.enrollments ?? []).some(
        (e: { course_id: number }) => e.course_id === courseId
      );
      if (!isEnrolled) { setLocation("/courses"); return; }

      const qData = await qRes.json();
      setQuestions(qData.questions ?? []);
      setTotal((qData.questions ?? []).length);
      setTestState("idle");
    }

    init();
  }, [courseId, setLocation]);

  async function handleSubmit() {
    if (!user) return;
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setTestState("submitting");
    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, courseId, answers }),
      });
      const data = await res.json();
      setScore(data.score);
      setTotal(data.total ?? 5);
      setTestState(data.passed ? "passed" : "failed");
    } catch {
      setTestState("idle");
    }
  }

  function handleRetake() {
    setAnswers({});
    setTestState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const OPTIONS: { key: string; label: string }[] = [
    { key: "option_a", label: "A" },
    { key: "option_b", label: "B" },
    { key: "option_c", label: "C" },
    { key: "option_d", label: "D" },
  ];

  if (testState === "loading") {
    return (
      <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #1f1f1f", borderTopColor: "#F5C400", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#888888", fontSize: "0.9rem" }}>Loading test…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (testState === "passed") {
    return (
      <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "2rem" }}>
              🎉
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" }}>
              Congratulations!
            </h1>
            <p style={{ color: "#22c55e", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
              You scored {score}/{total}
            </p>
            <p style={{ color: "#888888", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "36px" }}>
              You passed! Your certificate is ready. Well done on completing{" "}
              <span style={{ color: "#F5C400", fontWeight: 600 }}>{COURSE_NAMES[courseId]}</span>.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/certificate/${courseId}`}>
                <button
                  style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "13px 28px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                >
                  View Certificate →
                </button>
              </Link>
              <Link href="/dashboard">
                <button
                  style={{ background: "transparent", border: "1.5px solid #333333", color: "#888888", padding: "13px 24px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (testState === "failed") {
    return (
      <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "2rem" }}>
              😔
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" }}>
              Not quite there yet
            </h1>
            <p style={{ color: "#ef4444", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
              You scored {score}/{total}
            </p>
            <p style={{ color: "#888888", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "36px" }}>
              You didn't pass this time. You need at least 3 correct answers. Please review the lessons and try again.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleRetake}
                style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "13px 28px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Retake Test
              </button>
              <Link href={`/learn/${courseId}`}>
                <button
                  style={{ background: "transparent", border: "1.5px solid #333333", color: "#888888", padding: "13px 24px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Review Lessons
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px 96px", width: "100%" }}>
        <Link href={`/learn/${courseId}`}
          style={{ color: "#888888", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "28px" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C400")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888888")}
        >
          ← Back to Course
        </Link>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#F5C400", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Final Test
          </p>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            {COURSE_NAMES[courseId]}
          </h1>
          <p style={{ color: "#888888", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
            Answer all {total} questions. You need <span style={{ color: "#F5C400", fontWeight: 700 }}>3 or more correct</span> to pass and earn your certificate.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              style={{ background: "#111111", border: `1.5px solid ${answers[q.id] ? "rgba(245,196,0,0.2)" : "#1f1f1f"}`, borderRadius: "12px", padding: "24px", transition: "border-color 0.2s" }}
            >
              <p style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, marginBottom: "20px", lineHeight: 1.5 }}>
                <span style={{ color: "#F5C400" }}>Q{idx + 1}.</span> {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {OPTIONS.map(({ key, label }) => {
                  const value = q[key as keyof Question] as string;
                  const isSelected = answers[q.id] === label;
                  return (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: isSelected ? "rgba(245,196,0,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isSelected ? "rgba(245,196,0,0.35)" : "#1f1f1f"}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={label}
                        checked={isSelected}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: label }))}
                        style={{ accentColor: "#F5C400", width: "16px", height: "16px", flexShrink: 0 }}
                      />
                      <span style={{ color: "#F5C400", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>{label}.</span>
                      <span style={{ color: isSelected ? "#FFFFFF" : "#CCCCCC", fontSize: "0.88rem", lineHeight: 1.4 }}>{value}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ color: "#555555", fontSize: "0.82rem", margin: 0 }}>
            {Object.keys(answers).length} of {total} answered
          </p>
          <button
            onClick={handleSubmit}
            disabled={testState === "submitting"}
            style={{
              background: "#F5C400",
              border: "none",
              color: "#0A0A0A",
              padding: "13px 32px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: testState === "submitting" ? "not-allowed" : "pointer",
              opacity: testState === "submitting" ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { if (testState !== "submitting") (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { if (testState !== "submitting") (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            {testState === "submitting" ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
