import { NextRequest, NextResponse } from 'next/server';
import { getCelestialObjects, searchCelestialObjects, getCelestialObjectsByType } from '@/lib/db/celestial-objects';

/**
 * GET /api/celestial-objects
 * Query params: search, type, limit, offset
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') ?? '';
    const type = searchParams.get('type') ?? '';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    let objects;

    if (search) {
      objects = await searchCelestialObjects(search, limit);
    } else if (type) {
      objects = await getCelestialObjectsByType(type, limit);
    } else {
      objects = await getCelestialObjects({ limit, offset });
    }

    return NextResponse.json({
      data: objects,
      count: objects.length,
      meta: { search, type, limit, offset },
    });
  } catch (error) {
    console.error('[/api/celestial-objects]', error);
    return NextResponse.json(
      { error: 'Failed to fetch celestial objects' },
      { status: 500 }
    );
  }
}
