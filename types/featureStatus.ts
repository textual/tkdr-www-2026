// types/featureStatus.ts

/** Backend-reported status for one probed feature. */
export type FeatureStatus = "active" | "missing" | "error";

/** Backend-reported status for a milestone as a whole. */
export type MilestoneStatus = "complete" | "partial" | "not-started";

export interface FeatureProbe {
  method: string;
  path: string;
  body?: Record<string, unknown>;
}

/**
 * One feature the backend self-probes. `issue` is the backend project's own
 * issue number — a separate tracker from this repo's GitHub issues, despite
 * the shared numbering-looking shape.
 */
export interface Feature {
  id: string;
  issue: number;
  name: string;
  probe: FeatureProbe;
  status: FeatureStatus;
  httpStatus: number;
}

export interface FeatureMilestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  features: Feature[];
}

export interface FeatureStatusSummary {
  total: number;
  active: number;
  missing: number;
  error: number;
}

/** Shape of `GET /admin/feature-status`'s `data` field. */
export interface FeatureStatusData {
  summary: FeatureStatusSummary;
  milestones: FeatureMilestone[];
}
