import { useState } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed."); return; }
      if (data.user?.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      setLocation("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", background: "rgba(245,196,0,0.1)", borderRadius: "12px", marginBottom: "16px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "6px" }}>
              Admin Login
            </h1>
            <p style={{ color: "#555555", fontSize: "0.875rem" }}>
              Techiehive Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: "#111111", border: "1.5px solid #1f1f1f", borderRadius: "14px", padding: "32px" }}>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "12px 14px", marginBottom: "20px", color: "#ef4444", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "#888888", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techiehive.com"
                required
                style={{ width: "100%", background: "#0A0A0A", border: "1.5px solid #1f1f1f", color: "#FFFFFF", padding: "12px 14px", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.target.style.borderColor = "#1f1f1f")}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#888888", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                style={{ width: "100%", background: "#0A0A0A", border: "1.5px solid #1f1f1f", color: "#FFFFFF", padding: "12px 14px", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#F5C400")}
                onBlur={(e) => (e.target.style.borderColor = "#1f1f1f")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: "#F5C400", border: "none", color: "#0A0A0A", padding: "14px", borderRadius: "9px", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s" }}
            >
              {loading ? "Signing in…" : "Sign In as Admin"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", color: "#444444", fontSize: "0.82rem" }}>
            Student?{" "}
            <Link href="/login" style={{ color: "#F5C400", textDecoration: "none", fontWeight: 600 }}>
              Go to student login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
