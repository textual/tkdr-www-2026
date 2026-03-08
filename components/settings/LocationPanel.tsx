"use client";

// components/settings/LocationPanel.tsx

import { useState } from "react";
import { useLocation } from "@/lib/contexts/LocationContext";
import { useGeocoding } from "@/lib/hooks/useGeocoding";
import { useGPS } from "@/lib/hooks/useGPS";
import type { AppLocation } from "@/types";

// ─── Source badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: "ip" | "gps" | "manual" }) {
  const labels = { ip: "IP", gps: "GPS", manual: "Manual" };
  return (
    <span className="lp-source-badge lp-source-badge--{source}">
      {labels[source]}
    </span>
  );
}

// ─── Current location display ─────────────────────────────────────────────────

function CurrentLocation({
  location,
  source,
  onReset,
}: {
  location: AppLocation;
  source: "ip" | "gps" | "manual";
  onReset: () => void;
}) {
  return (
    <div className="lp-current">
      <div className="lp-signal">
        <div className="lp-signal-dot" />
        <div className="lp-signal-ring" />
      </div>
      <div className="lp-current-text">
        <span className="lp-city">
          {location.city}
          {location.region ? `, ${location.region}` : ""}
        </span>
        <span className="lp-coords">
          {parseFloat(location.latitude).toFixed(4)}° ·{" "}
          {parseFloat(location.longitude).toFixed(4)}°
          <SourceBadge source={source} />
        </span>
      </div>
      {source !== "ip" && (
        <button
          className="lp-reset-btn"
          onClick={onReset}
          title="Revert to IP location"
        >
          Reset
        </button>
      )}
    </div>
  );
}

// ─── Geocoding result preview ─────────────────────────────────────────────────

