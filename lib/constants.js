export const API_URL = process.env.NEXT_PUBLIC_TKDR_API; //"http://localhost:8200";
export const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
export const refreshKey = new TextEncoder().encode(process.env.JWT_REFRESH_KEY);

// www paths
export const HOME_URL = "/";
export const SETTINGS_URL = "/settings";

// api endpoints
export const APP_INFO_PATH = "/app/info";
export const EVENTS_PATH = "/events/nearby";
export const TRACKS_PATH = "/tracks";
export const TRACKS_NEARBY_PATH = "/tracks/nearby";
