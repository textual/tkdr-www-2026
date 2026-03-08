"use client";

/**
 * Example: how to consume AppInfo and Location in any client component.
 * Shows the "server is waking up" pattern for the free-tier cold start.
 */

import { useAppInfoContext } from "@/lib/contexts/AppInfoContext";
import { useLocation } from "@/lib/contexts/LocationContext";
import styles from "./locationBanner.module.css";

export function LocationBanner({ mode }) {
  const { isLoading, isRetrying, error, appInfo } = useAppInfoContext();
  const { location, source } = useLocation();

  if (isRetrying) {
    return (
      <div className="banner banner--warning">
        ⏳ Server is waking up, hang tight…
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-[0.65rem] text-muted-foreground">Loading…</div>;
  }

  if (error) {
    return (
      <div className="banner banner--error">
        Could not reach the server. Please try again.
      </div>
    );
  }

  if (!location) return null;

  if (mode === "sidebar") {
    return (
      <div className="text-[0.65rem] text-muted-foreground flex items-center gap-1.5">
        <span className={styles["location-dot"]} />
        <span>
          {location.city}, {location.region}
        </span>
      </div>
    );
  }
  if (mode === "raw") {
    return (
      <table>
        <tbody>
          {Object.entries(location).map(([key, value]) => (
            <tr key={key}>
              <td>
                <span className="text-accent-foreground">{key} :</span>
              </td>
              <td>{value}</td>
            </tr>
          ))}
          <tr>
            <td>
              <span className="text-accent-foreground">Source:</span>
            </td>
            <td>{source}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <div className="location-label">
      📍 {location.city}, {location.region} ({location.country_code})
      {source === "ip" && <span className="subtle"> · approximate</span>}
    </div>
  );
}
