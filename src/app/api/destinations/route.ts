import { NextRequest, NextResponse } from 'next/server';
import { getDestinations, searchDestinations, getNearbyDestinations } from '@/lib/db/destinations';

/**
 * GET /api/destinations
 * Query params: search, lat, lon, radius (km), minSkyQuality, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') ?? undefined;
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 500;
    const minSkyQuality = searchParams.get('minSkyQuality')
      ? parseFloat(searchParams.get('minSkyQuality')!)
      : undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);

    let destinations;

    if (lat !== undefined && lon !== undefined) {
      destinations = await getNearbyDestinations(lat, lon, radius, limit);
    } else if (search) {
      destinations = await searchDestinations(search, limit);
    } else {
      destinations = await getDestinations({ minSkyQuality, limit });
    }

    return NextResponse.json({ data: destinations, count: destinations.length });
  } catch (error) {
    console.error('[/api/destinations]', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
