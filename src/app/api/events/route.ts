import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/db/celestial-events';

/**
 * GET /api/events
 * Query params: type, limit, from (ISO), to (ISO), objectId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;

    const events = await getUpcomingEvents({ type, limit, from, to });

    return NextResponse.json({ data: events, count: events.length });
  } catch (error) {
    console.error('[/api/events]', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
