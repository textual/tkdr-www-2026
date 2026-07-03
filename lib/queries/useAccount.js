import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { ACCOUNTS_PATH } from "@/lib/constants";

// GET /accounts/:id
// Returns core account fields + a lightweight `offerings` map
// ({ tracks: { present, count }, events: { present, count }, ... }).
// No nested lists — those are fetched per-panel via useAccountPanels.
async function fetchAccount(accountIdOrSlug) {
  const res = await apiClient.uGet(`${ACCOUNTS_PATH}/${accountIdOrSlug}`);
  if (!res.ok) {
    throw new Error(`account responded with ${res.status}`);
  }
  return res.data.data;
}

export function useAccount(accountIdOrSlug) {
  return useQuery({
    queryKey: ["account", accountIdOrSlug],
    queryFn: () => fetchAccount(accountIdOrSlug),
    enabled: !!accountIdOrSlug,
    staleTime: 5 * 60 * 1000,
  });
}
