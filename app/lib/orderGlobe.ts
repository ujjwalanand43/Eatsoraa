export type GlobeLocation = {label: string; location: [number, number]; source: 'sample' | 'shopify'};
export const DEFAULT_GLOBE_LOCATIONS: GlobeLocation[] = [
  {label: 'New Delhi, India', location: [28.61, 77.21], source: 'sample'},
  {label: 'Mumbai, India', location: [19.08, 72.88], source: 'sample'},
  {label: 'Bengaluru, India', location: [12.97, 77.59], source: 'sample'},
  {label: 'Kolkata, India', location: [22.57, 88.36], source: 'sample'},
  {label: 'Jaipur, India', location: [26.91, 75.79], source: 'sample'},
];
// Only deliberately published, coarse locations are accepted from Shopify.
export function parseGlobeLocations(value?: string | null): GlobeLocation[] {
  try {
    const rows: unknown = JSON.parse(value || '[]');
    if (!Array.isArray(rows)) return [];
    return rows.slice(0, 50).flatMap((row: unknown) => {
      if (!row || typeof row !== 'object') return [];
      const {city, country, latitude, longitude} = row as Record<string, unknown>;
      if (typeof city !== 'string' || typeof country !== 'string' ||
        typeof latitude !== 'number' || typeof longitude !== 'number' ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
      return [{label: `${city.slice(0, 50)}, ${country.slice(0, 40)}`, location: [Math.round(latitude * 10) / 10, Math.round(longitude * 10) / 10] as [number, number], source: 'shopify' as const}];
    });
  } catch { return []; }
}
