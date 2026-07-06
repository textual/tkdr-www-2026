"use client";

import { Badge } from "@/components/ui/Badge";
import { PanelSkeleton, PanelEmpty, PanelError } from "../PanelStates";
import { useAccountEvents } from "@/lib/queries/useAccountPanels";
import { type AccountEvent } from "@/types";

function formatEventDate(startDate: string) {
  return new Date(startDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventsPanel({ accountId }: { accountId: number }) {
  const { data, isLoading, error } = useAccountEvents(accountId);

  if (isLoading) return <PanelSkeleton rows={2} />;
  if (error) return <PanelError message="Could not load events." />;
  if (!data?.length)
    return <PanelEmpty message="No upcoming events for this account." />;

  return (
    <ul className="acct-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((event: AccountEvent) => (
        <li key={event.id} className="acct-list-row">
          <div>
            <div className="acct-list-name">{event.event_format}</div>
            <div className="acct-list-sub">
              {formatEventDate(event.start_date)} · {event.track.name} ·{" "}
              {event.event_code}
            </div>
          </div>
          <Badge label={event.status} variant="outline" />
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
