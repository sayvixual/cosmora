import { createClient } from '@/lib/supabase/server';
import type { CelestialEventRow } from '@/lib/supabase/types';

export interface CelestialEventWithObjects extends CelestialEventRow {
  event_objects?: {
    object_id: string;
    role: string | null;
    celestial_objects: { name: string; object_type: string; slug: string };
  }[];
}

/**
 * Get upcoming celestial events from today onwards.
 */
export async function getUpcomingEvents(options?: {
  limit?: number;
  type?: string;
  from?: string; // ISO date
  to?: string;   // ISO date
}): Promise<CelestialEventRow[]> {
  const supabase = await createClient();
  const from = options?.from ?? new Date().toISOString();
  
  let query = supabase
    .from('celestial_events')
    .select('*')
    .gte('starts_at', from)
    .order('starts_at', { ascending: true });

  if (options?.to) {
    query = query.lte('starts_at', options.to);
  }

  if (options?.type) {
    query = query.eq('event_type', options.type);
  }

  query = query.limit(options?.limit ?? 20);

  const { data, error } = await query;
  if (error) throw new Error(`getUpcomingEvents: ${error.message}`);
  return data ?? [];
}

/**
 * Get a single event by ID with related objects.
 */
export async function getEventById(id: string): Promise<CelestialEventWithObjects | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('celestial_events')
    .select(`
      *,
      event_objects(
        object_id,
        role,
        celestial_objects(name, object_type, slug)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`getEventById: ${error.message}`);
  return data as CelestialEventWithObjects | null;
}

/**
 * Get events related to a specific celestial object.
 */
export async function getEventsByObjectId(
  objectId: string,
  limit = 10
): Promise<CelestialEventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('event_objects')
    .select('celestial_events(*)')
    .eq('object_id', objectId)
    .limit(limit);

  if (error) throw new Error(`getEventsByObjectId: ${error.message}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.celestial_events).filter(Boolean) as CelestialEventRow[];
}
