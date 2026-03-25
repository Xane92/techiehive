import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import { API_BASE } from '@/lib/api';

const COURSE_NAMES: Record<number, string> = {
  1: "Full Stack Web Development",
  2: "Video Editing",
  3: "Graphics Design",
};

interface StoredUser {
  id: number;
  full_name: string;
  email: string;
}

interface CertData {
  issued_at: string;
}

export default function CertificatePage() {
  const { courseId: courseIdStr } = useParams<{ courseId: string }>();
  const courseId = parseInt(courseIdStr ?? "0", 10);
  const [, setLocation] = useLocation();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) { setLocation("/login"); return; }

    let parsedUser: StoredUser;
    try { parsedUser = JSON.parse(stored); setUser(parsedUser); }
    catch { setLocation("/login"); return; }

    fetch(`${API_BASE}/api/certificates/${parsedUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        const found = (data.certificates ?? []).find(
          (c: { course_id: number; issued_at: string }) => c.course_id === courseId
        );
        if (!found) { setLocation("/dashboard"); return; }
        setCert(found);
      })
      .catch(() => setLocation("/dashboard"))
      .finally(() => setLoading(false));
  }, [courseId, setLocation]);

  async function handleDownload() {
    if (!certRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: "var(--th-bg)",
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Techiehive_Certificate_${COURSE_NAMES[courseId] ?? courseId}.pdf`);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid var(--th-border)", borderTopColor: "#F5C400", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || !cert) return null;

  const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", color: "var(--th-text)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <Link href="/dashboard"
            style={{ color: "var(--th-muted)", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C400")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--th-muted)")}
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleDownload}
            style={{ background: "#F5C400", border: "none", color: "#0A0A0A", padding: "10px 24px", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Certificate
          </button>
        </div>

        <div
          ref={certRef}
          style={{
            background: "var(--th-bg)",
            border: "2px solid #F5C400",
            borderRadius: "16px",
            padding: "64px 56px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 20%, rgba(245,196,0,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(245,196,0,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />

          <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", bottom: "12px", border: "1px solid rgba(245,196,0,0.15)", borderRadius: "10px", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F5C400", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              Techiehive
            </div>
            <p style={{ color: "var(--th-muted)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "36px" }}>
              Africa's Premium EdTech Platform
            </p>

            <div style={{ width: "60px", height: "2px", background: "#F5C400", margin: "0 auto 36px" }} />

            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "8px", lineHeight: 1.2 }}>
              Certificate of Completion
            </h1>
            <p style={{ color: "var(--th-muted)", fontSize: "0.88rem", marginBottom: "40px" }}>
              This certifies that
            </p>

            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: "#F5C400", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                {user.full_name}
              </p>
              <div style={{ width: "200px", height: "1px", background: "rgba(245,196,0,0.3)", margin: "0 auto" }} />
            </div>

            <p style={{ color: "var(--th-muted)", fontSize: "0.9rem", marginBottom: "12px" }}>
              has successfully completed
            </p>
            <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "var(--th-text)", marginBottom: "48px", lineHeight: 1.3 }}>
              {COURSE_NAMES[courseId]}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "120px", height: "1px", background: "#333333", marginBottom: "8px" }} />
                <p style={{ color: "var(--th-muted)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Date Issued</p>
                <p style={{ color: "var(--th-text-sec)", fontSize: "0.85rem", fontWeight: 600, marginTop: "4px" }}>{issuedDate}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "120px", height: "1px", background: "#333333", marginBottom: "8px" }} />
                <p style={{ color: "var(--th-muted)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Issued By</p>
                <p style={{ color: "#F5C400", fontSize: "0.85rem", fontWeight: 700, marginTop: "4px" }}>Techiehive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
