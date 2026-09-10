"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
// import { useLocation } from "@/lib/contexts/LocationContext";

import { LocationPanel } from "@/components/settings/LocationPanel";

type DistanceUnit = "km" | "mi";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, index }: { label: string; index: string }) {
  return (
    <div className="s-section-header">
      <span className="s-section-index">{index}</span>
      <div className="s-section-rule" />
      <span className="s-section-label">{label}</span>
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="s-card">
      <div className="s-corner s-corner--tl" />
      <div className="s-corner s-corner--tr" />
      {children}
    </div>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="s-row">
      <div className="s-row-text">
        <span className="s-row-label">{label}</span>
        {description && <span className="s-row-desc">{description}</span>}
      </div>
      <div className="s-row-control">{children}</div>
    </div>
  );
}

// ─── Theme Selector ───────────────────────────────────────────────────────────

function ThemeSelector() {
  const { theme: curTheme, setTheme } = useTheme();
  const theme = curTheme || "system";

  const options = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "system", label: "Auto" },
  ];

  return (
    <div className="s-theme-selector">
      {options.map((opt) => (
        <button
          key={opt.value}
          // className={`s-theme-btn${theme === opt.value ? " active" : ""}`}
          className="s-theme-btn"
          onClick={() => setTheme(opt.value)}
        >
          {opt.label}
          {/* {theme === opt.value && <span className="s-theme-bar" />} */}
        </button>
      ))}
    </div>
  );
}

// ─── Distance Unit Toggle ─────────────────────────────────────────────────────

