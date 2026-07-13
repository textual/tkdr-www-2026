import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { SEARCH_PATH } from "@/lib/constants";
import { useLocation } from "@/lib/contexts/LocationContext";

// GET /search?q=...&latitude=...&longitude=...
// Returns bucketed results — { accounts: [...] } today, with
// people/vehicles/vehicle_services buckets to follow.
async function fetchSearch(q, location) {
  const params = new URLSearchParams({ q });
  if (location) {
    params.set("latitude", String(location.latitude));
    params.set("longitude", String(location.longitude));
  }

  const res = await apiClient.uGet(`${SEARCH_PATH}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`search responded with ${res.status}`);
  }
  return res.data.data;
}

export function useSearch(q) {
  const { location } = useLocation();

  return useQuery({
    queryKey: ["search", q, location?.latitude, location?.longitude],
    queryFn: () => fetchSearch(q, location),
    enabled: !!q?.trim(),
    staleTime: 60 * 1000,
  });
}
