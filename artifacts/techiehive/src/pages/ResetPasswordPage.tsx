import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") ?? "";
    if (!t) {
      setError("No reset token found. Please request a new password reset link.");
    }
    setToken(t);
  }, []);

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
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => setLocation("/login"), 2500);
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
            Reset your <span style={{ color: "#F5C400" }}>Password</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "0.9rem" }}>
            Choose a strong new password for your account.
          </p>
        </div>

        <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "32px 28px" }}>
          {success ? (
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
                ✓
              </div>
              <h3 style={{ color: "#F5C400", fontWeight: 700, fontSize: "1.05rem", marginBottom: "12px" }}>
                Password Reset Successfully
              </h3>
              <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 24px" }}>
                Your password has been updated. Redirecting you to the login page…
              </p>
              <Link href="/login" style={{ color: "#F5C400", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                Go to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {error && (
                <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#ff6b6b", fontSize: "0.875rem" }}>
                  {error}
                  {!token && (
                    <div style={{ marginTop: "10px" }}>
                      <Link href="/forgot-password" style={{ color: "#F5C400", fontWeight: 600, textDecoration: "none" }}>
                        Request a new reset link →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: "block", color: "#CCCCCC", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#CCCCCC", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your new password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                style={{
                  background: "#F5C400",
                  border: "none",
                  color: "#0A0A0A",
                  padding: "13px 28px",
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: loading || !token ? "not-allowed" : "pointer",
                  opacity: loading || !token ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { if (!loading && token) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = loading || !token ? "0.7" : "1"; }}
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>

              <p style={{ textAlign: "center", margin: 0, color: "#555555", fontSize: "0.875rem" }}>
                <Link href="/login" style={{ color: "#F5C400", textDecoration: "none", fontWeight: 600 }}>
                  ← Back to Sign In
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
