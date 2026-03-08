"use client";

// components/tracks/TrackCard.tsx

import { Badge } from "@/components/ui/Badge";

export interface Track {
  id: number;
  sfid: string;
  name: string;
  common_name__c: string;
  abbreviated_name__c: string;
  slug__c: string;
  billingcity: string;
  billingstate: string;
  billingcountry: string;
  billingstreet: string;
  billinglatitude: number;
  billinglongitude: number;
  billingpostalcode: string | null;
  description: string;
  image_url__c: string;
  logo_url__c: string;
  logo_authorized__c: boolean;
  logo_background_color__c: string | null;
  rating_average__c: number | null;
  rating_total__c: string;
  recordtypename: string;
  website: string | null;
  phone: string | null;
  /** Injected client-side after query — km from user */
  distanceKm?: number;
}

interface TrackCardProps {
  track: Track;
  onClick?: (track: Track) => void;
}

/** Fallback when no logo is available — shows initials */
function TrackLogo({
  name,
  logoUrl,
  bgColor,
}: {
  name: string;
  logoUrl: string;
  bgColor: string | null;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (logoUrl) {
    return (
      <div
        className="tc-logo-wrap"
        style={{ background: bgColor ?? "hsl(var(--muted))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={`${name} logo`} className="tc-logo-img" />
      </div>
    );
  }

  return (
    <div className="tc-logo-wrap tc-logo-fallback">
      <span className="tc-logo-initials">{initials}</span>
    </div>
  );
}

export function TrackCard({ track, onClick }: TrackCardProps) {
  const displayName = track.common_name__c || track.name;
  const city = [track.billingcity, track.billingstate]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <style>{`
        .tc-root {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Chakra Petch', sans-serif;
          position: relative;
          overflow: hidden;
          text-align: left;
          width: 100%;
        }

        /* Brand left-edge accent on hover */
        .tc-root::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #ba1111;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.2s ease;
        }

        .tc-root:hover {
          border-color: hsl(var(--border-bright, var(--border)));
          background: hsl(var(--accent));
        }

        .tc-root:hover::before {
          transform: scaleY(1);
        }

        /* ── Logo ── */
        .tc-logo-wrap {
          width: 48px;
          height: 48px;
          border-radius: calc(var(--radius) - 2px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid hsl(var(--border));
        }

        .tc-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .tc-logo-fallback {
          background: hsl(var(--muted));
        }

        .tc-logo-initials {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.05em;
        }

        /* ── Body ── */
        .tc-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tc-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--card-foreground));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.01em;
        }

        .tc-location {
          font-size: 0.7rem;
          font-weight: 300;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.04em;
        }

        .tc-tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-top: 2px;
        }

        /* ── Right side ── */
        .tc-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }

        .tc-distance {
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--card-foreground));
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .tc-distance-unit {
          font-size: 0.6rem;
          font-weight: 400;
          color: hsl(var(--muted-foreground));
          margin-left: 2px;
        }

        .tc-chevron {
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          opacity: 0.4;
          transition: opacity 0.15s, transform 0.15s;
        }

        .tc-root:hover .tc-chevron {
          opacity: 1;
          transform: translateX(2px);
          color: #ba1111;
        }
      `}</style>

      <button className="tc-root" onClick={() => onClick?.(track)}>
        {/* Logo */}
        <TrackLogo
          name={displayName}
          logoUrl={track.logo_url__c}
          bgColor={track.logo_background_color__c}
        />

        {/* Body */}
        <div className="tc-body">
          <span className="tc-name">{displayName}</span>
          <span className="tc-location">{city}</span>
          <div className="tc-tags">
            {track.recordtypename && (
              <Badge label={track.recordtypename} variant="muted" />
            )}
          </div>
        </div>

        {/* Right — distance + chevron */}
        <div className="tc-right">
          {track.distanceKm !== undefined && (
            <span className="tc-distance">
              {track.distanceKm.toFixed(0)}
              <span className="tc-distance-unit">km</span>
            </span>
          )}
          <span className="tc-chevron">›</span>
        </div>
      </button>
    </>
  );
}
