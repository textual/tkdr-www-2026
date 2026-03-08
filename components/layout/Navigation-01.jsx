"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Tracks",
    href: "/tracks",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    label: "Events",
    href: "/events",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&display=swap');

        :root {
          --bg: #0d0d0d;
          --sidebar-bg: #111111;
          --border: #222222;
          --text-muted: #555;
          --text: #c8c8c8;
          --accent: var(--color-brand);
          --accent-dark: #0d0d0d;
          --sidebar-width: 220px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Mono', monospace;
          min-height: 100vh;
        }

        /* ── SIDEBAR (desktop) ── */
        .sidebar {
          display: none;
        }

        @media (min-width: 768px) {
          .sidebar {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border);
            padding: 6px 0;
            z-index: 100;
          }

          .main-content {
            margin-left: var(--sidebar-width);
          }
        }

        .sidebar-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 0 24px 36px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 28px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 6px;
          flex: 1;
        }

        /* ── NAV ITEM (desktop hover effect) ── */
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
        //   border-radius: 6px;
          text-decoration: none;
          // color: var(--text-muted);
          color: var(--text-white);
        //   font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          overflow: hidden;
          transition: color 0.28s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        /* The sliding fill — hidden on mobile */
        @media (min-width: 768px) {
          .nav-item {
            color: var(--text-muted);
          }
            
          .nav-item::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--accent);
            transform: translateX(-101%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 0;
            border-radius: 6px;
          }

          .nav-item:hover::before,
          .nav-item.active::before {
            transform: translateX(0);
          }

          .nav-item:hover,
          .nav-item.active {
            color: var(--color-brand-foreground);
            border-color: var(--accent);
          }
        }

        /* Active state on mobile — simple highlight */
        @media (max-width: 767px) {
          .nav-item.active {
            color: var(--color-brand-foreground);
            background: var(--color-brand)
          }
        }

        .nav-item-icon,
        .nav-item-label {
          position: relative;
          z-index: 1;
        }

        .nav-item-label {
          font-weight: 500;
        }

        /* Active dot indicator */
        .active-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-brand-foreground);
          margin-left: auto;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .nav-item.active .active-dot,
          .nav-item:hover .active-dot {
            background: var(--color-brand-foreground);
          }
        }

        /* ── MOBILE TOPBAR ── */
        .mobile-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--sidebar-bg);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        @media (min-width: 768px) {
          .mobile-topbar {
            display: none;
          }
        }

        .mobile-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .hamburger {
          background: none;
          border: 1px solid var(--border);
          border-radius: 4px;
          width: 36px;
          height: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          padding: 0;
        }

        .hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: var(--text);
          transition: all 0.25s ease;
          transform-origin: center;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── MOBILE SLIDE-OUT DRAWER ── */
        .mobile-drawer-overlay,
        .mobile-drawer {
          display: none;
        }

        @media (max-width: 767px) {
          .mobile-drawer-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 150;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .mobile-drawer-overlay.open {
            opacity: 1;
            pointer-events: all;
          }

          .mobile-drawer {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 260px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border);
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 36px 0;
            display: flex;
            flex-direction: column;
          }

          .mobile-drawer.open {
            transform: translateX(0);
          }
        }

        .drawer-logo {
          // font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 0 24px 28px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 16px;
        }

        /* ── MAIN CONTENT ── */
        .main-content {
          padding: 40px 32px;
          min-height: 100vh;
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar">
        <Logo />
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {isActive && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <header className="mobile-topbar">
        <Logo />
        <button
          className={`hamburger${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`mobile-drawer-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-drawer${mobileOpen ? " open" : ""}`}>
        <Logo />
        <nav className="drawer-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {isActive && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