function UnitToggle({
  value,
  onChange,
}: {
  value: DistanceUnit;
  onChange: (u: DistanceUnit) => void;
}) {
  return (
    <button
      className="s-unit-toggle"
      onClick={() => onChange(value === "km" ? "mi" : "km")}
      aria-label="Toggle distance unit"
    >
      <span className={`s-unit-opt${value === "km" ? " active" : ""}`}>KM</span>
      <div className="s-unit-track">
        <div className={`s-unit-thumb ${value}`} />
      </div>
      <span className={`s-unit-opt${value === "mi" ? " active" : ""}`}>MI</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [unit, setUnit] = useState<DistanceUnit>("km");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        /* ── Brand constant — never changes with theme ── */
        .settings-page {
          --brand:       #ba1111;
          --brand-dim:   rgba(186,17,17,0.15);
          --brand-glow:  rgba(186,17,17,0.2);
          --brand-hover: #d41414;
        }

        /* ── Page shell ── */
        .settings-page {
          max-width: 660px;
          padding: 52px 32px;
          font-family: 'Chakra Petch', sans-serif;
          color: hsl(var(--foreground));
        }

        .s-eyebrow {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .s-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: var(--brand);
        }

        .s-heading {
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: hsl(var(--foreground));
          margin-bottom: 52px;
          line-height: 1;
        }

        /* ── Section ── */
        .s-section {
          margin-bottom: 36px;
          animation: s-fadeUp 0.3s ease both;
        }
        .s-section:nth-child(2) { animation-delay: 0.05s; }
        .s-section:nth-child(3) { animation-delay: 0.10s; }
        .s-section:nth-child(4) { animation-delay: 0.15s; }

        @keyframes s-fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .s-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .s-section-index {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--brand);
        }

        .s-section-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            to right,
            hsl(var(--border)),
            transparent
          );
        }

        .s-section-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
        }

        /* ── Card ── */
        .s-card {
          position: relative;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          overflow: hidden;
        }

        .s-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          z-index: 2;
        }

        .s-corner--tl {
          top: -1px; left: -1px;
          border-top: 2px solid var(--brand);
          border-left: 2px solid var(--brand);
          border-radius: var(--radius) 0 0 0;
        }

        .s-corner--tr {
          top: -1px; right: -1px;
          border-top: 2px solid var(--brand);
          border-right: 2px solid var(--brand);
          border-radius: 0 var(--radius) 0 0;
        }

        /* ── Row ── */
        .s-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 18px 20px;
        }

        .s-row + .s-row {
          border-top: 1px solid hsl(var(--border));
        }

        .s-row-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .s-row-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--card-foreground));
          letter-spacing: 0.02em;
        }

        .s-row-desc {
          font-size: 0.7rem;
          font-weight: 300;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .s-row-control { flex-shrink: 0; }

        /* ── Theme selector ── */
        .s-theme-selector {
          display: flex;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          padding: 3px;
          gap: 2px;
        }

        .s-theme-btn {
          position: relative;
          padding: 6px 14px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: none;
          border: none;
          border-radius: calc(var(--radius) - 4px);
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          overflow: hidden;
        }

        .s-theme-btn.active {
          color: hsl(var(--card-foreground));
          background: hsl(var(--card));
        }

        .s-theme-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--brand);
          animation: s-barIn 0.2s ease;
        }

        @keyframes s-barIn {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── Unit toggle ── */
        .s-unit-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
        }

        .s-unit-opt {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: hsl(var(--muted-foreground) / 0.5);
          transition: color 0.15s;
          min-width: 20px;
          text-align: center;
        }

        .s-unit-opt.active { color: var(--brand); }

        .s-unit-track {
          position: relative;
          width: 36px;
          height: 18px;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 99px;
        }

        .s-unit-thumb {
          position: absolute;
          top: 2px;
          width: 12px;
          height: 12px;
          background: var(--brand);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--brand-glow);
          transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .s-unit-thumb.km { left: 2px; }
        .s-unit-thumb.mi { left: 20px; }

        /* ── Location panel ── */
        .s-location-panel { display: flex; flex-direction: column; }

        .s-location-current {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
        }

        .s-signal {
          position: relative;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .s-signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand);
          position: relative;
          z-index: 1;
        }

        .s-signal-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid var(--brand);
          opacity: 0;
          animation: s-ping 2s ease-out infinite;
        }

        @keyframes s-ping {
          0%   { transform: scale(0.5); opacity: 0.7; }
          100% { transform: scale(2);   opacity: 0; }
        }

        .s-location-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .s-location-city {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--card-foreground));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .s-location-meta {
          font-size: 0.65rem;
          font-weight: 300;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .s-source-tag {
          display: inline-block;
          padding: 1px 5px;
          background: var(--brand-dim);
          color: var(--brand);
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          border-radius: 2px;
          border: 1px solid var(--brand-dim);
        }

        .s-edit-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          background: none;
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .s-edit-btn:hover,
        .s-edit-btn.cancel {
          border-color: var(--brand);
          color: var(--brand);
        }

        /* ── Edit form ── */
        .s-location-edit {
          padding: 16px 20px 18px;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--muted));
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .s-input-row {
          display: flex;
          gap: 8px;
        }

        .s-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .s-input-icon {
          position: absolute;
          left: 10px;
          color: var(--brand);
          font-size: 0.85rem;
          pointer-events: none;
          line-height: 1;
        }

        .s-input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--input));
          border-radius: calc(var(--radius) - 2px);
          padding: 9px 12px 9px 28px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .s-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px var(--brand-glow);
        }

        .s-input::placeholder { color: hsl(var(--muted-foreground)); }

        .s-save-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 9px 20px;
          background: var(--brand);
          color: #fff;
          border: none;
          border-radius: calc(var(--radius) - 2px);
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          white-space: nowrap;
        }

        .s-save-btn:hover:not(:disabled) { background: var(--brand-hover); }
        .s-save-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        .s-hint {
          font-size: 0.65rem;
          font-weight: 300;
          font-style: italic;
          color: hsl(var(--muted-foreground));
          line-height: 1.5;
        }

        .s-saved {
          padding: 10px 20px;
          border-top: 1px solid hsl(var(--border));
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--brand);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .s-saved-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--brand);
          box-shadow: 0 0 6px var(--brand);
        }

        @media (max-width: 480px) {
          .settings-page { padding: 32px 16px; }
          .s-input-row { flex-direction: column; }
        }
      `}</style>

      <div className="settings-page">
        <p className="s-eyebrow">Configuration</p>
        <h1 className="s-heading">Settings</h1>

        {/* ── 01 · Appearance ── */}
        <div className="s-section">
          <SectionHeader index="01" label="Appearance" />
          <SettingsCard>
            <Row
              label="Theme"
              description="Colour scheme applied across the app"
            >
              <ThemeSelector />
            </Row>
            <Row
              label="Distance units"
              description="Used on listings and search radius"
            >
              <UnitToggle value={unit} onChange={setUnit} />
            </Row>
          </SettingsCard>
        </div>

        {/* ── 02 · Location ── */}
        <div className="s-section">
          <SectionHeader index="02" label="Location" />
          <SettingsCard>
            <LocationPanel />
          </SettingsCard>
        </div>
      </div>
    </>
  );
}
