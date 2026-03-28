import { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import NavbarShared from "@/components/Navbar";
import FooterShared from "@/components/Footer";
import CoursesPage from "@/pages/CoursesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PaymentVerifyPage from "@/pages/PaymentVerifyPage";
import LearnPage from "@/pages/LearnPage";
import TestPage from "@/pages/TestPage";
import CertificatePage from "@/pages/CertificatePage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import CommunityPage from "@/pages/CommunityPage";
import { ThemeProvider } from "@/context/ThemeContext";
import { API_BASE } from '@/lib/api';

const queryClient = new QueryClient();
const COURSE_AMOUNT = 15000;

const courses = [
  { id: 1, title: "Full Stack Web Development", description: "Build complete web applications from front to back using modern frameworks and tools." },
  { id: 2, title: "Video Editing", description: "Learn professional video editing techniques for content creation and production." },
  { id: 3, title: "Graphics Design", description: "Create compelling visuals, logos, and brand identities using industry tools." },
];

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: "Structured Learning",
    description: "Follow a clear curriculum designed to take you from beginner to job-ready, step by step.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: "Video-Based Lessons",
    description: "Learn at your own pace with high-quality video lessons you can revisit anytime.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Progress Tracking",
    description: "Monitor your learning journey with built-in progress tracking and milestones.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: "Certified on Completion",
    description: "Earn a recognized certificate upon completing each course to boost your portfolio.",
  },
];

const coreValues = [
  { title: "Trustworthy", description: "Whatever you see, you get. We do not believe in being deceitful to members of our community or academy alike." },
  { title: "Earnest", description: "We are very intentional and sincere about the growth of members of our community and academy alike." },
  { title: "Capable", description: "We make sure to deliver our very best, and are never caught wanting." },
  { title: "Hardworking", description: "We believe solely in hard work. We encourage our students and members of the community alike to put in the work to see results." },
  { title: "Innovative", description: "We are constantly evolving, setting the pace and trying out new trends and skill sets." },
  { title: "Efficient", description: "We do not just execute, we make sure you see results for yourselves." },
];

