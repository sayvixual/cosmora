import { createClient } from '@/lib/supabase/server';
import type { DestinationRow } from '@/lib/supabase/types';

export interface DestinationWithActivities extends DestinationRow {
  destination_activities?: {
    id: string;
    activity_type: string;
    description: string | null;
  }[];
}

/**
 * Get all destinations with optional filters.
 */
export async function getDestinations(options?: {
  activityType?: string;
  minSkyQuality?: number;
  limit?: number;
}): Promise<DestinationRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from('destinations')
    .select('*')
    .order('sky_quality', { ascending: false, nullsFirst: false });

  if (options?.minSkyQuality) {
    query = query.gte('sky_quality', options.minSkyQuality);
  }

  query = query.limit(options?.limit ?? 20);

  const { data, error } = await query;
  if (error) throw new Error(`getDestinations: ${error.message}`);
  return data ?? [];
}

/**
 * Get a single destination by slug with activities and related objects.
 */
export async function getDestinationBySlug(slug: string): Promise<DestinationWithActivities | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      *,
      destination_activities(id, activity_type, description),
      destination_objects(
        object_id,
        visibility_notes,
        best_season,
        celestial_objects(name, object_type, slug)
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`getDestinationBySlug: ${error.message}`);
  return data as DestinationWithActivities | null;
}

/**
 * Find destinations near a lat/lon coordinate (PostGIS geospatial query).
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param radiusKm - Search radius in kilometers
 */
export async function getNearbyDestinations(
  lat: number,
  lon: number,
  radiusKm = 500,
  limit = 10
): Promise<DestinationRow[]> {
  const supabase = await createClient();
  // Use PostGIS ST_DWithin for geospatial query
  // Distance in meters (PostGIS geography default unit)
  const radiusMeters = radiusKm * 1000;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('get_destinations_within_radius', {
    lat,
    lon,
    radius_m: radiusMeters,
    result_limit: limit,
  });

  if (error) {
    // Fallback: return all destinations sorted by sky quality if PostGIS RPC fails
    console.warn('getNearbyDestinations RPC failed, falling back:', error.message);
    return getDestinations({ limit });
  }

  return (data ?? []) as DestinationRow[];
}

/**
 * Search destinations by name or region.
 */
export async function searchDestinations(query: string, limit = 10): Promise<DestinationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .or(`name.ilike.%${query}%,region.ilike.%${query}%,country_code.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit);

  if (error) throw new Error(`searchDestinations: ${error.message}`);
  return data ?? [];
}
