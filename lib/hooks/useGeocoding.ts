"use client";

import { useEffect, useState } from "react";
import type { AppLocation } from "@/types";

export interface GeocodingResult {
  location: AppLocation;
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country_code?: string;
  };
}

/**
 * Converts a city name or zip/postcode to an AppLocation.
 * Uses OpenStreetMap Nominatim — no API key required.
 *
 * To swap for your own API later, replace the fetch URL inside
 * fetchGeocode() and remap the response fields to AppLocation.
 */
async function fetchGeocode(query: string): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "1",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        // Nominatim requires a descriptive User-Agent
        "User-Agent": "MotorsportApp/1.0",
      },
    },
  );

  if (!res.ok) throw new Error("Geocoding request failed");

  const results: NominatimResult[] = await res.json();
  if (!results.length) return null;

  const r = results[0];
  const city =
    r.address.city ??
    r.address.town ??
    r.address.village ??
    r.address.county ??
    query;

  return {
    location: {
      city,
      region: r.address.state ?? "",
      country_code: (r.address.country_code ?? "").toUpperCase(),
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    },
    displayName: r.display_name,
  };
}

type GeocodingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: GeocodingResult }
  | { status: "empty" }
  | { status: "error"; message: string };

/**
 * Debounced geocoding hook.
 * Fires 500ms after the user stops typing.
 * Returns the resolved location preview for the user to confirm.
 */
export function useGeocoding(query: string, debounceMs = 500) {
  const [state, setState] = useState<GeocodingState>({ status: "idle" });

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });

    const timer = setTimeout(async () => {
      try {
        const result = await fetchGeocode(trimmed);
        if (!result) {
          setState({ status: "empty" });
        } else {
          setState({ status: "success", result });
        }
      } catch {
        setState({
          status: "error",
          message: "Could not reach geocoding service.",
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return state;
}
