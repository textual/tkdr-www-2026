"use client";

import { useState } from "react";
// import { useLocation } from "@/contexts/LocationContext";
import { useLocation } from "@/lib/contexts/LocationContext";
import { ModeToggle } from "../../../components/layout/ModeToggle";
import { useTheme } from "next-themes";

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = "dark" | "light" | "system";
type DistanceUnit = "km" | "mi";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, index }: { label: string; index: string }) {
  return (
    <div className="section-header">
      <span className="section-index">{index}</span>
      <div className="section-rule" />
      <span className="section-label">{label}</span>
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="settings-card">
      <div className="card-corner card-corner--tl" />
      <div className="card-corner card-corner--tr" />
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
    <div className="settings-row">
      <div className="row-text">
        <span className="row-label">{label}</span>
        {description && <span className="row-desc">{description}</span>}
      </div>
      <div className="row-control">{children}</div>
    </div>
  );
}

// ─── Theme Selector ───────────────────────────────────────────────────────────

function ThemeSelector({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (t: Theme) => void;
}) {
  const options: { value: Theme; label: string; icon: string }[] = [
    { value: "dark", label: "Dark", icon: "◐" },
    { value: "light", label: "Light", icon: "○" },
    { value: "system", label: "System", icon: "◈" },
  ];

  return (
    <div className="theme-selector">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`theme-btn${value === opt.value ? " active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {/* <span className="theme-icon">{opt.icon}</span>
          <span className="theme-label">{opt.label}</span> */}
          {opt.label}
          {value === opt.value && <span className="theme-active-bar" />}
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
    <div>
      <button
        className="unit-toggle"
        onClick={() => onChange(value === "km" ? "mi" : "km")}
        aria-label="Toggle distance unit"
      >
        <span className={`unit-opt${value === "km" ? " active" : ""}`}>KM</span>
        <div className="unit-track">
          <div className={`unit-thumb ${value}`} />
        </div>
        <span className={`unit-opt${value === "mi" ? " active" : ""}`}>MI</span>
      </button>

      <div className="unit-toggle">
        <button
          className={`unit-btn${value === "km" ? " active" : ""}`}
          onClick={() => onChange("km")}
        >
          KM
        </button>
        <div className="unit-track">
          <div className={`unit-thumb ${value}`} />
        </div>
        <button
          className={`unit-btn${value === "mi" ? " active" : ""}`}
          onClick={() => onChange("mi")}
        >
          MI
        </button>
      </div>
    </div>
  );
}

// ─── Location Panel ───────────────────────────────────────────────────────────

function LocationPanel() {
  const { location, setLocation } = useLocation();
  const [editing, setEditing] = useState(false);
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // For now just closes — wire up to a geocoding API later
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="location-panel">
      <div className="location-current">
        <div className="location-signal">
          <div className="signal-dot" />
          <div className="signal-ring" />
        </div>
        <div className="location-text">
          <span className="location-city">
            {location?.city ?? "—"}
            {location?.region ? `, ${location.region}` : ""}
          </span>
          <span className="location-coords">
            {location
              ? `${parseFloat(location.latitude).toFixed(4)}° · ${parseFloat(location.longitude).toFixed(4)}° · ${location.country_code}`
              : "Location unavailable"}
            <span className="location-source-tag">IP</span>
          </span>
        </div>
        <button
          className={`location-edit-btn${editing ? " cancel" : ""}`}
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? "✕ Cancel" : "Override"}
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="location-edit">
          <div className="input-row">
            <div className="input-wrapper">
              <span className="input-prefix">⌖</span>
              <input
                className="location-input"
                type="text"
                placeholder="City, region or postcode…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && query.trim() && handleSave()
                }
                autoFocus
              />
            </div>
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={!query.trim()}
            >
              Set
            </button>
          </div>
          <p className="location-hint">
            Overrides IP location for this session. Geocoding wired to your API.
          </p>
        </div>
      )}

      {saved && <div className="location-saved">✓ Location updated</div>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // const [theme, setTheme] = useState<Theme>("dark");
  const { theme, setTheme } = useTheme();
  const [unit, setUnit] = useState<DistanceUnit>("km");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        /* ── Design tokens ── */
        :root {
          --brand:        #ba1111;
          --brand-dim:    #7a0b0b;
          --brand-glow:   rgba(186, 17, 17, 0.25);
          --bg:           #0a0a0a;
          --surface:      #111111;
          --surface-2:    #161616;
          --border:       #1f1f1f;
          --border-bright:#2e2e2e;
          --text:         #d4d4d4;
          --text-muted:   #4a4a4a;
          --text-dim:     #333;
          --radius:       4px;
        }

        .settings-page {
          max-width: 660px;
          padding: 52px 32px;
          font-family: 'Chakra Petch', sans-serif;
          color: var(--text);
        }

        /* ── Page header ── */
        .settings-eyebrow {
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

        .settings-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: var(--brand);
        }

        .settings-heading {
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 52px;
          line-height: 1;
        }

        .settings-heading span {
          color: var(--brand);
        }

        /* ── Section ── */
        .settings-section {
          margin-bottom: 36px;
          animation: fadeUp 0.35s ease both;
        }

        .settings-section:nth-child(2) { animation-delay: 0.05s; }
        .settings-section:nth-child(3) { animation-delay: 0.1s; }
        .settings-section:nth-child(4) { animation-delay: 0.15s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .section-index {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--brand);
        }

        .section-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--border-bright), transparent);
        }

        .section-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ── Card ── */
        .settings-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        /* Bracket corners */
        .card-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          z-index: 2;
        }

        .card-corner--tl {
          top: -1px; left: -1px;
          border-top: 2px solid var(--brand);
          border-left: 2px solid var(--brand);
          border-radius: var(--radius) 0 0 0;
        }

        .card-corner--tr {
          top: -1px; right: -1px;
          border-top: 2px solid var(--brand);
          border-right: 2px solid var(--brand);
          border-radius: 0 var(--radius) 0 0;
        }

        /* ── Row ── */
        .settings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 18px 20px;
        }

        .settings-row + .settings-row {
          border-top: 1px solid var(--border);
        }

        .row-text { display: flex; flex-direction: column; gap: 4px; }

        .row-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          letter-spacing: 0.02em;
        }

        .row-desc {
          font-size: 0.7rem;
          font-weight: 300;
          color: var(--text-muted);
          font-style: italic;
          letter-spacing: 0.01em;
        }

        .row-control { flex-shrink: 0; }

        /* ── Theme selector ── */
        .theme-selector {
          display: flex;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 3px;
          gap: 2px;
        }

        .theme-btn {
          position: relative;
          padding: 6px 14px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: none;
          border: none;
          border-radius: 2px;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.15s ease;
          overflow: hidden;
        }

        .theme-btn.active {
          color: var(--text);
          background: var(--surface-2);
        }

        .theme-active-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--brand);
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── Unit toggle ── */
        .unit-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
        }

        .unit-opt {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          transition: color 0.15s;
          min-width: 20px;
          text-align: center;
        }

        .unit-opt.active { color: var(--brand); }

        .unit-track {
          position: relative;
          width: 36px;
          height: 18px;
          background: var(--bg);
          border: 1px solid var(--border-bright);
          border-radius: 99px;
        }

        .unit-thumb {
          position: absolute;
          top: 2px;
          width: 12px;
          height: 12px;
          background: var(--brand);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--brand-glow);
          transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .unit-thumb.km { left: 2px; }
        .unit-thumb.mi { left: 20px; }

        /* ── Location panel ── */
        .location-panel {
          display: flex;
          flex-direction: column;
        }

        .location-current {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
        }

        /* Animated signal dot */
        .location-signal {
          position: relative;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand);
          position: relative;
          z-index: 1;
        }

        .signal-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid var(--brand);
          opacity: 0;
          animation: ping 2s ease-out infinite;
        }

        @keyframes ping {
          0%   { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .location-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .location-city {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .location-coords {
          font-size: 0.65rem;
          font-weight: 300;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .location-source-tag {
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

        .location-edit-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          background: none;
          border: 1px solid var(--border-bright);
          border-radius: var(--radius);
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .location-edit-btn:hover {
          border-color: var(--brand);
          color: var(--brand);
        }

        .location-edit-btn.cancel {
          border-color: var(--brand-dim);
          color: var(--brand);
        }

        /* Edit form */
        .location-edit {
          padding: 16px 20px 18px;
          border-top: 1px solid var(--border);
          background: var(--surface-2);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 10px;
          color: var(--brand);
          font-size: 0.85rem;
          pointer-events: none;
          line-height: 1;
        }

        .location-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border-bright);
          border-radius: var(--radius);
          padding: 9px 12px 9px 28px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--text);
          outline: none;
          transition: border-color 0.15s;
          letter-spacing: 0.02em;
        }

        .location-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px var(--brand-glow);
        }

        .location-input::placeholder { color: var(--text-dim); }

        .save-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 9px 20px;
          background: var(--brand);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          white-space: nowrap;
        }

        .save-btn:hover:not(:disabled) { background: #d41414; }

        .save-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .location-hint {
          font-size: 0.65rem;
          font-weight: 300;
          font-style: italic;
          color: var(--text-muted);
          line-height: 1.5;
          letter-spacing: 0.01em;
        }

        .location-saved {
          padding: 10px 20px;
          border-top: 1px solid var(--border);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--brand);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .saved-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--brand);
          box-shadow: 0 0 6px var(--brand);
        }

        @media (max-width: 480px) {
          .settings-page { padding: 32px 16px; }
          .theme-selector { gap: 0; }
          .theme-btn { padding: 6px 10px; }
          .input-row { flex-direction: column; }
        }
      `}</style>

      <div className="settings-page">
        <p className="settings-title">Configuration</p>
        <h1 className="settings-heading">Settings</h1>

        {/* ── 01 · Appearance ── */}
        <div className="settings-section">
          <SectionHeader index="01" label="Appearance" />
          <SettingsCard>
            <Row
              label="Theme"
              description="Controls the colour scheme across the app"
            >
              <ThemeSelector value={theme} onChange={setTheme} />
            </Row>
            <Row
              label="Theme"
              description="Controls the colour scheme across the app"
            >
              <ModeToggle />
            </Row>
            <Row
              label="Distance units"
              description="Used on event listings and search radius"
            >
              <UnitToggle value={unit} onChange={setUnit} />
            </Row>
          </SettingsCard>
        </div>

        {/* ── 02 · Location ── */}
        <div className="settings-section">
          <SectionHeader index="02" label="Location" />
          <SettingsCard>
            <LocationPanel />
          </SettingsCard>
        </div>
      </div>
    </>
  );
}
