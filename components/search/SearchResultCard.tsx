"use client";

// components/search/SearchResultCard.tsx

import { Badge } from "@/components/ui/Badge";
import { logoBackgroundColor } from "@/lib/logoColor";
import { type Account } from "@/types";

interface SearchResultCardProps {
  account: Account;
  onClick?: (account: Account) => void;
}

function ResultLogo({
  name,
  logoUrl,
  bgColor,
}: {
  name: string;
  logoUrl: string | null;
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
        className="src-logo-wrap"
        style={{ background: logoBackgroundColor(bgColor) ?? "var(--muted)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={`${name} logo`} className="src-logo-img" />
      </div>
    );
  }

  return (
    <div className="src-logo-wrap src-logo-fallback">
      <span className="src-logo-initials">{initials}</span>
    </div>
  );
}

// Generic version of TrackCard — any Account recordtype, not just
// facilities, so no `tracks` sub-array or `distance_meters` assumption.
export function SearchResultCard({ account, onClick }: SearchResultCardProps) {
  const displayName = account.common_name__c || account.name;
  const location = [account.billingcity, account.billingstate]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <style>{`
        .src-root {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Chakra Petch', sans-serif;
          position: relative;
          overflow: hidden;
          text-align: left;
          width: 100%;
        }

        .src-root::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #ba1111;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.2s ease;
        }

        .src-root:hover {
          border-color: var(--border-bright, var(--border));
          background: var(--accent);
        }

        .src-root:hover::before {
          transform: scaleY(1);
        }

        .src-logo-wrap {
          width: 48px;
          height: 48px;
          border-radius: calc(var(--radius) - 2px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .src-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .src-logo-fallback {
          background: var(--muted);
        }

        .src-logo-initials {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted-foreground);
          letter-spacing: 0.05em;
        }

        .src-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .src-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--card-foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.01em;
        }

        .src-location {
          font-size: 0.7rem;
          font-weight: 300;
          color: var(--muted-foreground);
          letter-spacing: 0.04em;
        }

        .src-chevron {
          color: var(--muted-foreground);
          font-size: 0.75rem;
          opacity: 0.4;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }

        .src-root:hover .src-chevron {
          opacity: 1;
          transform: translateX(2px);
          color: #ba1111;
        }
      `}</style>

      <button className="src-root" onClick={() => onClick?.(account)}>
        <ResultLogo
          name={displayName}
          logoUrl={account.logo_url__c}
          bgColor={account.logo_background_color__c}
        />

        <div className="src-body">
          <span className="src-name">{displayName}</span>
          {location && <span className="src-location">{location}</span>}
          <div style={{ marginTop: 2 }}>
            <Badge label={account.recordtypename} variant="brand" />
          </div>
        </div>

        <span className="src-chevron">›</span>
      </button>
    </>
  );
}
