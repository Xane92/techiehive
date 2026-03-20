import { useState } from "react";
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

const queryClient = new QueryClient();

const COURSE_AMOUNT = 15000;

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description: "Build complete web applications from front to back using modern frameworks and tools.",
  },
  {
    id: 2,
    title: "Video Editing",
    description: "Learn professional video editing techniques for content creation and production.",
  },
  {
    id: 3,
    title: "Graphics Design",
    description: "Create compelling visuals, logos, and brand identities using industry tools.",
  },
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

function Hero() {
  return (
    <section
      style={{
        background: "#0A0A0A",
        backgroundImage: `radial-gradient(circle, #1f1f1f 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,196,0,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: "780px", position: "relative", zIndex: 1 }}>
        <div
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
        >Africa's Premium EdTech Platform</div>
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
          }}
        >
          Learn In-Demand Tech Skills.{" "}
          <span style={{ color: "#F5C400" }}>Get Certified.</span>
        </h1>
        <p
          style={{
            color: "#888888",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            lineHeight: 1.7,
            marginBottom: "40px",
            maxWidth: "620px",
            margin: "0 auto 40px",
          }}
        >
          Techiehive offers structured video courses in web development, design, and digital skills — built for beginners who want real results.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/courses" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                maxHeight: "48px",
                lineHeight: 1,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              View Courses
            </button>
          </Link>
          <button
            style={{
              background: "transparent",
              border: "1.5px solid #FFFFFF",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              maxHeight: "48px",
              lineHeight: 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section style={{ background: "#0A0A0A", padding: "96px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            What You Can <span style={{ color: "#F5C400" }}>Learn</span>
          </h2>
          <p style={{ color: "#888888", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            Choose from our growing library of practical, career-ready courses.
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: { id: number; title: string; description: string } }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  async function handleEnroll() {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) {
      setLocation("/login");
      return;
    }
    const user = JSON.parse(userRaw) as { email: string };
    setLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/payment/verify`;
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, amount: COURSE_AMOUNT, courseId: course.id, callbackUrl }),
      });
      const data = await res.json();
      if (res.ok) window.location.href = data.authorization_url;
    } catch {
      /* silently fail on network errors */
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#111111",
        border: hovered ? "1.5px solid #F5C400" : "1.5px solid #1f1f1f",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(245,196,0,0.08)" : "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          background: "rgba(245,196,0,0.1)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4px",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <h3 style={{ color: "#FFFFFF", fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
        {course.title}
      </h3>
      <p style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>
        ₦{COURSE_AMOUNT.toLocaleString()}
      </p>
      <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
        {course.description}
      </p>
      <button
        onClick={handleEnroll}
        disabled={loading}
        style={{
          marginTop: "8px",
          background: hovered ? "#F5C400" : "transparent",
          border: "1.5px solid #F5C400",
          color: hovered ? "#0A0A0A" : "#F5C400",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "background 0.2s, color 0.2s",
          alignSelf: "flex-start",
        }}
      >
        {loading ? "Processing…" : "Enroll Now"}
      </button>
    </div>
  );
}

function BenefitsSection() {
  return (
    <section id="benefits" style={{ background: "#0d0d0d", padding: "96px 24px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Why Learn With <span style={{ color: "#F5C400" }}>Techiehive</span>
          </h2>
          <p style={{ color: "#888888", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            We're committed to making quality tech education accessible and effective.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "32px",
          }}
        >
          {benefits.map((benefit) => (
            <div key={benefit.title} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                <h3 style={{ color: "#FFFFFF", fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px" }}>
                  {benefit.title}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
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

function Home() {
  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <NavbarShared />
      <Hero />
      <CoursesSection />
      <BenefitsSection />
      <FooterShared />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/payment/verify" component={PaymentVerifyPage} />
      <Route path="/learn/:courseId" component={LearnPage} />
      <Route path="/test/:courseId" component={TestPage} />
      <Route path="/certificate/:courseId" component={CertificatePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
