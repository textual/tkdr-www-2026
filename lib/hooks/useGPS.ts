"use client";

import { useCallback, useState } from "react";
import type { AppLocation } from "@/types";

type GPSState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; location: AppLocation }
  | { status: "error"; message: string };

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<Partial<AppLocation>> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "User-Agent": "MotorsportApp/1.0" } },
  );
  if (!res.ok) return {};
  const data = await res.json();
  return {
    city:
      data.address?.city ?? data.address?.town ?? data.address?.village ?? "",
    region: data.address?.state ?? "",
    country_code: (data.address?.country_code ?? "").toUpperCase(),
  };
}

function getGPSErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return "Location access denied. Enable it in your browser settings.";
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return "Your position could not be determined.";
    case GeolocationPositionError.TIMEOUT:
      return "Location request timed out. Please try again.";
    default:
      return "An unknown location error occurred.";
  }
}

export function useGPS() {
  const [state, setState] = useState<GPSState>({ status: "idle" });

  const requestGPS = useCallback(async (): Promise<AppLocation | null> => {
    if (!navigator.geolocation) {
      setState({
        status: "error",
        message: "Geolocation is not supported by your browser.",
      });
      return null;
    }

    setState({ status: "loading" });

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          }),
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get human-readable city/region
      const meta = await reverseGeocode(latitude, longitude);

      const location: AppLocation = {
        latitude,
        longitude,
        city: meta.city ?? "Unknown",
        region: meta.region ?? "",
        country_code: meta.country_code ?? "",
      };

      setState({ status: "success", location });
      return location;
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? getGPSErrorMessage(err)
          : "Could not determine your location.";
      setState({ status: "error", message });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, requestGPS, reset };
}
