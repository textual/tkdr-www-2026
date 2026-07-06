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
  sponsoring?: AccountOffering;
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

/**
 * A track's own photo comes back as `{ full, thumb }` — two rendered sizes,
 * not a plain URL string. Use `trackImageUrl()` (lib/trackImage.ts) to read
 * one rather than passing this directly to an <img src>. This is specific
 * to Track's `image_url` — a Configuration's `image_url` (the map/layout
 * image) is a plain string, and Account's `*_url__c` fields are plain
 * strings too.
 */
export interface TrackImage {
  full: string;
  thumb: string;
}

/**
 * `/accounts/:id/tracks` returns more than the lean `Track` used in facility
 * cards — surface/length detail. No logo or layout-map field belongs here —
 * those live on `TrackConfiguration` below, since a track can have several
 * driveable configurations, each with its own map.
 */
export type AccountTrack = Track & {
  surface_type: string | null;
  length_meters: string | null;
};

/** Lean reference to a required, singular relation — e.g. an event's facility/organizer. */
export interface AccountRef {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
}

/**
 * Shape returned by `GET /tracks/:id` — a track's own canonical detail page.
 * `image_url` is the track's own photo (see `TrackImage` above) — the
 * layout/map image lives one level down, on each `TrackConfiguration`.
 */
export type TrackDetail = AccountTrack & {
  image_url: TrackImage | null;
  facility: AccountRef;
};

/**
 * Shape returned by `GET /tracks/:id/configs` — a track can have several
 * driveable configurations (e.g. "Main - CW" vs "Main - CCW"), each its own
 * row with its own map/layout image. This is where "recognize the track by
 * shape" actually lives — not on Track itself.
 */
export interface TrackConfiguration {
  id: number;
  sfid: string | null;
  name: string;
  direction: string | null;
  length_km: string | null;
  /** Same `{ full, thumb }` shape as Track's `image_url` — read with `trackImageUrl()`. */
  image_url: TrackImage | null;
}

export interface AccountEventTrackRef {
  id: number;
  name: string;
  track_type: string;
}

export interface AccountEvent {
  id: number;
  sfid: string | null;
  /** Salesforce-assigned record code (e.g. "TDE-03582") — a display badge, not a title. */
  event_code: string;
  status: string; // "Active" | ...
  type: string;
  start_date: string;
  end_date: string | null;
  event_format: string;
  event_url: string | null;
  facility: AccountRef;
  organizer: AccountRef;
  track: AccountEventTrackRef;
}

export interface AccountService {
  id: number;
  name: string;
  category: string;
  premium__c: boolean;
  description?: string | null;
}

export interface AccountProduct {
  id: number;
  name: string;
  category: string;
  sku: string | null;
  premium__c: boolean;
  description?: string | null;
}

export interface AccountSponsorship {
  id: number;
  event_name: string;
  tier: string;
  season: string | null;
}
