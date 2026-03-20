import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#111111",
    border: "1.5px solid #1f1f1f",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#FFFFFF",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#CCCCCC",
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "8px",
  };

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
            Contact <span style={{ color: "#F5C400" }}>Us</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
            Have a question? We're here to help.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px 96px" }}>
        {submitted ? (
          <div
            style={{
              background: "#111111",
              border: "1.5px solid rgba(245,196,0,0.4)",
              borderRadius: "12px",
              padding: "40px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>✓</div>
            <h3 style={{ color: "#F5C400", fontWeight: 700, fontSize: "1.1rem", marginBottom: "10px" }}>
              Message Sent!
            </h3>
            <p style={{ color: "#888888", fontSize: "0.9rem", margin: 0 }}>
              Thanks for reaching out, {form.name}! We'll get back to you at {form.email} as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                required
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
              />
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
              />
            </div>

            {error && (
              <p style={{ color: "#ff6b6b", fontSize: "0.875rem", margin: 0, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: "13px 28px",
                borderRadius: "8px",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                alignSelf: "flex-start",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = loading ? "0.7" : "1"; }}
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #1a1a1a" }}>
          <p style={{ color: "#555555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
            Email
          </p>
          <a
            href="mailto:techiehive001@gmail.com"
            style={{ color: "#F5C400", fontSize: "0.95rem", textDecoration: "none", fontWeight: 600 }}
          >
            techiehive001@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
