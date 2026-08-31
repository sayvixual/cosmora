import { createClient } from '@/lib/supabase/server';
import type { CelestialObjectRow, ScientificFactRow } from '@/lib/supabase/types';

export interface CelestialObjectWithFacts extends CelestialObjectRow {
  scientific_facts?: ScientificFactRow[];
  missions?: {
    mission_id: string;
    relationship_type: string | null;
    missions: { name: string; agency: string | null; status: string };
  }[];
}

/**
 * Get all celestial objects (paginated).
 */
export async function getCelestialObjects(options?: {
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<CelestialObjectRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from('celestial_objects')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (options?.type) {
    query = query.eq('object_type', options.type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit ?? 20)) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`getCelestialObjects: ${error.message}`);
  return data ?? [];
}

/**
 * Get a single celestial object by slug with related scientific facts and missions.
 */
export async function getCelestialObjectBySlug(slug: string): Promise<CelestialObjectWithFacts | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('celestial_objects')
    .select(`
      *,
      scientific_facts(*),
      mission_objects(
        mission_id,
        relationship_type,
        missions(name, agency, status)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`getCelestialObjectBySlug: ${error.message}`);
  }

  return data as CelestialObjectWithFacts;
}

/**
 * Get a celestial object by canonical name (for AI tool use).
 */
export async function getCelestialObjectByCanonicalName(
  canonicalName: string
): Promise<CelestialObjectWithFacts | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('celestial_objects')
    .select(`
      *,
      scientific_facts(*),
      mission_objects(
        mission_id,
        relationship_type,
        missions(name, agency, status)
      )
    `)
    .ilike('canonical_name', canonicalName)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw new Error(`getCelestialObjectByCanonicalName: ${error.message}`);
  return data as CelestialObjectWithFacts | null;
}

/**
 * Full-text + partial search across name and canonical_name.
 */
export async function searchCelestialObjects(
  query: string,
  limit = 10
): Promise<CelestialObjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('celestial_objects')
    .select('*')
    .or(`name.ilike.%${query}%,canonical_name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('status', 'active')
    .limit(limit);

  if (error) throw new Error(`searchCelestialObjects: ${error.message}`);
  return data ?? [];
}

/**
 * Get multiple objects by type (e.g. all planets).
 */
export async function getCelestialObjectsByType(
  objectType: string,
  limit = 20
): Promise<CelestialObjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('celestial_objects')
    .select('*')
    .eq('object_type', objectType)
    .eq('status', 'active')
    .order('distance_value', { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(`getCelestialObjectsByType: ${error.message}`);
  return data ?? [];
}