function ResultPreview({
  location,
  onConfirm,
}: {
  location: AppLocation;
  onConfirm: (loc: AppLocation) => void;
}) {
  console.log("ResultPreview location:", location);
  return (
    <div className="lp-preview">
      <div className="lp-preview-text">
        <span className="lp-preview-city">
          {location.city}
          {location.region ? `, ${location.region}` : ""}
          {location.country_code ? ` · ${location.country_code}` : ""}
        </span>
        <span className="lp-preview-coords">
          {location.latitude.toFixed(4)}° · {location.longitude.toFixed(4)}°
        </span>
      </div>
      <button className="lp-confirm-btn" onClick={() => onConfirm(location)}>
        Use this location
      </button>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function LocationPanel() {
  const { location, source, setLocation, resetToIP } = useLocation();
  const { state: gpsState, requestGPS } = useGPS();

  const [query, setQuery] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const geocoding = useGeocoding(query);

  async function handleGPS() {
    const loc = await requestGPS();
    if (loc) {
      setLocation(loc, "gps");
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 2500);
    }
  }

  function handleConfirm(loc: AppLocation) {
    setLocation(loc, "manual");
    setQuery("");
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  }

  function handleReset() {
    resetToIP();
    setQuery("");
  }

  return (
    <>
      <style>{`
        /* ── Current location row ── */
        .lp-current {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
        }

        .lp-signal {
          position: relative;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lp-signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ba1111;
          position: relative;
          z-index: 1;
        }

        .lp-signal-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid #ba1111;
          opacity: 0;
          animation: lp-ping 2.2s ease-out infinite;
        }

        @keyframes lp-ping {
          0%   { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(2);   opacity: 0; }
        }

        .lp-current-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .lp-city {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--card-foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lp-coords {
          font-size: 0.65rem;
          font-weight: 300;
          color: var(--muted-foreground);
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lp-source-badge {
          display: inline-block;
          padding: 1px 5px;
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          border-radius: 2px;
          background: rgba(186,17,17,0.12);
          color: #ba1111;
          border: 1px solid rgba(186,17,17,0.25);
        }

        .lp-reset-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 10px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted-foreground);
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.15s, color 0.15s;
        }

        .lp-reset-btn:hover {
          border-color: var(--border-bright, var(--border));
          color: var(--foreground);
        }

        /* ── Divider ── */
        .lp-divider {
          height: 1px;
          background: var(--border);
          margin: 0;
        }

        /* ── Input section ── */
        .lp-input-section {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--muted);
        }

        .lp-input-label {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        .lp-input-row {
          display: flex;
          gap: 8px;
        }

        .lp-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .lp-input-icon {
          position: absolute;
          left: 10px;
          color: #ba1111;
          font-size: 0.85rem;
          pointer-events: none;
          line-height: 1;
        }

        .lp-input {
          width: 100%;
          background: var(--background);
          border: 1px solid var(--input);
          border-radius: 4px;
          padding: 9px 12px 9px 28px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .lp-input:focus {
          border-color: #ba1111;
          box-shadow: 0 0 0 2px rgba(186,17,17,0.15);
        }

        .lp-input::placeholder {
          color: var(--muted-foreground);
          opacity: 0.5;
        }

        /* ── GPS button ── */
        .lp-gps-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted-foreground);
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .lp-gps-btn:hover:not(:disabled) {
          border-color: #ba1111;
          color: #ba1111;
        }

        .lp-gps-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ── Feedback states ── */
        .lp-feedback {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          padding: 2px 0;
        }

        .lp-feedback--loading { color: var(--muted-foreground); }
        .lp-feedback--error   { color: #ba1111; }
        .lp-feedback--empty   { color: var(--muted-foreground); font-style: italic; }
        .lp-feedback--success { color: #ba1111; }

        /* ── Result preview ── */
        .lp-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: var(--background);
          border: 1px solid rgba(186,17,17,0.3);
          border-radius: 4px;
          animation: lp-fade-in 0.2s ease;
        }

        @keyframes lp-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-preview-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .lp-preview-city {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lp-preview-coords {
          font-size: 0.65rem;
          font-weight: 300;
          color: var(--muted-foreground);
          letter-spacing: 0.04em;
        }

        .lp-confirm-btn {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 14px;
          background: #ba1111;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .lp-confirm-btn:hover { background: #d41414; }

        /* ── Confirmed toast ── */
        .lp-confirmed {
          padding: 10px 20px;
          border-top: 1px solid var(--border);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #ba1111;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: lp-fade-in 0.2s ease;
        }

        .lp-confirmed-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ba1111;
          box-shadow: 0 0 5px rgba(186,17,17,0.5);
        }
      `}</style>

      {/* Current location */}
      {location && (
        <CurrentLocation
          location={location}
          source={source}
          onReset={handleReset}
        />
      )}

      <div className="lp-divider" />

      {/* Input section */}
      <div className="lp-input-section">
        <span className="lp-input-label">Change location</span>

        {/* City / zip input + GPS button */}
        <div className="lp-input-row">
          <div className="lp-input-wrap">
            <span className="lp-input-icon">⌖</span>
            <input
              className="lp-input"
              type="text"
              placeholder="City name or postcode…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            className="lp-gps-btn"
            onClick={handleGPS}
            disabled={gpsState.status === "loading"}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            {gpsState.status === "loading" ? "Locating…" : "GPS"}
          </button>
        </div>

        {/* Geocoding feedback */}
        {query.trim() && (
          <>
            {geocoding.status === "loading" && (
              <p className="lp-feedback lp-feedback--loading">Searching…</p>
            )}
            {geocoding.status === "empty" && (
              <p className="lp-feedback lp-feedback--empty">
                No results found for "{query}"
              </p>
            )}
            {geocoding.status === "error" && (
              <p className="lp-feedback lp-feedback--error">
                {geocoding.message}
              </p>
            )}
            {geocoding.status === "success" && (
              <ResultPreview
                location={geocoding.result.location}
                onConfirm={handleConfirm}
              />
            )}
          </>
        )}

        {/* GPS error */}
        {gpsState.status === "error" && (
          <p className="lp-feedback lp-feedback--error">{gpsState.message}</p>
        )}
      </div>

      {/* Confirmed toast */}
      {confirmed && (
        <div className="lp-confirmed">
          <span className="lp-confirmed-dot" />
          Location updated
        </div>
      )}
    </>
  );
}
