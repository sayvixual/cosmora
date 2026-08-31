import { createClient } from '@/lib/supabase/server';
import type { ObservationRow } from '@/lib/supabase/types';

/**
 * Get observations (all or by user_id for demo — no auth).
 */
export async function getObservations(options?: {
  userId?: string;
  objectId?: string;
  limit?: number;
}): Promise<ObservationRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from('observations')
    .select(`
      *,
      celestial_objects(name, slug, object_type),
      observation_media(id, storage_path, media_type, caption)
    `)
    .order('observed_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.objectId) {
    query = query.eq('object_id', options.objectId);
  }

  query = query.limit(options?.limit ?? 20);

  const { data, error } = await query;
  if (error) throw new Error(`getObservations: ${error.message}`);
  return data ?? [];
}

/**
 * Get a single observation by ID.
 */
export async function getObservationById(id: string): Promise<ObservationRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('observations')
    .select(`
      *,
      celestial_objects(name, slug, object_type),
      celestial_events(name, event_type),
      destinations(name, slug),
      observation_media(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`getObservationById: ${error.message}`);
  return data as ObservationRow | null;
}

/**
 * Create a new observation.
 */
export async function createObservation(
  data: Omit<ObservationRow, 'id' | 'created_at'>
): Promise<ObservationRow> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: created, error } = await supabase
    .from('observations')
    .insert(data as any)
    .select()
    .single();

  if (error) throw new Error(`createObservation: ${error.message}`);
  return created as ObservationRow;
}

/**
 * Update an existing observation.
 */
export async function updateObservation(
  id: string,
  data: Partial<ObservationRow>
): Promise<ObservationRow> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updated, error } = await (supabase as any)
    .from('observations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateObservation: ${error.message}`);
  return updated as ObservationRow;
}

/**
 * Delete an observation by ID.
 */
export async function deleteObservation(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('observations')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`deleteObservation: ${error.message}`);
}
