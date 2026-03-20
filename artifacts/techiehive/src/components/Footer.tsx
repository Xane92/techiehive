import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", padding: "64px 24px 0" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px",
          paddingBottom: "48px",
        }}
      >
        <div>
          <span style={{ color: "#F5C400", fontWeight: 800, fontSize: "1.3rem", display: "block", marginBottom: "12px" }}>
            Techiehive
          </span>
          <p style={{ color: "#888888", fontSize: "0.875rem", lineHeight: 1.7, margin: 0, maxWidth: "220px" }}>
            Empowering the next generation of African tech professionals through quality education.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Quick Links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  color: "#888888",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#F5C400")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#888888")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Contact
          </h4>
          <p style={{ color: "#888888", fontSize: "0.875rem", margin: 0 }}>
            hello@techiehive.com
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "20px 0",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <p style={{ color: "#555555", fontSize: "0.8rem", margin: 0 }}>
          © 2025 Techiehive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
