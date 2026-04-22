import { useEffect, useRef } from "react";
import NavbarShared from "@/components/Navbar";
import FooterShared from "@/components/Footer";
import techCommunityImg from "@assets/tech-community-africa.jpg";
import africanStudentsImg from "@assets/african-students-laptop.jpg";
import codingClassImg from "@assets/coding-class-africa.jpg";

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

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: "Job Placement",
    description: "We connect you with real job opportunities tailored to your digital skill set.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Mentorship",
    description: "Learn directly from industry experts who guide you on your journey to success.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: "Exclusive Giveaways",
    description: "Community members get exclusive perks, resources, and rewards regularly.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Tech Hub Tours",
    description: "Media tours to tech hubs that match your passion and accelerate your network.",
  },
];

export default function CommunityPage() {
  const aboutRef = useScrollFade() as React.RefObject<HTMLElement>;
  const photoRef = useScrollFade() as React.RefObject<HTMLElement>;
  const whyRef = useScrollFade() as React.RefObject<HTMLElement>;
  const ctaRef = useScrollFade() as React.RefObject<HTMLElement>;

  return (
    <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", color: "var(--th-text)" }}>
      <NavbarShared />

      {/* Page Header */}
      <section
        style={{
          background: "var(--th-bg)",
          backgroundImage: "radial-gradient(circle, var(--th-dot) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          padding: "96px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
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
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
              marginBottom: "24px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Community
          </div>
          <h1
            className="th-anim th-anim-d1"
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            The <span style={{ color: "#F5C400" }}>Techiehive</span> Community
          </h1>
          <p
            className="th-anim th-anim-d2"
            style={{
              color: "var(--th-muted)",
              fontSize: "clamp(1rem, 2vw, 1.1rem)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            A vibrant community uniting individuals with cutting-edge digital skills
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      <section
        ref={photoRef as React.RefObject<HTMLElement>}
        className="th-scroll"
        style={{ padding: "0", overflow: "hidden" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", height: "320px" }}>
          <img
            src={techCommunityImg}
            alt="Tech community"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <img
            src={codingClassImg}
            alt="Coding class"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <img
            src={africanStudentsImg}
            alt="African students"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* About */}
      <section
        ref={aboutRef as React.RefObject<HTMLElement>}
        className="th-scroll"
        style={{
          background: "var(--th-surface-alt)",
          borderTop: "1px solid var(--th-border)",
          borderBottom: "1px solid var(--th-border)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            About the <span style={{ color: "#F5C400" }}>Community</span>
          </h2>
          <p style={{ color: "var(--th-muted)", fontSize: "1rem", lineHeight: 1.85, margin: 0 }}>
            Techiehive is a vibrant community that unites individuals with cutting-edge digital skills, empowering them to thrive in the fast-paced world of tech. Backed by Techiehive Academy, led by expert tutors in full-stack web development, graphic design, product management, 3D animation, video editing, forex, and crypto, we ensure that every member who passes through our doors is job-ready, primed to crush it in their chosen digital niche.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section
        ref={whyRef as React.RefObject<HTMLElement>}
        className="th-scroll"
        style={{ background: "var(--th-bg)", padding: "88px 24px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                color: "var(--th-text)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                fontWeight: 800,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Why Join the <span style={{ color: "#F5C400" }}>Techiehive Community?</span>
            </h2>
            <p
              style={{
                color: "var(--th-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Techiehive community is different — we thrive on inclusivity, no skill level left behind. We land you jobs, mentor you, give stuff away, and take you on media tours to tech hubs matching your passion.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {benefits.map((benefit, i) => (
              <BenefitCard key={benefit.title} benefit={benefit} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef as React.RefObject<HTMLElement>}
        className="th-scroll"
        style={{
          background: "var(--th-surface-alt)",
          borderTop: "1px solid var(--th-border)",
          padding: "88px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2
            style={{
              color: "var(--th-text)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to <span style={{ color: "#F5C400" }}>Join?</span>
          </h2>
          <p
            style={{
              color: "var(--th-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            To join the Techiehive community, follow us on Instagram and click the link in bio.
          </p>

           <a href="https://www.instagram.com/techiehive_"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: "14px 32px",
                borderRadius: "8px",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.opacity = "0.88";
                b.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.opacity = "1";
                b.style.transform = "translateY(0)";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Follow on Instagram
            </button>
          </a>
        </div>
      </section>

      <FooterShared />
    </div>
  );
}

function BenefitCard({
  benefit,
  delay,
}: {
  benefit: { icon: React.ReactNode; title: string; description: string };
  delay: number;
}) {
  const ref = useScrollFade(0.1) as React.RefObject<HTMLElement>;
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`th-scroll th-scroll-d${Math.min(delay + 1, 5)}`}
      style={{
        background: "var(--th-surface)",
        border: "1.5px solid var(--th-border)",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "border-color 0.25s, transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#F5C400";
        el.style.transform = "translateY(-5px)";
        el.style.boxShadow = "0 16px 48px rgba(245,196,0,0.14)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--th-border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
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
      <h3 style={{ color: "var(--th-text)", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
        {benefit.title}
      </h3>
      <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
        {benefit.description}
      </p>
    </div>
  );
}
