import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from '@/lib/api';

const COURSE_AMOUNT = 15000;

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description: "Build complete web apps from front to back. Learn HTML, CSS, JavaScript, React, Node.js, and databases.",
    bullets: [
      "HTML, CSS & JavaScript fundamentals",
      "React for dynamic frontend UIs",
      "Node.js & Express backend development",
      "Databases: SQL and NoSQL",
    ],
  },
  {
    id: 2,
    title: "Video Editing",
    description: "Learn professional editing techniques for content creation, YouTube, and brand videos.",
    bullets: [
      "Video editing software & workflow",
      "Color grading & visual effects",
      "Audio mixing & sound design",
      "Export settings for YouTube & social",
    ],
  },
  {
    id: 3,
    title: "Graphics Design",
    description: "Create logos, brand identities, social media graphics, and digital visuals using industry tools.",
    bullets: [
      "Logo & brand identity design",
      "Typography & color theory",
      "Social media graphic creation",
      "Adobe & Canva tool mastery",
    ],
  },
];

function CourseDetailCard({ course }: { course: typeof courses[0] }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userRaw || !token) return;
    try {
      const user = JSON.parse(userRaw) as { id: number };
      fetch(`${API_BASE}/api/enrollments/${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          const ids: number[] = (data.enrollments ?? []).map((e: { course_id: number }) => e.course_id);
          if (ids.includes(course.id)) setEnrolled(true);
        })
        .catch(() => {});
    } catch {}
  }, [course.id]);

  async function handleClick() {
    if (enrolled) { setLocation(`/learn/${course.id}`); return; }
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) { setLocation("/login"); return; }
    const user = JSON.parse(userRaw) as { email: string };
    setLoading(true);
    setError("");
    try {
      const callbackUrl = `${window.location.origin}/payment/verify`;
      const res = await fetch(`${API_BASE}/api/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, amount: COURSE_AMOUNT, courseId: course.id, callbackUrl }),
      });
      const data = await res.json();
      if (res.status === 409) { setEnrolled(true); setError(data.error); }
      else if (res.ok) window.location.href = data.authorization_url;
      else setError(data.error ?? "Payment initialization failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#111111",
        border: "1.5px solid #1f1f1f",
        borderRadius: "14px",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#F5C400";
        el.style.boxShadow = "0 12px 40px rgba(245,196,0,0.07)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#1f1f1f";
        el.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          background: "rgba(245,196,0,0.1)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      <div>
        <h3 style={{ color: "#FFFFFF", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 4px" }}>
          {course.title}
        </h3>
        <p style={{ color: "#F5C400", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 10px" }}>
          ₦{COURSE_AMOUNT.toLocaleString()}
        </p>
        <p style={{ color: "#888888", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
          {course.description}
        </p>
      </div>

      <div>
        <p style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
          What You'll Learn
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "9px" }}>
          {course.bullets.map((point) => (
            <li key={point} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#F5C400", fontSize: "0.85rem", marginTop: "2px", flexShrink: 0 }}>✓</span>
              <span style={{ color: "#CCCCCC", fontSize: "0.875rem", lineHeight: 1.5 }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "0.8rem", margin: 0 }}>{error}</p>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          marginTop: "auto",
          background: "#F5C400",
          border: "none",
          color: "#0A0A0A",
          padding: "11px 22px",
          borderRadius: "7px",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          alignSelf: "flex-start",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
        onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
      >
        {loading ? "Processing…" : enrolled ? "Continue Learning →" : "Enroll Now — ₦15,000"}
      </button>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <Navbar />

      <section
        style={{
          background: "#0A0A0A",
          backgroundImage: "radial-gradient(circle, #1f1f1f 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          padding: "80px 24px 72px",
          textAlign: "center",
          borderBottom: "1px solid #1a1a1a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(245,196,0,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Our <span style={{ color: "#F5C400" }}>Courses</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
            Choose a skill. Follow the curriculum. Get certified.
          </p>
        </div>
      </section>

      <section style={{ padding: "72px 24px 96px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="courses-detail-grid">
          {courses.map((course) => (
            <CourseDetailCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
