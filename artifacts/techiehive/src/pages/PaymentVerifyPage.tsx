import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { API_BASE } from '@/lib/api';

export default function PaymentVerifyPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") ?? params.get("trxref");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found in URL.");
      return;
    }

    fetch(`${API_BASE}/api/payment/verify/${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => setLocation("/dashboard?enrolled=true"), 1800);
        } else {
          setStatus("error");
          setMessage(data.error ?? "Payment verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error while verifying payment.");
      });
  }, [setLocation]);

  return (
    <div style={{ backgroundColor: "var(--th-bg)", minHeight: "100vh", color: "var(--th-text)" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                width: "52px",
                height: "52px",
                border: "3px solid var(--th-border)",
                borderTop: "3px solid #F5C400",
                borderRadius: "50%",
                margin: "0 auto 28px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ color: "var(--th-text)", fontWeight: 700, fontSize: "1.3rem", marginBottom: "10px" }}>
              Verifying your payment…
            </h2>
            <p style={{ color: "var(--th-muted)", fontSize: "0.9rem" }}>
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(245,196,0,0.12)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "1.8rem",
              }}
            >
              ✓
            </div>
            <h2 style={{ color: "#F5C400", fontWeight: 800, fontSize: "1.4rem", marginBottom: "10px" }}>
              Payment Successful!
            </h2>
            <p style={{ color: "var(--th-muted)", fontSize: "0.9rem" }}>
              You're now enrolled. Redirecting to your dashboard…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(220,50,50,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "1.8rem",
              }}
            >
              ✕
            </div>
            <h2 style={{ color: "#ff6b6b", fontWeight: 800, fontSize: "1.4rem", marginBottom: "10px" }}>
              Verification Failed
            </h2>
            <p style={{ color: "var(--th-muted)", fontSize: "0.9rem", marginBottom: "28px" }}>{message}</p>
            <button
              onClick={() => setLocation("/courses")}
              style={{
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Back to Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
}
