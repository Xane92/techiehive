import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/context/ThemeContext";
import logo from "@/assets/Techiehive_Logo.jpeg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
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

  const toggleBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1.5px solid var(--th-border)",
    color: "var(--th-text)",
    borderRadius: "8px",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "border-color 0.2s, color 0.2s",
  };

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={toggleBtnStyle}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#F5C400"; (e.currentTarget as HTMLButtonElement).style.color = "#F5C400"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--th-border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--th-text)"; }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );

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
        backgroundColor: "var(--th-nav-bg)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(245,196,0,0.07)",
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
            display: "flex",
            alignItems: "center",
            color: "#F5C400",
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="Techiehive logo"
            style={{ height: "36px", width: "auto", marginRight: "8px", borderRadius: "4px", display: "block" }}
          />
          Techiehive
        </Link>

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ThemeToggle />
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
              <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#F5C400" : "var(--th-text)", borderRadius: "2px", transition: "background 0.2s, transform 0.2s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "transparent" : "var(--th-text)", borderRadius: "2px", transition: "background 0.2s" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#F5C400" : "var(--th-text)", borderRadius: "2px", transition: "background 0.2s, transform 0.2s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{ display: "flex", gap: "28px" }}>
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{ color: "var(--th-text)", textDecoration: "none", fontSize: "0.875rem", opacity: 0.75, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.opacity = "0.75")}
                >
                  {label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
            <AuthButtons />
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--th-border)",
            background: "var(--th-nav-bg)",
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
              style={{ color: "var(--th-text-sec)", textDecoration: "none", fontSize: "1rem", fontWeight: 500, padding: "12px 0", borderBottom: "1px solid var(--th-border)", display: "block" }}
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
