export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Great-circle distance in km between two points. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance from a base point to a donation, or null if missing coords. */
export function distanceFrom(base: GeoPoint | null, to: GeoPoint): number | null {
  if (!base) return null;
  return distanceKm(base, to);
}

/** Small deterministic-looking jitter around a centre point (for seeds). */
export function jitter(centre: GeoPoint, seed: number): GeoPoint {
  const r = ((seed * 137.508) % 100) / 100; // golden-angle spread, stable per seed
  const angle = seed * 2.399;
  const radius = 0.005 + r * 0.05; // ~0.5–5 km
  return {
    lat: centre.lat + Math.sin(angle) * radius,
    lng: centre.lng + Math.cos(angle) * radius,
  };
}
