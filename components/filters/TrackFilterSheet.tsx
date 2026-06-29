"use client";

// components/filters/TrackFilterSheet.tsx

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  FilterSection,
  ToggleGroup,
  RadiusSlider,
  FilterFooter,
  FilterStyles,
} from "@/components/filters/FilterPrimitives";
import type { useTrackFilters } from "@/lib/hooks/useTrackFilters";
import { type FacilityType } from "@/types/filters";

const FACILITY_TYPES: FacilityType[] = [
  "Road Course",
  "Oval",
  "Kart Circuit",
  "Drag Strip",
  "Autocross",
];

type TrackFilterControls = ReturnType<typeof useTrackFilters>;

interface TrackFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TrackFilterControls;
}

export function TrackFilterSheet({
  open,
  onOpenChange,
  filters,
}: TrackFilterSheetProps) {
  function handleApply() {
    filters.apply();
    onOpenChange(false);
  }

  function handleReset() {
    filters.reset();
    onOpenChange(false);
  }

  function handleOpenChange(next: boolean) {
    // Discard draft if closed without applying
    if (!next) filters.discard();
    onOpenChange(next);
  }

  return (
    <>
      <FilterStyles />

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="track-filter-sheet"
          style={{
            width: "320px",
            maxWidth: "320px",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--card)",
            borderLeft: "1px solid var(--border)",
          }}
          //   hideCloseButton
        >
          <VisuallyHidden.Root>
            <SheetTitle>Track Filters</SheetTitle>
          </VisuallyHidden.Root>

          {/* Header */}
          <div className="tfs-header">
            <div>
              <p className="tfs-eyebrow">Refine</p>
              <h2 className="tfs-title">Track Filters</h2>
            </div>
            <button
              className="tfs-close"
              onClick={() => handleOpenChange(false)}
              aria-label="Close filters"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="tfs-divider" />

          {/* Facility type */}
          <FilterSection label="Facility type">
            <ToggleGroup<FacilityType>
              options={FACILITY_TYPES}
              selected={filters.draft.facilityTypes}
              onToggle={filters.toggleFacilityType}
            />
          </FilterSection>

          {/* Distance */}
          <FilterSection label="Search radius">
            <RadiusSlider
              value={filters.draft.radiusKm}
              onChange={filters.setRadius}
            />
          </FilterSection>

          {/* Footer */}
          <FilterFooter onReset={handleReset} onApply={handleApply} />
        </SheetContent>
      </Sheet>

      <style>{`
        .tfs-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 20px 20px;
        }

        .tfs-eyebrow {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ba1111;
          margin-bottom: 4px;
        }

        .tfs-title {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--foreground);
          letter-spacing: -0.01em;
        }

        .tfs-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 4px;
          cursor: pointer;
          color: var(--muted-foreground);
          transition: border-color 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .tfs-close:hover {
          border-color: #ba1111;
          color: #ba1111;
        }

        .tfs-divider {
          height: 1px;
          background: var(--border);
        }
      `}</style>
    </>
  );
}
