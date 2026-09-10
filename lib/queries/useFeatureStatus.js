import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { FEATURE_STATUS_PATH } from "@/lib/constants";

// GET /admin/feature-status
// Backend self-probes its own endpoints and reports which features are
// active/missing/erroring, grouped into the backend's own milestones.
async function fetchFeatureStatus() {
  const res = await apiClient.uGet(FEATURE_STATUS_PATH);
  if (!res.ok) {
    throw new Error(`feature-status responded with ${res.status}`);
  }
  return res.data.data;
}

export function useFeatureStatus() {
  return useQuery({
    queryKey: ["featureStatus"],
    queryFn: fetchFeatureStatus,
    staleTime: 60 * 1000,
  });
}
