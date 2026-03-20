import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      setLocation("/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      setLocation("/login");
    }
  }, [setLocation]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  }

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#FFFFFF" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 24px 96px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
          <div>
            <p style={{ color: "#888888", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Welcome back
            </p>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
              {user.full_name} 👋
            </h1>
            <p style={{ color: "#555555", fontSize: "0.875rem", marginTop: "6px" }}>{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "1.5px solid #333333", color: "#888888", padding: "8px 18px", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b6b"; e.currentTarget.style.color = "#ff6b6b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333333"; e.currentTarget.style.color = "#888888"; }}
          >
            Log Out
          </button>
        </div>

        <div style={{ background: "#111111", border: "1.5px solid rgba(245,196,0,0.2)", borderRadius: "12px", padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", background: "rgba(245,196,0,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.5rem" }}>
            🚧
          </div>
          <h2 style={{ color: "#FFFFFF", fontSize: "1.3rem", fontWeight: 700, marginBottom: "12px" }}>
            Welcome to your Dashboard
          </h2>
          <p style={{ color: "#888888", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 24px" }}>
            Your learning portal is coming soon. In the meantime, browse our available courses and get ready to start learning.
          </p>
          <Link href="/courses">
            <button
              style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "12px 24px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              Browse Courses
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
