// components/account/panelRegistry.tsx
//
// Single source of truth for "what panels can an account page show, and in
// what order." Two separate concerns are deliberately kept apart here:
//
//  - `offerings` (from the account summary) decides which panels EXIST —
//    this is what lets a Vendor that also runs track days show a Tracks
//    panel, or an Organizer that also sells services show a Services panel.
//  - `recordtypename` (the account's primary thrust) only decides ORDER —
//    specifically, which one panel opens by default. It never hides a panel.

import { type ComponentType } from "react";

import { type AccountOfferingKey, type AccountOfferings } from "@/types";

import { TracksPanel } from "./panels/TracksPanel";
import { EventsPanel } from "./panels/EventsPanel";
import { ServicesPanel } from "./panels/ServicesPanel";
import { ProductsPanel } from "./panels/ProductsPanel";
import { SponsorshipsPanel } from "./panels/SponsorshipsPanel";

export interface AccountPanelDef {
  key: AccountOfferingKey;
  label: string;
  Component: ComponentType<{ accountId: number }>;
}

// Base order when nothing about the account's primary type overrides it.
export const ACCOUNT_PANEL_REGISTRY: AccountPanelDef[] = [
  { key: "tracks", label: "Tracks & Circuits", Component: TracksPanel },
  { key: "events", label: "Upcoming Events", Component: EventsPanel },
  { key: "services", label: "Services", Component: ServicesPanel },
  { key: "products", label: "Products", Component: ProductsPanel },
  {
    key: "sponsorships",
    label: "Sponsorships",
    Component: SponsorshipsPanel,
  },
];

// Which offering best represents each record type's "main thrust" —
// used only to decide which panel is expanded by default.
const PRIMARY_OFFERING_BY_RECORD_TYPE: Record<string, AccountOfferingKey> = {
  Facility: "tracks",
  Organizer: "events",
  Vendor: "services",
  Manufacturer: "products",
  Sponsor: "sponsorships",
};

/**
 * Returns the panels this account should render, in display order, with
 * the primary-type panel first. Panels for offerings that aren't present
 * are dropped entirely.
 */
export function getAccountPanels(
  recordtypename: string,
  offerings: AccountOfferings | undefined
): AccountPanelDef[] {
  const present = ACCOUNT_PANEL_REGISTRY.filter(
    (panel) => offerings?.[panel.key]?.present
  );

  const primaryKey = PRIMARY_OFFERING_BY_RECORD_TYPE[recordtypename];
  if (!primaryKey) return present;

  const primary = present.filter((p) => p.key === primaryKey);
  const rest = present.filter((p) => p.key !== primaryKey);
  return [...primary, ...rest];
}
