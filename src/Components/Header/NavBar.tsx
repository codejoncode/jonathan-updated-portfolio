import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { textAccent, glassmorphismBorder } from "../../Helpers/Colors/colors";

const NAV_LINKS = [
  { to: "/home",           label: "Home" },
  { to: "/about",          label: "About" },
  { to: "/projects",       label: "Projects" },
  { to: "/resume",         label: "Resume" },
  { to: "/agile",          label: "Agile / PM" },
  { to: "/ai-engineer",    label: "AI Engineer", highlight: true },
  { to: "/ai-bug-triage",  label: "Bug Triage ✦", highlight: true },
  { to: "/blog",           label: "Blog" },
  { to: "/legal-research", label: "Legal Research", muted: true },
];

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav
      ref={menuRef}
      style={{
        background: "rgba(15, 15, 35, 0.95)",
        border: `0 0 1px 0`,
        borderBottom: `1px solid ${glassmorphismBorder}`,
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0, 210, 255, 0.08)",
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: "56px",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
          <Image
            src="/images/icon.png"
            size="mini"
            alt="Portfolio Logo"
            style={{ filter: "brightness(1.2) saturate(1.5)", transition: "all 0.3s ease" }}
          />
        </Link>

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="nav-desktop-links"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: link.highlight ? "#00D2FF" : isActive(link.to) ? "#00D2FF" : textAccent,
                fontWeight: link.highlight ? 700 : isActive(link.to) ? 600 : 500,
                fontSize: link.muted ? "0.82em" : "0.9em",
                opacity: link.muted ? 0.6 : 1,
                padding: "8px 12px",
                borderRadius: "6px",
                textDecoration: "none",
                letterSpacing: link.highlight ? "0.4px" : "normal",
                backgroundColor: isActive(link.to) ? "rgba(0,210,255,0.08)" : "transparent",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "none", // shown via CSS media query
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: open ? "#00D2FF" : textAccent,
            borderRadius: "2px",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "all 0.25s ease",
          }} />
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: open ? "#00D2FF" : textAccent,
            borderRadius: "2px",
            opacity: open ? 0 : 1,
            transition: "all 0.25s ease",
          }} />
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: open ? "#00D2FF" : textAccent,
            borderRadius: "2px",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "all 0.25s ease",
          }} />
        </button>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────── */}
      <div
        className="nav-mobile-menu"
        style={{
          overflow: "hidden",
          maxHeight: open ? "480px" : "0",
          transition: "max-height 0.3s ease",
          borderTop: open ? `1px solid rgba(0,210,255,0.15)` : "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: "block",
              color: link.highlight ? "#00D2FF" : isActive(link.to) ? "#00D2FF" : textAccent,
              fontWeight: link.highlight ? 700 : isActive(link.to) ? 600 : 500,
              fontSize: link.muted ? "0.88em" : "0.95em",
              opacity: link.muted ? 0.65 : 1,
              padding: "14px 20px",
              textDecoration: "none",
              backgroundColor: isActive(link.to) ? "rgba(0,210,255,0.06)" : "transparent",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              letterSpacing: link.highlight ? "0.4px" : "normal",
            }}
          >
            {link.highlight && <span style={{ marginRight: "8px" }}>✦</span>}
            {link.label}
          </Link>
        ))}
      </div>

      {/* ── Responsive styles (injected once) ───────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
