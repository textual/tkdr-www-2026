"use client";

import { useCallback, useState } from "react";
import {
  DEFAULT_EVENT_FILTERS,
  countActiveEventFilters,
  type EventType,
  type EventFilters,
} from "@/types/filters";

export function useEventFilters() {
  const [draft, setDraft] = useState<EventFilters>(DEFAULT_EVENT_FILTERS);
  const [applied, setApplied] = useState<EventFilters>(DEFAULT_EVENT_FILTERS);

  const toggleEventType = useCallback((type: EventType) => {
    setDraft((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter((t) => t !== type)
        : [...prev.eventTypes, type],
    }));
  }, []);

  const setRadius = useCallback((radiusKm: number) => {
    setDraft((prev) => ({ ...prev, radiusKm }));
  }, []);

  const setDateFrom = useCallback((date: Date | null) => {
    setDraft((prev) => ({
      ...prev,
      dateFrom: date,
      // clear dateTo if it's before the new dateFrom
      dateTo: prev.dateTo && date && prev.dateTo < date ? null : prev.dateTo,
    }));
  }, []);

  const setDateTo = useCallback((date: Date | null) => {
    setDraft((prev) => ({ ...prev, dateTo: date }));
  }, []);

  const apply = useCallback(() => {
    setApplied(draft);
  }, [draft]);

  const reset = useCallback(() => {
    setDraft(DEFAULT_EVENT_FILTERS);
    setApplied(DEFAULT_EVENT_FILTERS);
  }, []);

  const discard = useCallback(() => {
    setDraft(applied);
  }, [applied]);

  return {
    draft,
    applied,
    activeCount: countActiveEventFilters(applied),
    toggleEventType,
    setRadius,
    setDateFrom,
    setDateTo,
    apply,
    reset,
    discard,
  };
}
