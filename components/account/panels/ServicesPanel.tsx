"use client";

import { Badge } from "@/components/ui/Badge";
import { PanelSkeleton, PanelEmpty, PanelError } from "../PanelStates";
import { useAccountServices } from "@/lib/queries/useAccountPanels";
import { type AccountService } from "@/types";

export function ServicesPanel({ accountId }: { accountId: number }) {
  const { data, isLoading, error } = useAccountServices(accountId);

  if (isLoading) return <PanelSkeleton rows={2} />;
  if (error) return <PanelError message="Could not load services." />;
  if (!data?.length)
    return <PanelEmpty message="No services on record for this account." />;

  return (
    <ul className="acct-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((service: AccountService) => (
        <li key={service.id} className="acct-list-row">
          <div>
            <div className="acct-list-name">{service.name}</div>
            {service.description && (
              <div className="acct-list-sub">{service.description}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {service.premium__c && <Badge label="Premium" variant="brand" />}
            <Badge label={service.category} variant="muted" />
          </div>
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
