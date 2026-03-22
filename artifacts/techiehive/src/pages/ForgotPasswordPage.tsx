import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "80px 24px 96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "10px" }}>
            Forgot <span style={{ color: "#F5C400" }}>Password?</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "32px 28px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(245,196,0,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "1.5rem",
                }}
              >
                ✉️
              </div>
              <h3 style={{ color: "#F5C400", fontWeight: 700, fontSize: "1.05rem", marginBottom: "12px" }}>
                Check your inbox
              </h3>
              <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 24px" }}>
                If an account exists with <strong style={{ color: "#CCCCCC" }}>{email}</strong>, a password reset link has been sent. Check your spam folder if you don't see it.
              </p>
              <Link href="/login" style={{ color: "#F5C400", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {error && (
                <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#ff6b6b", fontSize: "0.875rem" }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: "block", color: "#CCCCCC", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
                />
              </div>

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
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = loading ? "0.7" : "1"; }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <p style={{ textAlign: "center", margin: 0, color: "#555555", fontSize: "0.875rem" }}>
                Remember your password?{" "}
                <Link href="/login" style={{ color: "#F5C400", textDecoration: "none", fontWeight: 600 }}>
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
