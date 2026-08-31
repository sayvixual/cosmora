import { NextRequest, NextResponse } from 'next/server';
import { getCelestialObjectBySlug } from '@/lib/db/celestial-objects';
import { getMissionsByObjectId } from '@/lib/db/missions';
import { getEventsByObjectId } from '@/lib/db/celestial-events';

/**
 * GET /api/celestial-objects/[slug]
 * Returns detailed object with scientific facts, related missions and events.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const object = await getCelestialObjectBySlug(slug);

    if (!object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }

    // Enrich with missions and events
    const [missions, events] = await Promise.all([
      getMissionsByObjectId(object.id),
      getEventsByObjectId(object.id),
    ]);

    return NextResponse.json({
      data: {
        ...object,
        related_missions: missions,
        upcoming_events: events,
      },
    });
  } catch (error) {
    console.error('[/api/celestial-objects/[slug]]', error);
    return NextResponse.json(
      { error: 'Failed to fetch object details' },
      { status: 500 }
    );
  }
}
