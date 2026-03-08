"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppInfoContext } from "@/lib/contexts/AppInfoContext"; //"@/contexts/AppInfoContext";
import type {
  AppLocation,
  LocationContextValue,
  StoredOverride,
} from "@/types";

interface LocationContextFull extends LocationContextValue {
  /** Future: call this to upgrade from IP to browser GPS */
  setLocation: (location: AppLocation, source: "gps" | "manual") => void;
}

const STORAGE_KEY = "app-location-override";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStoredOverride(): StoredOverride | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredOverride) : null;
  } catch {
    return null;
  }
}

function writeStoredOverride(override: StoredOverride) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(override));
  } catch {}
}

function clearStoredOverride() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function sanitizeLocation(loc: AppLocation): AppLocation {
  return {
    ...loc,
    latitude: parseFloat(String(loc.latitude)),
    longitude: parseFloat(String(loc.longitude)),
  };
}

const LocationContext = createContext<LocationContextFull | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { appInfo, isLoading: appInfoLoading } = useAppInfoContext();
  console.log(
    "LocationProvider appInfo:",
    appInfo,
    "isLoading:",
    appInfoLoading,
  );
  // Override state — null means "use whatever app/info returned"
  // const [override, setOverride] = useState<{
  //   location: AppLocation;
  //   source: "gps" | "manual";
  // } | null>(null);
  const [override, setOverride] = useState<StoredOverride | null>(null);

  useEffect(() => {
    const stored = readStoredOverride();
    if (stored) setOverride(stored);
  }, []);

  const setLocation = useCallback(
    (location: AppLocation, source: "gps" | "manual") => {
      const next: StoredOverride = { location, source };
      setOverride(next);
      writeStoredOverride(next);
    },
    [],
  );

  const resetToIP = useCallback(() => {
    setOverride(null);
    clearStoredOverride();
  }, []);

  const value = useMemo<LocationContextFull>(() => {
    if (override) {
      return {
        location: override.location,
        source: override.source,
        isLoading: false,
        setLocation,
        resetToIP,
      };
    }
    console.log("Using IP location from appInfo:", appInfo?.ipLocation);
    return {
      location: appInfo?.ipLocation
        ? sanitizeLocation(appInfo.ipLocation)
        : null,
      source: "ip",
      isLoading: appInfoLoading,
      setLocation,
      resetToIP,
    };
  }, [appInfo, appInfoLoading, override, setLocation, resetToIP]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextFull {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocation must be used within <LocationProvider>");
  return ctx;
}
