"use client";

// components/filters/FilterPrimitives.tsx
// Shared building blocks used by both TrackFilterSheet and EventFilterSheet

import { Slider } from "@/components/ui/slider";
import { RADIUS_MIN, RADIUS_MAX, RADIUS_STEP } from "@/types/filters";

// ─── Section label ────────────────────────────────────────────────────────────

export function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fs-section">
      <p className="fs-section-label">{label}</p>
      {children}
    </div>
  );
}

// ─── Toggle button group ──────────────────────────────────────────────────────
// Generic — works for any string union

export function ToggleGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="fs-toggle-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`fs-toggle${selected.includes(opt) ? " fs-toggle--active" : ""}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Radius slider ────────────────────────────────────────────────────────────

export function RadiusSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="fs-radius">
      <div className="fs-radius-header">
        <span className="fs-radius-value">{value} km</span>
        <span className="fs-radius-range">
          {RADIUS_MIN} – {RADIUS_MAX} km
        </span>
      </div>
      <Slider
        min={RADIUS_MIN}
        max={RADIUS_MAX}
        step={RADIUS_STEP}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="fs-slider"
      />
    </div>
  );
}

// ─── Filter trigger button ────────────────────────────────────────────────────
// Shows active filter count badge when filters are applied

export function FilterTrigger({
  onClick,
  activeCount,
}: {
  onClick: () => void;
  activeCount: number;
}) {
  return (
    <button className="fs-trigger" onClick={onClick} type="button">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
      <span>Filter</span>
      {activeCount > 0 && (
        <span className="fs-trigger-badge">{activeCount}</span>
      )}
    </button>
  );
}

// ─── Sheet footer — reset + apply ─────────────────────────────────────────────

export function FilterFooter({
  onReset,
  onApply,
}: {
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <div className="fs-footer">
      <button type="button" className="fs-reset-btn" onClick={onReset}>
        Reset
      </button>
      <button type="button" className="fs-apply-btn" onClick={onApply}>
        Apply filters
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

export function FilterStyles() {
  return (
    <style>{`
      /* ── Section ── */
      .fs-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px 20px 0;
      }

      .fs-section-label {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.6rem;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--muted-foreground);
      }

      /* ── Toggle group ── */
      .fs-toggle-group {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .fs-toggle {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.06em;
        padding: 6px 12px;
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--muted-foreground);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
        white-space: nowrap;
      }

      .fs-toggle:hover {
        border-color: var(--border-bright, var(--border));
        color: var(--foreground);
      }

      .fs-toggle--active {
        background: rgba(186,17,17,0.1);
        border-color: #ba1111;
        color: #ba1111;
      }

      /* ── Radius slider ── */
      .fs-radius {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .fs-radius-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }

      .fs-radius-value {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--foreground);
        letter-spacing: 0.03em;
      }

      .fs-radius-range {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.65rem;
        color: var(--muted-foreground);
        letter-spacing: 0.04em;
      }

      /* Override shadcn slider accent to match brand */
      .fs-slider [data-orientation="horizontal"] {
        height: 4px;
      }

      .fs-slider [role="slider"] {
        border-color: #ba1111;
        background: #ba1111;
        box-shadow: 0 0 0 3px rgba(186,17,17,0.15);
      }

      .fs-slider [data-orientation="horizontal"] > span:first-child > span {
        background: #ba1111;
      }

      /* ── Filter trigger ── */
      .fs-trigger {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 7px 14px;
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--muted-foreground);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
        position: relative;
      }

      .fs-trigger:hover {
        border-color: #ba1111;
        color: var(--foreground);
      }

      .fs-trigger-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ba1111;
        color: #fff;
        font-size: 0.6rem;
        font-weight: 700;
        line-height: 1;
      }

      /* ── Footer ── */
      .fs-footer {
        display: flex;
        gap: 8px;
        padding: 20px;
        border-top: 1px solid var(--border);
        margin-top: auto;
      }

      .fs-reset-btn {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 16px;
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--muted-foreground);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
      }

      .fs-reset-btn:hover {
        border-color: var(--foreground);
        color: var(--foreground);
      }

      .fs-apply-btn {
        flex: 1;
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 16px;
        background: #ba1111;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .fs-apply-btn:hover {
        background: #d41414;
      }
    `}</style>
  );
}
