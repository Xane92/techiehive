import { Link } from "wouter";
import logo from "@/assets/Techiehive_Logo.jpeg";

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--th-bg)", padding: "64px 24px 0" }}>
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
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <img
              src={logo}
              alt="Techiehive logo"
              style={{ height: "28px", width: "auto", marginRight: "8px", borderRadius: "3px", display: "block" }}
            />
            <span style={{ color: "#F5C400", fontWeight: 800, fontSize: "1.3rem" }}>
              Techiehive
            </span>
          </div>
          <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0, maxWidth: "220px" }}>
            Empowering the next generation of African tech professionals through quality education.
          </p>
        </div>

        <div>
          <h4 style={{ color: "var(--th-text)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                  color: "var(--th-muted)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#F5C400")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--th-muted)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: "var(--th-text)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Contact
          </h4>
          <p style={{ color: "var(--th-muted)", fontSize: "0.875rem", margin: "0 0 16px" }}>
            techiehive001@gmail.com
          </p>
          <h4 style={{ color: "var(--th-text)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Follow Us
          </h4>
          <a
            href="https://www.instagram.com/techiehive_"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--th-muted)",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C400")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--th-muted)")}
          >
            <InstagramIcon />
            @techiehive_
          </a>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--th-border)",
          padding: "20px 0",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <p style={{ color: "var(--th-muted)", fontSize: "0.8rem", margin: 0 }}>
          © 2025 Techiehive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
