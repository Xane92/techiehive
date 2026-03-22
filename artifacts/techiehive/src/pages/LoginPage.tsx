import { useState } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { API_BASE } from "@/lib/api";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation("/dashboard");
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

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "80px 24px 96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "10px" }}>
            Sign in to <span style={{ color: "#F5C400" }}>Techiehive</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#F5C400", textDecoration: "none", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>

        <div style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "12px", padding: "32px 28px" }}>
          {error && (
            <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#ff6b6b", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#CCCCCC", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")} />
            </div>

            <div>
              <label style={{ display: "block", color: "#CCCCCC", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>Password</label>
              <input name="password" type="password" placeholder="Your password" required value={form.password} onChange={handleChange} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "13px 28px", borderRadius: "8px", fontSize: "0.9375rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", marginTop: "4px" }}
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
