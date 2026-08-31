import { createClient } from '@/lib/supabase/server';
import type { MissionRow } from '@/lib/supabase/types';

export interface MissionWithObjects extends MissionRow {
  mission_objects?: {
    object_id: string;
    relationship_type: string | null;
    celestial_objects: { name: string; object_type: string; slug: string };
  }[];
}

/**
 * Get all missions with optional filters.
 */
export async function getMissions(options?: {
  status?: string;
  agency?: string;
  limit?: number;
}): Promise<MissionRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from('missions')
    .select('*')
    .order('launch_at', { ascending: false, nullsFirst: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.agency) {
    query = query.ilike('agency', `%${options.agency}%`);
  }

  query = query.limit(options?.limit ?? 20);

  const { data, error } = await query;
  if (error) throw new Error(`getMissions: ${error.message}`);
  return data ?? [];
}

/**
 * Get a single mission by ID with related objects.
 */
export async function getMissionById(id: string): Promise<MissionWithObjects | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('missions')
    .select(`
      *,
      mission_objects(
        object_id,
        relationship_type,
        celestial_objects(name, object_type, slug)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`getMissionById: ${error.message}`);
  return data as MissionWithObjects | null;
}

/**
 * Get missions related to a specific celestial object.
 */
export async function getMissionsByObjectId(
  objectId: string,
  limit = 10
): Promise<MissionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mission_objects')
    .select('missions(*)')
    .eq('object_id', objectId)
    .limit(limit);

  if (error) throw new Error(`getMissionsByObjectId: ${error.message}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.missions).filter(Boolean) as MissionRow[];
}

/**
 * Search missions by name.
 */
export async function searchMissions(query: string, limit = 10): Promise<MissionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .or(`name.ilike.%${query}%,agency.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit);

  if (error) throw new Error(`searchMissions: ${error.message}`);
  return data ?? [];
}
