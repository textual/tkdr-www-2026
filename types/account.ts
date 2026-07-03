// types/account.ts

import { type Track } from "./facility";

/**
 * Known primary record types. Kept as a union for the panel-ordering map,
 * but `Account.recordtypename` is typed as `string` since new types can be
 * added on the Salesforce side without a frontend deploy.
 */
export type AccountRecordTypeName =
  | "Facility"
  | "Organizer"
  | "Vendor"
  | "Manufacturer"
  | "Sponsor";

/** One entry in the `offerings` map on the account summary. */
export interface AccountOffering {
  /** Whether this account has any records of this kind — drives whether the panel renders at all. */
  present: boolean;
  /** Cheap aggregate so a collapsed panel can show "3 tracks" without fetching the list. */
  count?: number;
}

/**
 * The full set of "does this account also do X" flags. Every key is
 * optional/absent-safe — an account with no events just omits `events`,
 * treated the same as `{ present: false }`.
 */
export interface AccountOfferings {
  tracks?: AccountOffering;
  events?: AccountOffering;
  services?: AccountOffering;
  products?: AccountOffering;
  sponsorships?: AccountOffering;
}

export type AccountOfferingKey = keyof AccountOfferings;

/**
 * Core Account fields — this mirrors the Salesforce Account object, so the
 * same shape underlies a Facility, Organizer, Vendor, or Manufacturer.
 * `recordtypename` tells you which one; `offerings` tells you what else it does.
 */
export interface Account {
  id: number;
  sfid: string;
  name: string;
  common_name__c: string | null;
  slug__c: string;
  recordtypeid: string;
  recordtypename: AccountRecordTypeName | string;
  billingcity: string | null;
  billingstate: string | null;
  billingcountry: string | null;
  billingstreet: string | null;
  billingpostalcode: string | null;
  billinglatitude: number | null;
  billinglongitude: number | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  logo_url__c: string | null;
  logo_background_color__c: string | null;
  logo_authorized__c: boolean;
}

/**
 * Shape returned by `GET /accounts/:id` — the account page's single upfront
 * request. Deliberately excludes nested lists; those live behind the
 * sub-resource endpoints each panel calls for itself.
 */
export interface AccountSummary extends Account {
  offerings: AccountOfferings;
}

// ─── Panel detail shapes ────────────────────────────────────────────────────
// Each of these corresponds to one `GET /accounts/:id/<resource>` call,
// fired only when its panel mounts.

export type AccountTrack = Track;

export interface AccountEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  status: string; // "Pending" | "Confirmed" | "Completed" | ...
}

export interface AccountService {
  id: number;
  name: string;
  category: string;
  description: string | null;
}

export interface AccountProduct {
  id: number;
  name: string;
  category: string;
  sku: string | null;
}

export interface AccountSponsorship {
  id: number;
  event_name: string;
  tier: string;
  season: string | null;
}
