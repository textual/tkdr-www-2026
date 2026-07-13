// types/search.ts

import { type Account } from "./account";

/**
 * Shape returned by `GET /search`. `people`/`vehicles`/`vehicle_services`
 * aren't implemented server-side yet, so they're typed loosely — tighten
 * once the server ships real shapes for them.
 */
export interface SearchResults {
  accounts?: Account[];
  people?: unknown[];
  vehicles?: unknown[];
  vehicle_services?: unknown[];
}

export interface SearchMeta {
  total?: number;
}
