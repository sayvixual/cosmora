import { NextRequest, NextResponse } from 'next/server';
import { getMissions, searchMissions } from '@/lib/db/missions';

/**
 * GET /api/missions
 * Query params: status, agency, search, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') ?? undefined;
    const agency = searchParams.get('agency') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);

    let missions;
    if (search) {
      missions = await searchMissions(search, limit);
    } else {
      missions = await getMissions({ status, agency, limit });
    }

    return NextResponse.json({ data: missions, count: missions.length });
  } catch (error) {
    console.error('[/api/missions]', error);
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}
