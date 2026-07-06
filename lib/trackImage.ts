import { type TrackImage } from "@/types";

/**
 * Track logo/photo/map fields come back as `{ full, thumb }`, not a plain
 * URL string. Use this instead of passing the field straight to <img src> —
 * an object rendered as a src attribute silently fails (React stringifies it
 * to "[object Object]"), which looks like a missing image rather than a bug.
 */
export function trackImageUrl(
  image: TrackImage | string | null | undefined,
  size: "full" | "thumb" = "thumb"
): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image[size] ?? null;
}
