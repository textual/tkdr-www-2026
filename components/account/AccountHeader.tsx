"use client";

// components/account/AccountHeader.tsx

import { Badge } from "@/components/ui/Badge";
import { logoBackgroundColor } from "@/lib/logoColor";
import { type AccountSummary, type AccountOfferingKey } from "@/types";

const OFFERING_LABEL: Record<AccountOfferingKey, string> = {
  tracks: "Tracks",
  events: "Events",
  services: "Services",
  products: "Products",
  sponsorships: "Sponsorships",
  sponsoring: "Sponsoring",
};

function AccountLogo({
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
        className="ah-logo-wrap"
        style={{ background: logoBackgroundColor(bgColor) ?? "hsl(var(--muted))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={`${name} logo`} className="ah-logo-img" />
      </div>
    );
  }

  return (
    <div className="ah-logo-wrap ah-logo-fallback">
      <span className="ah-logo-initials">{initials}</span>
    </div>
  );
}

export function AccountHeader({ account }: { account: AccountSummary }) {
  const displayName = account.common_name__c || account.name;
  const location = [account.billingcity, account.billingstate]
    .filter(Boolean)
    .join(", ");

  // Every other offering the account has, shown as secondary badges —
  // this is what surfaces "organizer that also offers services."
  const secondaryOfferings = (
    Object.keys(account.offerings || {}) as AccountOfferingKey[]
  ).filter((key) => account.offerings[key]?.present);

  return (
    <>
      <style>{`
        .ah-root {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 24px;
          margin-bottom: 8px;
          border-bottom: 1px solid hsl(var(--border));
          font-family: 'Chakra Petch', sans-serif;
        }
        .ah-logo-wrap {
          width: 64px;
          height: 64px;
          border-radius: calc(var(--radius) - 2px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid hsl(var(--border));
        }
        .ah-logo-img { width: 100%; height: 100%; object-fit: contain; }
        .ah-logo-fallback { background: hsl(var(--muted)); }
        .ah-logo-initials {
          font-size: 1.1rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.05em;
        }
        .ah-body { flex: 1; min-width: 0; }
        .ah-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
        .ah-name {
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: hsl(var(--foreground));
          margin-bottom: 6px;
        }
        .ah-meta {
          font-size: 0.75rem;
          font-weight: 300;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.02em;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ah-meta a { color: inherit; }
      `}</style>

      <div className="ah-root">
        <AccountLogo
          name={displayName}
          logoUrl={account.logo_url__c}
          bgColor={account.logo_background_color__c}
        />
        <div className="ah-body">
          <div className="ah-badges">
            <Badge label={account.recordtypename} variant="brand" />
            {secondaryOfferings.map((key) => (
              <Badge
                key={key}
                label={OFFERING_LABEL[key]}
                variant="muted"
              />
            ))}
          </div>
          <div className="ah-name">{displayName}</div>
          <div className="ah-meta">
            {location && <span>{location}</span>}
            {account.phone && <span>{account.phone}</span>}
            {account.website && (
              <a href={account.website} target="_blank" rel="noreferrer">
                {account.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
