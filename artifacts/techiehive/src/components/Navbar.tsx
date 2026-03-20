import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [location, setLocation] = useLocation();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setLocation("/");
  }

  const AuthButtons = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <div
      style={{
        display: "flex",
        flexDirection: fullWidth ? "column" : "row",
        gap: "10px",
        alignItems: fullWidth ? "stretch" : "center",
        marginTop: fullWidth ? "16px" : 0,
      }}
    >
      {isLoggedIn ? (
        <>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: fullWidth ? "100%" : "auto",
                background: "transparent",
                border: "1.5px solid #F5C400",
                color: "#F5C400",
                padding: fullWidth ? "12px 16px" : "8px 16px",
                borderRadius: "6px",
                fontSize: fullWidth ? "0.9rem" : "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                height: fullWidth ? "auto" : "36px",
                lineHeight: 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(245,196,0,0.08)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            >
              Dashboard
            </button>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: fullWidth ? "100%" : "auto",
              background: "#F5C400",
              border: "none",
              color: "#0A0A0A",
              padding: fullWidth ? "12px 16px" : "8px 16px",
              borderRadius: "6px",
              fontSize: fullWidth ? "0.9rem" : "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
              height: fullWidth ? "auto" : "36px",
              lineHeight: 1,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: fullWidth ? "100%" : "auto",
                background: "transparent",
                border: "1.5px solid #F5C400",
                color: "#F5C400",
                padding: fullWidth ? "12px 16px" : "8px 16px",
                borderRadius: "6px",
                fontSize: fullWidth ? "0.9rem" : "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                height: fullWidth ? "auto" : "36px",
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
                width: fullWidth ? "100%" : "auto",
                background: "#F5C400",
                border: "none",
                color: "#0A0A0A",
                padding: fullWidth ? "12px 16px" : "8px 16px",
                borderRadius: "6px",
                fontSize: fullWidth ? "0.9rem" : "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
                height: fullWidth ? "auto" : "36px",
                lineHeight: 1,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              Enroll Now
            </button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#F5C400",
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          Techiehive
        </Link>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#F5C400" : "#FFFFFF", borderRadius: "2px", transition: "background 0.2s, transform 0.2s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "transparent" : "#FFFFFF", borderRadius: "2px", transition: "background 0.2s" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#F5C400" : "#FFFFFF", borderRadius: "2px", transition: "background 0.2s, transform 0.2s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <div style={{ display: "flex", gap: "28px" }}>
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{ color: "#FFFFFF", textDecoration: "none", fontSize: "0.875rem", opacity: 0.75, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.opacity = "0.75")}
                >
                  {label}
                </Link>
              ))}
            </div>
            <AuthButtons />
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            background: "rgba(10,10,10,0.98)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{ color: "#CCCCCC", textDecoration: "none", fontSize: "1rem", fontWeight: 500, padding: "12px 0", borderBottom: "1px solid #1a1a1a", display: "block" }}
            >
              {label}
            </Link>
          ))}
          <AuthButtons fullWidth />
        </div>
      )}
    </nav>
  );
}
