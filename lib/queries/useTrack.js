import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { TRACKS_PATH } from "@/lib/constants";

// GET /tracks/:id — a single track's own canonical detail (name, type,
// surface, its own photo, facility ref). The map/layout image lives one
// level down — see useTrackConfigs.
async function fetchTrack(trackId) {
  const res = await apiClient.uGet(`${TRACKS_PATH}/${trackId}`);
  if (!res.ok) {
    throw new Error(`track responded with ${res.status}`);
  }
  return res.data.data;
}

export function useTrack(trackId) {
  return useQuery({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrack(trackId),
    enabled: !!trackId,
    staleTime: 5 * 60 * 1000,
  });
}

// GET /tracks/:id/configs — every driveable configuration for this track,
// each with its own map/layout image (a track can have several, e.g.
// "Main - CW" vs "Main - CCW").
async function fetchTrackConfigs(trackId) {
  const res = await apiClient.uGet(`${TRACKS_PATH}/${trackId}/configs`);
  if (!res.ok) {
    throw new Error(`track configs responded with ${res.status}`);
  }
  return res.data.data;
}

export function useTrackConfigs(trackId) {
  return useQuery({
    queryKey: ["track", trackId, "configs"],
    queryFn: () => fetchTrackConfigs(trackId),
    enabled: !!trackId,
    staleTime: 5 * 60 * 1000,
  });
}
