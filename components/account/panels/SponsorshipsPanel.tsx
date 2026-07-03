"use client";

import { Badge } from "@/components/ui/Badge";
import { PanelSkeleton, PanelEmpty, PanelError } from "../PanelStates";
import { useAccountSponsorships } from "@/lib/queries/useAccountPanels";
import { type AccountSponsorship } from "@/types";

export function SponsorshipsPanel({ accountId }: { accountId: number }) {
  const { data, isLoading, error } = useAccountSponsorships(accountId);

  if (isLoading) return <PanelSkeleton rows={2} />;
  if (error) return <PanelError message="Could not load sponsorships." />;
  if (!data?.length)
    return <PanelEmpty message="No sponsorships on record for this account." />;

  return (
    <ul className="acct-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((sponsorship: AccountSponsorship) => (
        <li key={sponsorship.id} className="acct-list-row">
          <div>
            <div className="acct-list-name">{sponsorship.event_name}</div>
            {sponsorship.season && (
              <div className="acct-list-sub">{sponsorship.season}</div>
            )}
          </div>
          <Badge label={sponsorship.tier} variant="brand" />
        </li>
      ))}
      <style>{`
        .acct-list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid hsl(var(--border));
          font-size: 0.8rem;
        }
        .acct-list-row:last-child { border-bottom: none; }
        .acct-list-name { font-weight: 500; color: hsl(var(--foreground)); }
        .acct-list-sub { font-size: 0.7rem; color: hsl(var(--muted-foreground)); margin-top: 2px; }
      `}</style>
    </ul>
  );
}
