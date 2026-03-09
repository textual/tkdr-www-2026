import { useQuery } from "@tanstack/react-query";
import type { AppInfo } from "@/types";

import { apiClient } from "../apiClient";
import { APP_INFO_PATH } from "@/lib/constants";

const APP_INFO_KEY = ["app", "info"] as const;

async function fetchAppInfo(): Promise<AppInfo> {
  const res = await apiClient.uGet(APP_INFO_PATH);
  if (!res.ok) {
    // Throw so React Query knows to retry
    throw new Error(`app/info responded with ${res.status}`);
  }
  return res.data;
}

/**
 * Fetches /app/info once at startup.
 * React Query will retry with exponential backoff if the server is
 * cold-starting, then cache the result for the session.
 */
export function useAppInfo() {
  const query = useQuery({
    queryKey: APP_INFO_KEY,
    queryFn: fetchAppInfo,
  });

  return {
    appInfo: query.data ?? null,
    isLoading: query.isLoading,
    // failureCount > 0 means at least one retry has happened —
    // useful for showing a "server is waking up…" message
    isRetrying: query.isLoading && query.failureCount > 0,
    error: query.error as Error | null,
  };
}
