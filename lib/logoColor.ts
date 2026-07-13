// lib/logoColor.ts

// The API's logo_background_color__c comes back as a bare hex triplet
// (e.g. "666666"), not a valid CSS color — prefix it with `#` before
// handing it to a `style` background, or the browser silently drops it.
export function logoBackgroundColor(
  hex: string | null | undefined,
): string | undefined {
  if (!hex) return undefined;
  return hex.startsWith("#") ? hex : `#${hex}`;
}
