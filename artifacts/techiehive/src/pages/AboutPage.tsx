import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const differentiators = [
  {
    title: "Structured Curriculum",
    description: "Every course follows a clear step-by-step path designed to take you from zero to certified without confusion.",
  },
  {
    title: "Certification on Completion",
    description: "Earn a recognized certificate after passing the final test — proof of your skills for employers and clients.",
  },
  {
    title: "Lifetime Access",
    description: "Pay once, access your course forever. Learn at your own pace and revisit lessons whenever you need.",
  },
];

function PageHeader() {
  return (
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
          About <span style={{ color: "#F5C400" }}>Techiehive</span>
        </h1>
        <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
          Built for the next generation of African tech professionals.
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <Navbar />
      <PageHeader />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px" }}>

        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Who We Are
          </h2>
          <p style={{ color: "#CCCCCC", fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
            Techiehive is an online education platform built to teach practical, in-demand digital and tech skills. We focus on structured learning, real-world application, and certifying students who complete our programs.
          </p>
        </section>

        <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: "64px" }} />

        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Our Mission
          </h2>
          <p style={{ color: "#CCCCCC", fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
            To make quality tech education accessible to every African who wants to build a career in the digital economy.
          </p>
        </section>

        <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: "64px" }} />

        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ color: "#F5C400", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Our Vision
          </h2>
          <p style={{ color: "#CCCCCC", fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
            A continent where anyone with a phone and the will to learn can become a certified tech professional.
          </p>
        </section>

        <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: "64px" }} />

        <section>
          <h2 style={{ color: "#FFFFFF", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "32px" }}>
            What Makes Us <span style={{ color: "#F5C400" }}>Different</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {differentiators.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#111111",
                  border: "1.5px solid #1f1f1f",
                  borderRadius: "12px",
                  padding: "24px 20px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(245,196,0,0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <span style={{ color: "#F5C400", fontSize: "1rem" }}>✦</span>
                </div>
                <h3 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "10px" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
