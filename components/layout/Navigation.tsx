"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Logo from "./Logo";
import styles from "./Navigation.module.css";
import { LocationBanner } from "../home/locationBanner";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/tracks",
    label: "Tracks",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 16 C2 16 3 8 8 6 C11 5 12 7 14 6 C16 5 18 3 20 5 C22 7 21 10 19 11 C17 12 15 11 14 13 C13 15 15 17 14 19 C13 21 9 22 6 20 C4 19 2 16 2 16" />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

const BOTTOM_ITEMS = [
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  href,
  label,
  icon,
  active,
  onClick,
  index,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  index: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`nav-item${active ? " nav-item--active" : ""}`}
      style={{ animationDelay: `${index * 0.045}s` }}
    >
      <span className="nav-fill" />
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
      {active && <span className="nav-dot" />}
    </Link>
  );
}

// ─── Shared sidebar body ──────────────────────────────────────────────────────
// Used in both the desktop sidebar and the mobile Sheet

function SidebarBody({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="sidebar-body">
      {/* Logo */}
      <div className="sidebar-logo">
        <Logo />
      </div>

      {/* Location pill */}
      <div className={styles["sidebar-location"]}>
        <LocationBanner mode="sidebar" />
      </div>
      <div className="p-4">
        <span className={styles["location-dot"]} />
        <LocationBanner mode="sidebar" />
      </div>
      <div className="sidebar-divider" />

      {/* Main nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
            onClick={onNavigate}
            index={i}
          />
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-divider" />

      {/* Bottom nav */}
      <nav className="sidebar-nav sidebar-nav--bottom">
        {BOTTOM_ITEMS.map((item, i) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
            onClick={onNavigate}
            index={i}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600&display=swap');

        /* ─── Tokens ─────────────────────────────── */
        :root {
          --nav-brand:      #ba1111;
          --nav-brand-glow: rgba(186,17,17,0.18);
          --nav-width:      220px;
        }



        /* ─── Desktop sidebar ────────────────────── */
        /*
          sticky + top:0 + height:100vh means the sidebar
          stays in view while the content scrolls beside it.
          It's a real flex child so content sits next to it —
          no overlay, no z-index fighting.
        */
        .nav-sidebar {
          display: none;
        }

        @media (min-width: 768px) {
          .nav-sidebar {
            display: flex;
            flex-direction: column;
            width: var(--nav-width);
            flex-shrink: 0;
            position: sticky;
            top: 0;
            height: 100vh;
            background: hsl(var(--sidebar));
            border-right: 1px solid hsl(var(--sidebar-border));
            z-index: 40;
          }
        }

        /* ─── Mobile topbar ──────────────────────── */
        /*
          Block-level element at the top of the flex column —
          content naturally sits below it. No fixed, no body padding.
        */
        .nav-topbar {
          display: flex;
          align-items: center;
          // justify-content: space-between;
          gap:1rem;
          padding: 1rem;
          background: hsl(var(--sidebar));
          border-bottom: 1px solid hsl(var(--sidebar-border));
          /* sticky so it stays at top while scrolling */
          position: sticky;
          top: 0;
          z-index: 40;
        }

        @media (min-width: 768px) {
          .nav-topbar {
            display: none;
          }
        }

        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 7px;
        }



        /* ─── Sidebar body ───────────────────────── */
        .sidebar-body {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 28px 0 20px;
          overflow-y: auto;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 18px 20px;
        }


        .logo-text {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: hsl(var(--sidebar-foreground));
        }

        .logo-accent {
          color: var(--nav-brand);
        }

        

        

        

        .sidebar-divider {
          height: 1px;
          background: hsl(var(--sidebar-border));
          margin-bottom: 10px;
          flex-shrink: 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 8px;
        }

        .sidebar-spacer { flex: 1; }

        .sidebar-nav--bottom {
          padding-top: 10px;
        }

        /* ─── Nav item + wipe effect ─────────────── */
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 4px;
          text-decoration: none;
          color: hsl(var(--sidebar-foreground));
          opacity: 0.4;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          overflow: hidden;
          border: 1px solid transparent;
          /* color transition for when fill covers it */
          transition: color 0.2s ease, opacity 0.2s ease, border-color 0.2s ease;
          /* staggered mount */
          animation: nav-in 0.3s ease both;
        }

        @keyframes nav-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 0.4; transform: translateX(0); }
        }

        /* The sliding fill */
        .nav-fill {
          position: absolute;
          inset: 0;
          background: var(--nav-brand);
          border-radius: 3px;
          z-index: 0;
          /* Resting: parked LEFT, ready to sweep in */
          transform: translateX(-101%);
          transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Icon, label, dot float above fill */
        .nav-icon,
        .nav-label,
        .nav-dot {
          position: relative;
          z-index: 1;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          flex-shrink: 0;
        }

        .nav-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          margin-left: auto;
        }

        /* Hover — wipes IN from left */
        @media (hover: hover) {
          .nav-item:hover {
            opacity: 1;
            color: #fff;
            border-color: var(--nav-brand);
          }

          .nav-item:hover .nav-fill {
            transform: translateX(0);
          }

          /* Mouse-off — exits to the RIGHT */
          .nav-item:not(:hover):not(.nav-item--active) .nav-fill {
            transform: translateX(101%);
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.6, 1);
          }
        }

        /* Active — always filled, overrides the exit state */
        .nav-item--active {
          opacity: 1 !important;
          color: #fff !important;
          border-color: var(--nav-brand) !important;
          animation: nav-in-active 0.3s ease both;
        }

        @keyframes nav-in-active {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .nav-item--active .nav-fill {
          transform: translateX(0) !important;
          /* No exit transition for active items */
          transition: none !important;
        }

        /* ─── Sheet panel overrides ──────────────── */
        /* 
          Shadcn Sheet injects its own padding and close button.
          We zero out the padding so our sidebar-body controls spacing,
          and ensure the panel background matches the sidebar token.
        */
        [data-radix-dialog-content].sheet-nav {
          padding: 0 !important;
          background: hsl(var(--sidebar)) !important;
          border-right: 1px solid hsl(var(--sidebar-border)) !important;
          width: var(--nav-width) !important;
          max-width: var(--nav-width) !important;
          font-family: 'Chakra Petch', sans-serif;
        }
      `}</style>

      {/* ── Desktop sidebar — flex sibling to main content ── */}
      <aside className="nav-sidebar">
        <SidebarBody pathname={pathname} />
      </aside>

      {/* ── Mobile topbar — block element, content sits below ── */}
      <header className="nav-topbar">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={`${styles.hamburger} ${open ? styles["hamburger--open"] : ""}`}
              aria-label="Open navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="sheet-nav">
            <VisuallyHidden.Root>
              <SheetTitle>Navigation</SheetTitle>
            </VisuallyHidden.Root>

            <SidebarBody
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="topbar-logo">
          <Logo />
        </div>
      </header>
    </>
  );
}
