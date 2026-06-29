"use client";

import { useCallback, useState } from "react";
import {
  DEFAULT_TRACK_FILTERS,
  countActiveTrackFilters,
  type FacilityType,
  type TrackFilters,
} from "@/types/filters";

export function useTrackFilters() {
  // Draft state — what's shown in the Sheet before applying
  const [draft, setDraft] = useState<TrackFilters>(DEFAULT_TRACK_FILTERS);
  // Applied state — what the query actually uses
  const [applied, setApplied] = useState<TrackFilters>(DEFAULT_TRACK_FILTERS);

  const toggleFacilityType = useCallback((type: FacilityType) => {
    setDraft((prev) => ({
      ...prev,
      facilityTypes: prev.facilityTypes.includes(type)
        ? prev.facilityTypes.filter((t) => t !== type)
        : [...prev.facilityTypes, type],
    }));
  }, []);

  const setRadius = useCallback((radiusKm: number) => {
    setDraft((prev) => ({ ...prev, radiusKm }));
  }, []);

  const apply = useCallback(() => {
    setApplied(draft);
  }, [draft]);

  const reset = useCallback(() => {
    setDraft(DEFAULT_TRACK_FILTERS);
    setApplied(DEFAULT_TRACK_FILTERS);
  }, []);

  // Discard draft changes without applying
  const discard = useCallback(() => {
    setDraft(applied);
  }, [applied]);

  return {
    draft,
    applied,
    activeCount: countActiveTrackFilters(applied),
    toggleFacilityType,
    setRadius,
    apply,
    reset,
    discard,
  };
}
