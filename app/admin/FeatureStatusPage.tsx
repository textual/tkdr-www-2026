"use client";

import { useFeatureStatus } from "@/lib/queries/useFeatureStatus";
import type {
  Feature,
  FeatureMilestone,
  FeatureStatus,
  FeatureStatusData,
  MilestoneStatus,
} from "@/types";

const FEATURE_STATUS_COLOR: Record<FeatureStatus, string> = {
  active: "#16a34a",
  missing: "hsl(var(--muted-foreground))",
  error: "#dc2626",
};

const MILESTONE_STATUS_COLOR: Record<MilestoneStatus, string> = {
  complete: "#16a34a",
  partial: "#d97706",
  "not-started": "hsl(var(--muted-foreground))",
};

function FeatureRow({ feature }: { feature: Feature }) {
  return (
    <div className="feature-row">
      <span
        className="feature-dot"
        style={{ background: FEATURE_STATUS_COLOR[feature.status] }}
        title={feature.status}
      />
      <div className="feature-row-body">
        <div className="feature-row-name">{feature.name}</div>
        <div className="feature-row-meta">
          <code>
            {feature.probe.method} {feature.probe.path}
          </code>
          <span>·</span>
          <span>backend #{feature.issue}</span>
          <span>·</span>
          <span>{feature.httpStatus}</span>
        </div>
      </div>
    </div>
  );
}

function MilestoneSection({ milestone }: { milestone: FeatureMilestone }) {
  return (
    <section className="milestone-section">
      <div className="milestone-header">
        <h2>{milestone.name}</h2>
        <span
          className="milestone-badge"
          style={{ color: MILESTONE_STATUS_COLOR[milestone.status] }}
        >
          {milestone.status}
        </span>
      </div>
      {milestone.features.map((feature) => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
    </section>
  );
}

export default function FeatureStatusPage() {
  const { data, isLoading, error } = useFeatureStatus();

  if (isLoading) {
    return <div className="admin-status-page">Loading feature status…</div>;
  }

  if (error || !data) {
    return (
      <div className="admin-status-page">Could not load feature status.</div>
    );
  }

  const { summary, milestones } = data as FeatureStatusData;

  return (
    <>
      <style>{`
        .admin-status-page {
          max-width: 760px;
          padding: 48px 32px;
          font-family: 'Chakra Petch', sans-serif;
        }
        @media (max-width: 480px) {
          .admin-status-page { padding: 32px 16px; }
        }
        .admin-status-summary {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
        }
        .admin-status-summary div {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        .admin-status-summary strong {
          display: block;
          font-size: 1.5rem;
          color: inherit;
        }
        .milestone-section {
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid hsl(var(--border));
        }
        .milestone-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;
        }
        .milestone-header h2 {
          font-size: 1rem;
          margin: 0;
        }
        .milestone-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .feature-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 6px 0;
        }
        .feature-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .feature-row-name {
          font-size: 0.85rem;
        }
        .feature-row-meta {
          display: flex;
          gap: 6px;
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          margin-top: 2px;
        }
        .feature-row-meta code {
          font-size: 0.7rem;
        }
        .admin-status-raw {
          margin-top: 32px;
          padding: 16px;
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          font-size: 0.7rem;
          overflow-x: auto;
        }
        .admin-status-raw summary {
          cursor: pointer;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        .admin-status-raw pre { margin-top: 10px; }
      `}</style>

      <div className="admin-status-page">
        <h1>Feature Status</h1>
        <div className="admin-status-summary">
          <div>
            <strong>{summary.total}</strong>total
          </div>
          <div>
            <strong style={{ color: FEATURE_STATUS_COLOR.active }}>
              {summary.active}
            </strong>
            active
          </div>
          <div>
            <strong style={{ color: FEATURE_STATUS_COLOR.missing }}>
              {summary.missing}
            </strong>
            missing
          </div>
          <div>
            <strong style={{ color: FEATURE_STATUS_COLOR.error }}>
              {summary.error}
            </strong>
            error
          </div>
        </div>

        {milestones.map((milestone) => (
          <MilestoneSection key={milestone.id} milestone={milestone} />
        ))}

        <details className="admin-status-raw">
          <summary>Raw response</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    </>
  );
}
