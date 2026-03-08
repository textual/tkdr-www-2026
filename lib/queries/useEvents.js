import { apiClient } from "../apiClient";
import { EVENTS_PATH } from "@/lib/constants";

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/contexts/LocationContext";
// import type { AppLocation } from "@/types";

// Adjust this type to match your actual API response
// export interface Event {
//   id: string;
//   title: string;
//   date: string;
//   location: AppLocation;
//   distanceKm: number;
// //   series: string;
// }

export const DEFAULT_RADIUS = 250;
export const MIN_RADIUS = 50;
export const MAX_RADIUS = 1000;

async function fetchEvents(location, radius) {
  // end point url
  const url = `${EVENTS_PATH}?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}`;
  console.log("Fetching events with URL:", url);
  const res = await apiClient.uGet(url);
  if (!res.ok) {
    // Throw so React Query knows to retry
    throw new Error(`tracks responded with ${res.status}`);
  }
  return res.data.data;
}

/**
 * Fires once when location is available from appInfo.
 *
 * Because the query key is fixed to the initial location coords,
 * it won't re-fetch if the user later upgrades to GPS — the cached
 * result from startup is reused for the session.
 */
export function useEvents(radius = DEFAULT_RADIUS) {
  const { location } = useLocation();

  const query = useQuery({
    queryKey: ["events", location?.latitude, location?.longitude, radius],
    queryFn: () => fetchEvents(location, radius),
    enabled: !!location, // waits for appInfo to resolve
    staleTime: Infinity, // don't re-fetch during the session
    retry: 2,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isRetrying: query.isLoading && query.failureCount > 0,
    error: query.error ?? null,
  };
}
