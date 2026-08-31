import { NextRequest, NextResponse } from 'next/server';
import { getObservations, createObservation, deleteObservation } from '@/lib/db/observations';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/observations
 * Query params: userId, objectId, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId') ?? undefined;
    const objectId = searchParams.get('objectId') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);

    const observations = await getObservations({ userId, objectId, limit });

    return NextResponse.json({ data: observations, count: observations.length });
  } catch (error) {
    console.error('[/api/observations GET]', error);
    return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 });
  }
}

/**
 * POST /api/observations
 * Body: { object_id?, event_id?, destination_id?, observed_at, notes, equipment, visibility_context }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const observation = await createObservation({
      user_id: user.id,
      object_id: body.object_id ?? null,
      event_id: body.event_id ?? null,
      destination_id: body.destination_id ?? null,
      observed_at: body.observed_at ?? new Date().toISOString(),
      location: null,
      notes: body.notes ?? null,
      equipment: body.equipment ?? {},
      visibility_context: body.visibility_context ?? {},
    });

    return NextResponse.json({ data: observation }, { status: 201 });
  } catch (error) {
    console.error('[/api/observations POST]', error);
    return NextResponse.json({ error: 'Failed to create observation' }, { status: 500 });
  }
}

/**
 * DELETE /api/observations?id=<id>
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Relying on RLS for ownership verification
    // Since we use the authenticated client in deleteObservation, 
    // it will silently fail or delete 0 rows if they don't own it.
    await deleteObservation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/observations DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete observation' }, { status: 500 });
  }
}