function WordReveal({ text, delay = 0, color }: { text: string; delay?: number; color?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            animation: "th-word-in 0.52s cubic-bezier(.22,.68,0,1.2) forwards",
            animationDelay: `${(delay + i * 0.1).toFixed(2)}s`,
            color: color ?? "inherit",
            marginRight: i < words.length - 1 ? "0.28em" : 0,
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

function useScrollFade(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("th-in");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = ((e.clientX - rect.left - cx) / cx) * 10;
      const dy = ((e.clientY - rect.top - cy) / cy) * 10;
      setDotPos({ x: dx, y: dy });
    }
    el.addEventListener("mousemove", onMouseMove);
    return () => el.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="th-hero-pad"
      style={{
        background: "var(--th-bg)",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Parallax dot layer */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          backgroundImage: "radial-gradient(circle, var(--th-dot) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundPosition: `${dotPos.x}px ${dotPos.y}px`,
          transition: "background-position 0.12s ease-out",
          pointerEvents: "none",
        }}
      />
      {/* Animated mesh orbs */}
      <div style={{ position: "absolute", width: "700px", height: "700px", top: "5%", left: "15%", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,196,0,0.07) 0%, transparent 65%)", animation: "th-orb-1 14s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "550px", height: "550px", top: "25%", right: "10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(160,100,0,0.09) 0%, transparent 65%)", animation: "th-orb-2 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "420px", height: "420px", bottom: "8%", left: "28%", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,196,0,0.05) 0%, transparent 65%)", animation: "th-orb-3 22s ease-in-out infinite", pointerEvents: "none" }} />
      {/* Static yellow radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,196,0,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "780px", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div
          className="th-anim th-anim-d0"
          style={{
            display: "inline-block",
            background: "rgba(245,196,0,0.1)",
            border: "1px solid rgba(245,196,0,0.3)",
            color: "#F5C400",
            fontSize: "0.8rem",
            fontWeight: 600,
            padding: "6px 16px",
            borderRadius: "999px",
            marginBottom: "28px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Africa's Premium EdTech Platform
        </div>

        {/* Headline — word-by-word reveal */}
        <h1
          style={{
            color: "var(--th-text)",
            fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
          }}
        >
          <WordReveal text="Learn In-Demand Tech Skills." delay={0.2} />
          {" "}
          <WordReveal text="Get Certified." delay={0.72} color="#F5C400" />
        </h1>

        {/* Subtext */}
        <p
          className="th-anim th-anim-d2"
          style={{
            color: "var(--th-muted)",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            lineHeight: 1.7,
            maxWidth: "620px",
            margin: "0 auto 40px",
          }}
        >
          Techiehive offers structured video courses in web development, design, and digital skills — built for beginners who want real results.
        </p>

        {/* Buttons */}
        <div className="th-anim th-anim-d3" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/courses" style={{ textDecoration: "none" }}>
            <button
              className="th-btn-pulse"
              style={{
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: "13px 28px",
                borderRadius: "8px",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                lineHeight: 1,
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.opacity = "0.85"; b.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.opacity = "1"; b.style.transform = "translateY(0)"; }}
            >
              View Courses
            </button>
          </Link>
          <button
            style={{
              background: "transparent",
              border: "1.5px solid var(--th-text)",
              color: "var(--th-text)",
              padding: "13px 28px",
              borderRadius: "8px",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              lineHeight: 1,
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.07)"; b.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.transform = "translateY(0)"; }}
            onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  const ref = useScrollFade() as React.RefObject<HTMLElement>;
  return (
    <section
      id="courses-section"
      ref={ref as React.RefObject<HTMLElement>}
      className="th-scroll th-section-pad"
      style={{ background: "var(--th-bg)", padding: "96px 24px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            What You Can <span style={{ color: "#F5C400" }}>Learn</span>
          </h2>
          <p style={{ color: "var(--th-muted)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            Choose from our growing library of practical, career-ready courses.
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course, i) => (
            <CourseCard key={course.title} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, index = 0 }: { course: { id: number; title: string; description: string }; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = index * 130;
          setTimeout(() => el.classList.add("th-in"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

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
      ref={cardRef}
      className="th-card-bounce"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--th-surface)",
        border: hovered ? "1.5px solid #F5C400" : "1.5px solid var(--th-border)",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.25s, transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s",
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 60px rgba(245,196,0,0.18), 0 0 0 1px rgba(245,196,0,0.08), 0 8px 24px rgba(0,0,0,0.2)"
          : "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          background: hovered ? "rgba(245,196,0,0.18)" : "rgba(245,196,0,0.1)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4px",
          transition: "background 0.25s",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <h3 style={{ color: "var(--th-text)", fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
        {course.title}
      </h3>
      <p style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>
        ₦{COURSE_AMOUNT.toLocaleString()}
      </p>
      <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
        {course.description}
      </p>
      {error && <p style={{ color: "#ff6b6b", fontSize: "0.78rem", margin: 0 }}>{error}</p>}
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          marginTop: "8px",
          background: enrolled ? "#F5C400" : hovered ? "#F5C400" : "transparent",
          border: "1.5px solid #F5C400",
          color: enrolled ? "#0A0A0A" : hovered ? "#0A0A0A" : "#F5C400",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "background 0.2s, color 0.2s, transform 0.2s",
          alignSelf: "flex-start",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
        }}
      >
        {loading ? "Processing…" : enrolled ? "Continue Learning →" : "Enroll Now"}
      </button>
    </div>
  );
}

function BenefitsSection() {
  const ref = useScrollFade() as React.RefObject<HTMLElement>;
  return (
    <section
      id="benefits"
      ref={ref as React.RefObject<HTMLElement>}
      className="th-scroll th-section-pad"
      style={{ background: "var(--th-surface-alt)", padding: "96px 24px", borderTop: "1px solid var(--th-border)", borderBottom: "1px solid var(--th-border)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Why <span style={{ color: "#F5C400" }}>Techiehive Academy?</span>
          </h2>
          <p style={{ color: "var(--th-muted)", fontSize: "1rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.8 }}>
            Techiehive Academy doesn't just teach — we shape. We craft job-ready digital warriors. Open to all: community members, outsiders, anyone hungry. We hone your skills, certify you, and blast you into local and global markets. Online or on-site classes. Ready to level up?
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "32px",
          }}
        >
          {benefits.map((benefit, i) => (
            <div key={benefit.title} className={`th-scroll th-scroll-d${i + 1}`} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(245,196,0,0.08)",
                  border: "1px solid rgba(245,196,0,0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {benefit.icon}
              </div>
              <div>
                <h3 style={{ color: "var(--th-text)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px" }}>
                  {benefit.title}
                </h3>
                <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreValuesSection() {
  const ref = useScrollFade() as React.RefObject<HTMLElement>;
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="th-scroll th-section-pad"
      style={{ background: "var(--th-bg)", padding: "96px 24px", borderBottom: "1px solid var(--th-border)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Our Core <span style={{ color: "#F5C400" }}>Values</span>
          </h2>
          <p style={{ color: "var(--th-muted)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            The principles that guide everything we do at Techiehive.
          </p>
        </div>

        <div className="core-values-grid">
          {coreValues.map((value, i) => (
            <CoreValueCard key={value.title} value={value} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreValueCard({ value, delay }: { value: { title: string; description: string }; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("th-in"), delay * 100);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="th-card-bounce"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--th-surface)",
        border: hovered ? "1.5px solid #F5C400" : "1.5px solid var(--th-border)",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.25s, transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(245,196,0,0.12)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(245,196,0,0.12)",
            border: "1px solid rgba(245,196,0,0.25)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#F5C400", fontWeight: 800, fontSize: "1rem" }}>
            {value.title[0]}
          </span>
        </div>
        <h3 style={{ color: "var(--th-text)", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
          {value.title}
        </h3>
      </div>
      <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
        {value.description}
      </p>
    </div>
  );
}

function Home() {
  return (
    <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", color: "var(--th-text)" }}>
      <NavbarShared />
      <Hero />
      <CoursesSection />
      <BenefitsSection />
      <CoreValuesSection />
      <FooterShared />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/payment/verify" component={PaymentVerifyPage} />
      <Route path="/learn/:courseId" component={LearnPage} />
      <Route path="/test/:courseId" component={TestPage} />
      <Route path="/certificate/:courseId" component={CertificatePage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
