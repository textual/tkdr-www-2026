import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { ACCOUNTS_PATH } from "@/lib/constants";

// GET /accounts/:id/<resource> — one sub-resource per offering.
// Each hook below is only ever called from inside its panel component,
// and panels are only mounted once the user expands them (see
// components/account/AccountPanel.tsx), so the request naturally fires
// on-demand instead of all at once on page load.
async function fetchAccountResource(accountId, resource) {
  const res = await apiClient.uGet(
    `${ACCOUNTS_PATH}/${accountId}/${resource}`
  );
  if (!res.ok) {
    throw new Error(`account ${resource} responded with ${res.status}`);
  }
  return res.data.data;
}

function makeAccountResourceHook(resource) {
  return function useAccountResource(accountId) {
    return useQuery({
      // Nesting under ["account", accountId, ...] means
      // queryClient.invalidateQueries({ queryKey: ["account", accountId] })
      // busts the summary and every panel for that account in one call.
      queryKey: ["account", accountId, resource],
      queryFn: () => fetchAccountResource(accountId, resource),
      enabled: !!accountId,
      staleTime: 5 * 60 * 1000,
    });
  };
}

export const useAccountTracks = makeAccountResourceHook("tracks");
export const useAccountEvents = makeAccountResourceHook("events");
export const useAccountServices = makeAccountResourceHook("services");
export const useAccountProducts = makeAccountResourceHook("products");
export const useAccountSponsorships =
  makeAccountResourceHook("sponsorships");
