"use client";

// app/tracks/page.tsx

// import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackCard, type Track } from "@/components/tracks/TrackCard";
import { useLocation } from "@/lib/contexts/LocationContext";
import { useAppInfoContext } from "@/lib/contexts/AppInfoContext";
import { useTracksNearby } from "@/lib/queries/useTracks";
// import type { Track } from "@/types";

// ─── Query ────────────────────────────────────────────────────────────────────

// async function fetchTracks(lat: number, lng: number, radiusKm: number) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tracks?lat=${lat}&lng=${lng}&radius=${radiusKm}`,
//   );
//   if (!res.ok) throw new Error(`tracks responded with ${res.status}`);
//   return res.json() as Promise<Track[]>;
// }

// function useTracks(radiusKm = 250) {
//   const { location } = useLocation();
//   return useQuery({
//     queryKey: ["tracks", location?.lat, location?.lng, radiusKm],
//     queryFn: () => fetchTracks(location!.lat, location!.lng, radiusKm),
//     enabled: !!location,
//     staleTime: 10 * 60 * 1000, // tracks are stable — 10 min cache
//     retry: 2,
//   });
// }

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ radiusKm }: { radiusKm: number }) {
  return (
    <div className="tracks-empty">
      <span className="tracks-empty-icon">◎</span>
      <p className="tracks-empty-title">No tracks found</p>
      <p className="tracks-empty-desc">
        Nothing within {radiusKm} km of your location.
        <br />
        Try increasing your search radius.
      </p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TrackSkeleton() {
  return (
    <div className="track-skeleton">
      <div className="skel skel-logo" />
      <div className="skel-body">
        <div className="skel skel-title" />
        <div className="skel skel-sub" />
      </div>
      <div className="skel skel-dist" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TracksPage() {
  const { isLoading: appLoading, isRetrying } = useAppInfoContext();
  const { location } = useLocation();
  const { data, isLoading, isFetching, error } = useTracksNearby();
  const isBooting = appLoading || (!location && isLoading);

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  const { tracks, totalResults } = data || {};
  console.log("Tracks query state:", { data, isLoading, isFetching, error });
  // console.log("Tracks data state:", tracks, totalResults);
  // const tracks = [];
  return (
    <>
      <style>{`
        .tracks-page {
          max-width: 680px;
          padding: 48px 32px;
          font-family: 'Chakra Petch', sans-serif;
        }

        /* ── Page header ── */
        .tracks-eyebrow {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ba1111;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tracks-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #ba1111;
        }

        .tracks-heading {
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: hsl(var(--foreground));
          margin-bottom: 6px;
          line-height: 1;
        }

        .tracks-subheading {
          font-size: 0.75rem;
          font-weight: 300;
          color: hsl(var(--muted-foreground));
          margin-bottom: 36px;
          letter-spacing: 0.03em;
        }

        .tracks-subheading strong {
          color: hsl(var(--foreground));
          font-weight: 500;
        }

        /* Subtle "updating" indicator when re-fetching */
        .tracks-updating {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          margin-left: 10px;
          opacity: 0.7;
        }

        .tracks-updating-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ba1111;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }

        /* ── List ── */
        .tracks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Staggered entrance */
        .tracks-list > * {
          animation: trackIn 0.25s ease both;
        }

        .tracks-list > *:nth-child(1)  { animation-delay: 0.04s; }
        .tracks-list > *:nth-child(2)  { animation-delay: 0.08s; }
        .tracks-list > *:nth-child(3)  { animation-delay: 0.12s; }
        .tracks-list > *:nth-child(4)  { animation-delay: 0.16s; }
        .tracks-list > *:nth-child(5)  { animation-delay: 0.20s; }
        .tracks-list > *:nth-child(6)  { animation-delay: 0.24s; }
        .tracks-list > *:nth-child(7)  { animation-delay: 0.28s; }
        .tracks-list > *:nth-child(8)  { animation-delay: 0.32s; }

        @keyframes trackIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Skeleton ── */
        .track-skeleton {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
        }

        .skel {
          background: hsl(var(--muted));
          border-radius: 3px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }

        .skel-logo  { width: 48px; height: 48px; border-radius: calc(var(--radius) - 2px); flex-shrink: 0; }
        .skel-body  { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .skel-title { height: 14px; width: 55%; }
        .skel-sub   { height: 10px; width: 35%; }
        .skel-dist  { width: 36px; height: 14px; flex-shrink: 0; }

        /* ── Empty ── */
        .tracks-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 56px 24px;
          color: hsl(var(--muted-foreground));
          text-align: center;
        }

        .tracks-empty-icon {
          font-size: 2rem;
          opacity: 0.3;
        }

        .tracks-empty-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: hsl(var(--foreground));
          letter-spacing: 0.05em;
        }

        .tracks-empty-desc {
          font-size: 0.75rem;
          font-weight: 300;
          line-height: 1.6;
          font-style: italic;
        }

        /* ── Error ── */
        .tracks-error {
          padding: 20px;
          border: 1px solid rgba(186,17,17,0.3);
          border-radius: var(--radius);
          background: rgba(186,17,17,0.06);
          font-size: 0.8rem;
          color: #ba1111;
          letter-spacing: 0.03em;
        }

        @media (max-width: 480px) {
          .tracks-page { padding: 32px 16px; }
        }
      `}</style>

      <div className="tracks-page">
        <p className="tracks-eyebrow">Nearby</p>
        <h1 className="tracks-heading">
          Tracks
          {isFetching && !isLoading && (
            <span className="tracks-updating">
              <span className="tracks-updating-dot" />
              updating
            </span>
          )}
        </h1>
        <p className="tracks-subheading">
          {location ? (
            <>
              Within 250 km of{" "}
              <strong>
                {location.city}, {location.region}
              </strong>
            </>
          ) : (
            "Locating you…"
          )}
        </p>

        <SectionHeader
          index="01"
          label="Circuits &amp; Facilities"
          count={!isLoading ? tracks?.length : undefined}
        />

        {/* Loading — show skeletons */}
        {isBooting || isLoading ? (
          <div className="tracks-list">
            {isRetrying && (
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: 8,
                }}
              >
                ⏳ Server waking up…
              </p>
            )}
            {[...Array(4)].map((_, i) => (
              <TrackSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="tracks-error">
            Could not load tracks. Please try again.
          </div>
        ) : tracks && tracks.length > 0 ? (
          <ul
            className="tracks-list"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {tracks.map((track: Track) => (
              <li key={track.id}>
                <TrackCard
                  track={track}
                  onClick={(t) => {
                    // Navigate to track detail — wire to router.push(`/tracks/${t.slug__c}`)
                    console.log("selected track:", t.slug__c);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState radiusKm={250} />
        )}
      </div>
    </>
  );
}
