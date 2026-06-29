import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { TRACKS_PATH, TRACKS_NEARBY_PATH } from "@/lib/constants";
import { useLocation } from "@/lib/contexts/LocationContext";

export const DEFAULT_RADIUS = 250;

async function fetchTracks() {
  const res = await apiClient.uGet(TRACKS_PATH);
  if (!res.ok) {
    // Throw so React Query knows to retry
    throw new Error(`tracks responded with ${res.status}`);
  }
  return res.data.data;
}

async function fetchTracksNearby(location, radius, trackType = []) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    radius: String(radius),
  });

  trackType.forEach((type) => params.append("types", type));

  // let url = `${TRACKS_NEARBY_PATH}?latitude=${location?.latitude}&longitude=${location?.longitude}&radius=${radius}`;
  // if (trackType) {
  //   url += `&trackType=${encodeURIComponent(trackType)}`;
  // }
  // const url = `${TRACKS_NEARBY_PATH}?latitude=37.4&longitude=-122.1&radius=250`;
  const url = `${TRACKS_NEARBY_PATH}?${params.toString()}`;
  console.log("Fetching tracks with URL:", url);

  const res = await apiClient.uGet(url);

  // const res = await apiClient.uGet(url);
  if (!res.ok) {
    // Throw so React Query knows to retry
    throw new Error(`tracks responded with ${res.status}`);
  }
  return res.data.data;
}

// /events/nearby?latitude=37.4&longitude=-122.1&radius=250

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
  });
}

export function useTracksNearby({ radius = DEFAULT_RADIUS, trackType }) {
  const { location } = useLocation();

  return useQuery({
    queryKey: [
      "tracksNearby",
      location?.latitude,
      location?.longitude,
      radius,
      trackType,
    ],
    queryFn: () => fetchTracksNearby(location, radius, trackType),
    enabled: !!location, // waits for appInfo to resolve
  });
}
