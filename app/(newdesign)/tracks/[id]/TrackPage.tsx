"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { useTrack, useTrackConfigs } from "@/lib/queries/useTrack";
import { PanelError, PanelSkeleton, PanelEmpty } from "@/components/account/PanelStates";
import { type TrackImage, type TrackConfiguration } from "@/types";
import { trackImageUrl } from "@/lib/trackImage";

function TrackPhoto({ image, alt }: { image?: TrackImage | null; alt: string }) {
  const src = trackImageUrl(image, "full");
  return (
    <div className="track-gallery-item">
      <div className="track-gallery-frame">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="track-gallery-img" />
        ) : (
          <span className="track-gallery-empty">not set</span>
        )}
      </div>
      <span className="track-gallery-label">Photo</span>
    </div>
  );
}

function ConfigCard({ config }: { config: TrackConfiguration }) {
  const mapSrc = trackImageUrl(config.image_url, "full");
  return (
    <div className="config-card">
      <div className="config-map-frame">
        {mapSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mapSrc}
            alt={`${config.name} layout map`}
            className="config-map-img"
          />
        ) : (
          <span className="track-gallery-empty">not set</span>
        )}
      </div>
      <div className="config-name">{config.name}</div>
      <div className="config-tags">
        {config.direction && <Badge label={config.direction} variant="muted" />}
      </div>
      {config.length_km && (
        <div className="config-detail">Length: {config.length_km}</div>
      )}
    </div>
  );
}

export default function TrackPage() {
  const params = useParams<{ id: string }>();
  const { data: track, isLoading, error } = useTrack(params.id);
  const {
    data: configs,
    isLoading: configsLoading,
    error: configsError,
  } = useTrackConfigs(params.id);

  return (
    <>
      <style>{`
        .track-page {
          max-width: 680px;
          padding: 48px 32px;
          font-family: 'Chakra Petch', sans-serif;
        }
        .track-page-back {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          margin-bottom: 16px;
          display: inline-block;
        }
        .track-page-back:hover { color: hsl(var(--foreground)); }
        .track-page-name {
          font-size: 1.4rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 6px;
        }
        .track-page-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
        }
        .track-gallery-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .track-gallery-frame {
          width: 200px;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius);
          border: 1px dashed hsl(var(--border));
          background: hsl(var(--muted));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .track-gallery-img { width: 100%; height: 100%; object-fit: contain; }
        .track-gallery-empty {
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .track-gallery-label {
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .track-page-detail {
          margin-top: 12px;
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }
        .track-page-section {
          margin-top: 32px;
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 14px;
        }
        .config-list {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .config-card {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
        }
        .config-map-frame {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: calc(var(--radius) - 2px);
          border: 1px dashed hsl(var(--border));
          background: hsl(var(--muted));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .config-map-img { width: 100%; height: 100%; object-fit: contain; }
        .config-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .config-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .config-detail { font-size: 0.7rem; color: hsl(var(--muted-foreground)); }
        .track-page-raw {
          margin-top: 32px;
          padding: 16px;
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          font-size: 0.7rem;
          overflow-x: auto;
        }
        .track-page-raw summary {
          cursor: pointer;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        .track-page-raw pre { margin-top: 10px; }
        @media (max-width: 480px) {
          .track-page { padding: 32px 16px; }
        }
      `}</style>

      <div className="track-page">
        {isLoading ? (
          <div>Loading track…</div>
        ) : error || !track ? (
          <PanelError message="Could not load this track." />
        ) : (
          <>
            <Link
              href={`/accounts/${track.facility.slug}`}
              className="track-page-back"
            >
              ← Back to {track.facility.name}
            </Link>

            <h1 className="track-page-name">{track.name}</h1>
            <div className="track-page-tags">
              <Badge label={track.track_type} variant="muted" />
              {track.surface_type && (
                <Badge label={track.surface_type} variant="outline" />
              )}
            </div>

            <TrackPhoto image={track.image_url} alt={`${track.name} photo`} />

            {track.length_meters && (
              <div className="track-page-detail">Length: {track.length_meters}</div>
            )}

            <h2 className="track-page-section">Configurations</h2>
            {configsLoading ? (
              <PanelSkeleton rows={2} />
            ) : configsError ? (
              <PanelError message="Could not load configurations." />
            ) : !configs?.length ? (
              <PanelEmpty message="No configurations on record for this track." />
            ) : (
              <div className="config-list">
                {configs.map((config: TrackConfiguration) => (
                  <ConfigCard key={config.id} config={config} />
                ))}
              </div>
            )}

            <details className="track-page-raw">
              <summary>Raw API response — GET /tracks/{params.id}</summary>
              <pre>{JSON.stringify(track, null, 2)}</pre>
            </details>
            <details className="track-page-raw">
              <summary>Raw API response — GET /tracks/{params.id}/configs</summary>
              <pre>{JSON.stringify(configs, null, 2)}</pre>
            </details>
          </>
        )}
      </div>
    </>
  );
}
