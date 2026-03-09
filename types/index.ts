// ─── /app/info response ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface AppLocation {
  city: string;
  region: string;
  country_code: string; // ISO 3166-1 alpha-2, e.g. "US"
  latitude: number;
  longitude: number;
}

export interface AppFeatureFlags {
  [key: string]: boolean | string | number;
}

export interface AppInfo {
  apiVersion: string;
  ipLocation: AppLocation;
  features: AppFeatureFlags;
  imageServer: ImageServer;
}

// ─── Context shapes ───────────────────────────────────────────────────────────

export interface AppInfoContextValue {
  appInfo: AppInfo | null;
  isLoading: boolean;
  /** true while React Query is retrying (server waking up) */
  isRetrying: boolean;
  error: Error | null;
}

export type LocationSource = "ip" | "gps" | "manual";

export interface LocationContextValue {
  location: AppLocation | null;
  isLoading: boolean;
  /** "ip" = resolved from server; "gps" / "manual" = future upgrade paths */
  source: LocationSource;
  /** Set a manual or GPS-derived location — persisted to localStorage */
  setLocation: (location: AppLocation, source: "gps" | "manual") => void;
  /** Clear override and revert to IP-resolved location */
  resetToIP: () => void;
}

export interface ImageServer {
  baseUrl: string;
  cloudName: string;
  uploadPath: string;
}

export interface StoredOverride {
  location: AppLocation;
  source: "gps" | "manual";
}

export interface Track {
  id: number;
  name: string;
  common_name__c: string;
  abbreviated_name__c: string;
  slug__c: string;
  billingcity: string;
  billingstate: string;
  billingcountry: string;
  billingstreet: string;
  billinglatitude: number;
  billinglongitude: number;
  billingpostalcode: string | null;
  description: string;
  image_url__c: string;
  logo_url__c: string;
  logo_authorized__c: boolean;
  logo_background_color__c: string | null;
  rating_average__c: number | null;
  rating_total__c: string;
  recordtypename: string;
  website: string | null;
  phone: string | null;
  distanceKm?: number; // injected client-side after distance calculation
}
