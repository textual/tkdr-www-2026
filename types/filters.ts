// types/filters.ts

export type FacilityType =
  | "Road Course"
  | "Oval"
  | "Kart Circuit"
  | "Drag Strip"
  | "Autocross";

export type TrackType = "Road Course" | "Kart Track" | "Drag Strip";

export type EventType =
  | "Track Day"
  | "Club Race"
  | "HPDE"
  | "Time Trial"
  | "Drift"
  | "Autocross";

export interface TrackFilters {
  facilityTypes: FacilityType[];
  radiusKm: number;
}

export interface EventFilters {
  eventTypes: EventType[];
  radiusKm: number;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export const DEFAULT_TRACK_FILTERS: TrackFilters = {
  facilityTypes: [],
  radiusKm: 250,
};

export const DEFAULT_EVENT_FILTERS: EventFilters = {
  eventTypes: [],
  radiusKm: 250,
  dateFrom: null,
  dateTo: null,
};

export const RADIUS_MIN = 50;
export const RADIUS_MAX = 1000;
export const RADIUS_STEP = 50;

/** Count how many filters are actively applied (non-default) */
export function countActiveTrackFilters(f: TrackFilters): number {
  let count = 0;
  if (f.facilityTypes.length > 0) count++;
  if (f.radiusKm !== DEFAULT_TRACK_FILTERS.radiusKm) count++;
  return count;
}

export function countActiveEventFilters(f: EventFilters): number {
  let count = 0;
  if (f.eventTypes.length > 0) count++;
  if (f.radiusKm !== DEFAULT_EVENT_FILTERS.radiusKm) count++;
  if (f.dateFrom || f.dateTo) count++;
  return count;
}
