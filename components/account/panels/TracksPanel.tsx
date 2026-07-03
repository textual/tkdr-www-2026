"use client";

import { Badge } from "@/components/ui/Badge";
import { PanelSkeleton, PanelEmpty, PanelError } from "../PanelStates";
import { useAccountTracks } from "@/lib/queries/useAccountPanels";
import { type AccountTrack } from "@/types";

export function TracksPanel({ accountId }: { accountId: number }) {
  const { data, isLoading, error } = useAccountTracks(accountId);

  if (isLoading) return <PanelSkeleton rows={2} />;
  if (error) return <PanelError message="Could not load tracks." />;
  if (!data?.length)
    return <PanelEmpty message="No tracks on record for this account." />;

  return (
    <ul className="acct-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((track: AccountTrack) => (
        <li key={track.id} className="acct-list-row">
          <span className="acct-list-name">{track.name}</span>
          <Badge label={track.track_type} variant="muted" />
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
      `}</style>
    </ul>
  );
}
