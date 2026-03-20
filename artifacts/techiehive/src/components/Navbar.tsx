import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <Link href="/" style={{ color: "#F5C400", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", flexShrink: 0, textDecoration: "none" }}>
          Techiehive
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ display: "flex", gap: "28px" }}>
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
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  opacity: 0.75,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.opacity = "0.75")}
              >
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "transparent",
                  border: "1.5px solid #F5C400",
                  color: "#F5C400",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  height: "36px",
                  lineHeight: 1,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(245,196,0,0.08)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              >
                Login
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "#F5C400",
                  border: "none",
                  color: "#0A0A0A",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  height: "36px",
                  lineHeight: 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Enroll Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
