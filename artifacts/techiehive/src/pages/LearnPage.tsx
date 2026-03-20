import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  youtube_url: string;
  order_index: number;
}

interface StoredUser {
  id: number;
  full_name: string;
  email: string;
}

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  const match2 = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (match2) return `https://www.youtube.com/embed/${match2[1]}`;
  return url;
}

export default function LearnPage() {
  const { courseId: courseIdStr } = useParams<{ courseId: string }>();
  const courseId = parseInt(courseIdStr ?? "0", 10);
  const [, setLocation] = useLocation();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  const fetchProgress = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`/api/progress/${userId}/${courseId}`);
      const data = await res.json();
      setCompletedIds(new Set<number>(data.completedLessonIds ?? []));
    } catch {
      /* ignore */
    }
  }, [courseId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      setLocation("/login");
      return;
    }

    let parsedUser: StoredUser;
    try {
      parsedUser = JSON.parse(stored);
      setUser(parsedUser);
    } catch {
      setLocation("/login");
      return;
    }

    async function init() {
      try {
        const [enrollRes, lessonsRes] = await Promise.all([
          fetch(`/api/enrollments/${parsedUser.id}`),
          fetch(`/api/courses/${courseId}/lessons`),
        ]);

        const enrollData = await enrollRes.json();
        const isEnrolled = (enrollData.enrollments ?? []).some(
          (e: { course_id: number }) => e.course_id === courseId
        );

        if (!isEnrolled) {
          setLocation("/courses");
          return;
        }

        const lessonsData = await lessonsRes.json();
        const fetchedLessons: Lesson[] = lessonsData.lessons ?? [];
        setLessons(fetchedLessons);
        if (fetchedLessons.length > 0) setSelectedLesson(fetchedLessons[0]);

        await fetchProgress(parsedUser.id);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [courseId, setLocation, fetchProgress]);

  async function handleMarkComplete() {
    if (!user || !selectedLesson) return;
    setMarkingComplete(true);
    try {
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, lessonId: selectedLesson.id }),
      });
      setCompletedIds((prev) => new Set([...prev, selectedLesson.id]));
    } finally {
      setMarkingComplete(false);
    }
  }

  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isCurrentComplete = selectedLesson ? completedIds.has(selectedLesson.id) : false;

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #1f1f1f", borderTopColor: "#F5C400", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#888888", fontSize: "0.9rem" }}>Loading course…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", width: "100%", flex: 1 }}>
        <div style={{ marginBottom: "28px" }}>
          <Link href="/dashboard" style={{ color: "#888888", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C400")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888888")}
          >
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
            {COURSE_NAMES[courseId] ?? "Course"}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "180px", background: "#1a1a1a", borderRadius: "100px", height: "8px", overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "#F5C400", borderRadius: "100px", transition: "width 0.4s ease" }} />
            </div>
            <span style={{ color: "#888888", fontSize: "0.82rem", whiteSpace: "nowrap", flexShrink: 0 }}>
              <span style={{ color: "#F5C400", fontWeight: 700 }}>{completedCount}</span> of {lessons.length} completed
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }} className="learn-grid">
          <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
              <p style={{ color: "#888888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontWeight: 600 }}>
                Lessons
              </p>
            </div>
            <div style={{ padding: "8px" }}>
              {lessons.map((lesson) => {
                const done = completedIds.has(lesson.id);
                const active = selectedLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      background: active ? "rgba(245,196,0,0.08)" : "transparent",
                      border: active ? "1px solid rgba(245,196,0,0.2)" : "1px solid transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "4px",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: done ? "#F5C400" : "transparent",
                      border: done ? "none" : "1.5px solid #333333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s, border-color 0.2s",
                    }}>
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: active ? "#F5C400" : done ? "#CCCCCC" : "#FFFFFF", fontSize: "0.84rem", fontWeight: active ? 700 : 500, margin: 0, lineHeight: 1.35 }}>
                        {lesson.order_index}. {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {lessons.length > 0 && completedCount === lessons.length && (
              <div style={{ padding: "12px 8px 8px" }}>
                <Link href={`/test/${courseId}`} style={{ textDecoration: "none", display: "block" }}>
                  <button
                    style={{
                      width: "100%",
                      background: "#F5C400",
                      border: "none",
                      color: "#0A0A0A",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Take Final Test
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {selectedLesson ? (
              <>
                <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      key={selectedLesson.id}
                      src={getYoutubeEmbedUrl(selectedLesson.youtube_url)}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>

                <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <h2 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, margin: "0 0 4px" }}>
                      {selectedLesson.order_index}. {selectedLesson.title}
                    </h2>
                    <p style={{ color: "#555555", fontSize: "0.8rem", margin: 0 }}>
                      Lesson {selectedLesson.order_index} of {lessons.length}
                    </p>
                  </div>

                  {isCurrentComplete ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "8px", padding: "10px 18px" }}>
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ color: "#22c55e", fontSize: "0.875rem", fontWeight: 600 }}>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete}
                      style={{
                        background: "#F5C400",
                        border: "none",
                        color: "#0A0A0A",
                        padding: "10px 22px",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor: markingComplete ? "not-allowed" : "pointer",
                        opacity: markingComplete ? 0.7 : 1,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => { if (!markingComplete) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                      onMouseLeave={(e) => { if (!markingComplete) (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                    >
                      {markingComplete ? "Saving…" : "Mark as Complete"}
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  {lessons[selectedLesson.order_index - 2] && (
                    <button
                      onClick={() => setSelectedLesson(lessons[selectedLesson.order_index - 2])}
                      style={{ background: "transparent", border: "1.5px solid #1f1f1f", color: "#888888", padding: "10px 18px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5C400"; e.currentTarget.style.color = "#F5C400"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#888888"; }}
                    >
                      ← Previous
                    </button>
                  )}
                  {lessons[selectedLesson.order_index] && (
                    <button
                      onClick={() => setSelectedLesson(lessons[selectedLesson.order_index])}
                      style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "10px 22px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", marginLeft: "auto", transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "60px 40px", textAlign: "center" }}>
                <p style={{ color: "#888888" }}>Select a lesson to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .learn-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
