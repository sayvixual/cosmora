import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
      next: { revalidate: 3600 * 12 }, // Cache for 12 hours
    });

    if (!response.ok) {
      throw new Error(`NASA API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[NASA APOD API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch APOD' }, { status: 500 });
  }
}
