import { z } from 'zod';
import { tool } from 'ai';
import { searchCelestialObjects, getCelestialObjectByCanonicalName } from '@/lib/db/celestial-objects';
import { getUpcomingEvents } from '@/lib/db/celestial-events';
import { getMissions } from '@/lib/db/missions';
import { getDestinations, searchDestinations } from '@/lib/db/destinations';
import { MoonPhase, Illumination, Body } from 'astronomy-engine';

// ============================================================
// COSMORA AI TOOLS — AI SDK v7 (uses `inputSchema`, not `parameters`)
// ============================================================

// ------------------------------------------------------------
// 1. DATABASE TOOLS
// ------------------------------------------------------------

const searchObjectsTool = tool({
  description: 'Search for celestial objects by name, type, or description.',
  inputSchema: z.object({
    query: z.string().describe('Search term'),
    type: z.string().optional().describe('Filter by object type'),
    limit: z.number().optional().default(5),
  }),
  execute: async (args) => {
    try {
      const results = await searchCelestialObjects(args.query, args.limit ?? 5);
      const filtered = args.type ? results.filter((o) => o.object_type === args.type) : results;
      return { found: filtered.length > 0, count: filtered.length, results: filtered };
    } catch (err) {
      return { error: String(err) };
    }
  },
});

const getObjectDetailsTool = tool({
  description: 'Get comprehensive details about a specific celestial object. Use canonical name.',
  inputSchema: z.object({
    canonical_name: z.string().describe('e.g. "mars", "andromeda"'),
  }),
  execute: async (args) => {
    try {
      const obj = await getCelestialObjectByCanonicalName(args.canonical_name);
      return { found: !!obj, object: obj };
    } catch (err) {
      return { error: String(err) };
    }
  },
});

const getUpcomingEventsTool = tool({
  description: 'Get upcoming astronomical events.',
  inputSchema: z.object({
    type: z.string().optional().describe('Event type filter'),
    limit: z.number().optional().default(5),
  }),
  execute: async (args) => {
    try {
      const events = await getUpcomingEvents({ type: args.type, limit: args.limit });
      return { found: events.length > 0, events };
    } catch (err) {
      return { error: String(err) };
    }
  },
});

const getMissionsTool = tool({
  description: 'Get space missions information.',
  inputSchema: z.object({
    status: z.string().optional().describe('active, past, or planned'),
    agency: z.string().optional().describe('Space agency name'),
  }),
  execute: async (args) => {
    try {
      const missions = await getMissions({ status: args.status, agency: args.agency, limit: 5 });
      return { found: missions.length > 0, missions };
    } catch (err) {
      return { error: String(err) };
    }
  },
});

const getDestinationsTool = tool({
  description: 'Find real-world astronomy destinations and dark-sky parks.',
  inputSchema: z.object({
    query: z.string().optional().describe('Search term for destinations'),
  }),
  execute: async (args) => {
    try {
      const destinations = args.query
        ? await searchDestinations(args.query, 5)
        : await getDestinations({ limit: 5 });
      return { found: destinations.length > 0, destinations };
    } catch (err) {
      return { error: String(err) };
    }
  },
});

// ------------------------------------------------------------
// 2. NASA & EXTERNAL API TOOLS
// ------------------------------------------------------------

const searchNasaImagesTool = tool({
  description: 'Search the NASA Image and Video Library for historical space photos.',
  inputSchema: z.object({
    query: z.string().describe('Search term e.g. "Andromeda", "Apollo 11"'),
  }),
  execute: async (args) => {
    try {
      const res = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(args.query)}&media_type=image`
      );
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = data.collection.items.slice(0, 3).map((item: any) => ({
        title: item.data[0].title,
        description: (item.data[0].description ?? '').substring(0, 200) + '...',
        image_url: item.links[0].href,
        date_created: item.data[0].date_created,
      }));
      return { query: args.query, count: items.length, images: items };
    } catch {
      return { error: 'Failed to search NASA images.' };
    }
  },
});

const getMarsRoverPhotosTool = tool({
  description: 'Get the latest photos from NASA Mars Rovers (Perseverance).',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
      const res = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${apiKey}`
      );
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const photos = data.latest_photos.slice(0, 3).map((p: any) => ({
        rover: p.rover.name,
        camera: p.camera.full_name,
        earth_date: p.earth_date,
        sol: p.sol,
        image_url: p.img_src,
      }));
      return { photos };
    } catch {
      return { error: 'Failed to fetch Mars Rover photos.' };
    }
  },
});

const getEpicEarthImageryTool = tool({
  description: 'Get the latest full-disk image of Earth from the DSCOVR EPIC satellite.',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
      const res = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`);
      const data = await res.json();
      if (!data || data.length === 0) return { error: 'No EPIC images available.' };
      const latest = data[0];
      const dateParts = (latest.date as string).split(' ')[0].split('-');
      const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/png/${latest.image}.png`;
      return { caption: latest.caption as string, date: latest.date as string, image_url: imageUrl };
    } catch {
      return { error: 'Failed to fetch EPIC Earth imagery.' };
    }
  },
});

// ------------------------------------------------------------
// City coordinate cache — skip geocode API for known cities
// (saves ~1-2s per request on Vercel's tight timeout)
// ------------------------------------------------------------
const CITY_CACHE: Record<string, { name: string; country: string; latitude: number; longitude: number; timezone: string }> = {
  // Indonesia
  'bandar lampung': { name: 'Bandar Lampung', country: 'Indonesia', latitude: -5.4292, longitude: 105.2618, timezone: 'Asia/Jakarta' },
  'lampung': { name: 'Bandar Lampung', country: 'Indonesia', latitude: -5.4292, longitude: 105.2618, timezone: 'Asia/Jakarta' },
  'jakarta': { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  'bandung': { name: 'Bandung', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
  'surabaya': { name: 'Surabaya', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  'yogyakarta': { name: 'Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
  'medan': { name: 'Medan', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
  'makassar': { name: 'Makassar', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
  'bali': { name: 'Denpasar', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  'denpasar': { name: 'Denpasar', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  'palembang': { name: 'Palembang', country: 'Indonesia', latitude: -2.9761, longitude: 104.7754, timezone: 'Asia/Jakarta' },
  'semarang': { name: 'Semarang', country: 'Indonesia', latitude: -6.9932, longitude: 110.4203, timezone: 'Asia/Jakarta' },
  'malang': { name: 'Malang', country: 'Indonesia', latitude: -7.9797, longitude: 112.6304, timezone: 'Asia/Jakarta' },
  'bogor': { name: 'Bogor', country: 'Indonesia', latitude: -6.5971, longitude: 106.8060, timezone: 'Asia/Jakarta' },
  // World
  'london': { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  'new york': { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  'tokyo': { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  'singapore': { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  'sydney': { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  'dubai': { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
};

function resolveCity(location: string) {
  const key = location.toLowerCase().trim();
  return CITY_CACHE[key] ?? null;
}

const geocodeLocationTool = tool({
  description: 'Convert a city or location name into geographic coordinates (latitude, longitude). ALWAYS use this first when the user mentions a specific city or location name before calling getWeatherForecast.',
  inputSchema: z.object({
    location: z.string().describe('City or location name e.g. "Jakarta", "London", "New York"'),
  }),
  execute: async (args) => {
    // Check cache first — saves 1-2s on known cities
    const cached = resolveCity(args.location);
    if (cached) return cached;
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.location)}&count=1&language=en&format=json`
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        return { error: `Could not find coordinates for "${args.location}". Try a more specific city name.` };
      }
      const result = data.results[0];
      return {
        name: result.name as string,
        country: result.country as string,
        latitude: result.latitude as number,
        longitude: result.longitude as number,
        timezone: result.timezone as string,
      };
    } catch {
      return { error: 'Failed to geocode location.' };
    }
  },
});

// ------------------------------------------------------------
// COMBINED OBSERVATION REPORT TOOL
// Does geocode + weather + moon phase in ONE tool call.
// Cuts LLM round-trips from 4 → 2 (saves ~4-6s on Vercel).
// ------------------------------------------------------------
const getObservationReportTool = tool({
  description:
    'PREFERRED TOOL for location-based stargazing queries. Given a city/location name, returns weather conditions AND moon phase in a single call — much faster than calling geocodeLocation, getWeatherForecast, and getObservationConditions separately. Use this whenever a user asks about observing from a specific city.',
  inputSchema: z.object({
    location: z.string().describe('City or location name e.g. "Bandar Lampung", "Jakarta", "Tokyo"'),
  }),
  execute: async (args) => {
    try {
      // Step 1: Resolve coordinates (cache-first, then API)
      let coords = resolveCity(args.location);
      if (!coords) {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.location)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          return { error: `Could not find "${args.location}". Try a more specific city name.` };
        }
        const r = geoData.results[0];
        coords = { name: r.name, country: r.country, latitude: r.latitude, longitude: r.longitude, timezone: r.timezone };
      }

      // Step 2: Fetch weather + moon phase IN PARALLEL
      const [weatherRes, moonData] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,cloud_cover,weather_code,visibility&timezone=auto`
        ).then((r) => r.json()),
        (async () => {
          const date = new Date();
          const phase = MoonPhase(date);
          const illum = Illumination(Body.Moon, date);
          let phaseName = '';
          if (phase < 22.5 || phase > 337.5) phaseName = 'New Moon';
          else if (phase < 67.5) phaseName = 'Waxing Crescent';
          else if (phase < 112.5) phaseName = 'First Quarter';
          else if (phase < 157.5) phaseName = 'Waxing Gibbous';
          else if (phase < 202.5) phaseName = 'Full Moon';
          else if (phase < 247.5) phaseName = 'Waning Gibbous';
          else if (phase < 292.5) phaseName = 'Last Quarter';
          else phaseName = 'Waning Crescent';
          return {
            moon_phase: phaseName,
            illumination_percent: Math.round(illum.phase_fraction * 100),
          };
        })(),
      ]);

      const cloud = weatherRes.current.cloud_cover as number;
      const illumPct = moonData.illumination_percent;

      return {
        // Location
        location_name: coords.name,
        country: coords.country,
        latitude: coords.latitude,
        longitude: coords.longitude,
        // Weather
        temperature_celsius: weatherRes.current.temperature_2m as number,
        cloud_cover_percent: cloud,
        visibility_meters: weatherRes.current.visibility as number,
        observation_quality: cloud < 10 ? 'Excellent' : cloud < 30 ? 'Good' : cloud < 60 ? 'Fair' : 'Poor',
        is_clear: cloud < 30,
        // Moon
        moon_phase: moonData.moon_phase,
        moon_illumination_percent: illumPct,
        dark_sky_quality: illumPct < 20 ? 'Excellent (Dark Sky)' : illumPct < 50 ? 'Moderate' : 'Poor (Moonlight Interference)',
        // Combined verdict
        overall_verdict:
          cloud < 30 && illumPct < 50
            ? '✅ Great night for stargazing!'
            : cloud >= 60
            ? '❌ Too cloudy — observation not recommended'
            : '⚠️ Possible — manage moonlight and cloud cover',
      };
    } catch (err) {
      return { error: `Observation report failed: ${String(err)}` };
    }
  },
});

const getWeatherForecastTool = tool({
  description: 'Get current weather and cloud cover for a location to assess stargazing/observation conditions. Requires latitude and longitude — use geocodeLocation tool first if user provides a city name.',
  inputSchema: z.object({
    latitude: z.number().describe('Latitude of the observation site'),
    longitude: z.number().describe('Longitude of the observation site'),
    location_name: z.string().optional().describe('Human-readable location name for context'),
  }),
  execute: async (args) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m,cloud_cover,weather_code,visibility&timezone=auto`
      );
      const data = await res.json();
      const cloud = data.current.cloud_cover as number;
      return {
        location: args.location_name ?? `${args.latitude}, ${args.longitude}`,
        temperature_celsius: data.current.temperature_2m as number,
        cloud_cover_percent: cloud,
        visibility_meters: data.current.visibility as number,
        is_good_for_observation: cloud < 30,
        observation_quality: cloud < 10 ? 'Excellent' : cloud < 30 ? 'Good' : cloud < 60 ? 'Fair' : 'Poor',
        notes: cloud < 30 ? '✅ Clear skies — great for observation tonight!' : `⚠️ ${cloud}% cloud cover — conditions may limit visibility.`,
      };
    } catch {
      return { error: 'Failed to fetch weather data.' };
    }
  },
});

const getObservationConditionsTool = tool({
  description: 'Calculate moon phase and illumination percentage for tonight.',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const date = new Date();
      const phase = MoonPhase(date);
      const illum = Illumination(Body.Moon, date);
      let phaseName = '';
      if (phase < 22.5 || phase > 337.5) phaseName = 'New Moon';
      else if (phase < 67.5) phaseName = 'Waxing Crescent';
      else if (phase < 112.5) phaseName = 'First Quarter';
      else if (phase < 157.5) phaseName = 'Waxing Gibbous';
      else if (phase < 202.5) phaseName = 'Full Moon';
      else if (phase < 247.5) phaseName = 'Waning Gibbous';
      else if (phase < 292.5) phaseName = 'Last Quarter';
      else phaseName = 'Waning Crescent';
      const illuminationPercent = Math.round(illum.phase_fraction * 100);
      return {
        date: date.toISOString().split('T')[0],
        moon_phase: phaseName,
        illumination_percent: illuminationPercent,
        deep_sky_quality: illuminationPercent < 30 ? 'Excellent (Dark Sky)' : 'Poor (Moonlight Interference)',
      };
    } catch {
      return { error: 'Failed to calculate astronomy data.' };
    }
  },
});

const searchAstrophysicsPapersTool = tool({
  description: 'Search arXiv for the latest peer-reviewed astrophysics research papers.',
  inputSchema: z.object({
    query: z.string().describe('Search topic e.g. "exoplanet atmosphere", "black hole"'),
  }),
  execute: async (args) => {
    try {
      const res = await fetch(
        `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(args.query)}+AND+cat:astro-ph&sortBy=submittedDate&sortOrder=descending&max_results=3`
      );
      const text = await res.text();
      const entries = text.split('<entry>').slice(1).map((entry) => {
        const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
        const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
        const linkMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
        const authorMatches = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => m[1]);
        return {
          title: titleMatch ? titleMatch[1].replace(/\n/g, ' ').trim() : 'Unknown',
          summary: summaryMatch
            ? summaryMatch[1].replace(/\n/g, ' ').trim().substring(0, 300) + '...'
            : '',
          url: linkMatch ? linkMatch[1] : '',
          authors:
            authorMatches.slice(0, 3).join(', ') +
            (authorMatches.length > 3 ? ' et al.' : ''),
        };
      });
      return { count: entries.length, papers: entries };
    } catch {
      return { error: 'Failed to fetch research papers.' };
    }
  },
});

const searchExoplanetsTool = tool({
  description: 'Search the NASA Exoplanet Archive for verified exoplanet data.',
  inputSchema: z.object({
    planet_name: z.string().regex(/^[a-zA-Z0-9\s\-]+$/, "Invalid planet name format").describe('e.g. "Kepler-186 f", "TRAPPIST-1 e"'),
  }),
  execute: async (args) => {
    try {
      const q = `select pl_name,hostname,discoverymethod,disc_year,pl_rade,pl_masse,sy_dist from ps where pl_name like '%${args.planet_name}%'`;
      const res = await fetch(
        `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(q)}&format=json`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await res.json();
      if (!data || data.length === 0) return { error: 'Exoplanet not found in NASA archive.' };
      const p = data[0];
      return {
        name: p.pl_name as string,
        host_star: p.hostname as string,
        discovery_method: p.discoverymethod as string,
        discovery_year: p.disc_year as number,
        radius_earth_radii: p.pl_rade as number,
        mass_earth_masses: p.pl_masse as number,
        distance_parsecs: p.sy_dist as number,
      };
    } catch {
      return { error: 'Failed to fetch exoplanet data.' };
    }
  },
});

// ============================================================
// Export all tools — AI SDK v7 ToolSet format
// ============================================================
export const cosmoraTools = {
  // ⚡ FAST PATH — use this for ALL location-based observation queries
  getObservationReport: getObservationReportTool,
  // Standard tools
  searchObjects: searchObjectsTool,
  getObjectDetails: getObjectDetailsTool,
  getUpcomingEvents: getUpcomingEventsTool,
  getMissions: getMissionsTool,
  getDestinations: getDestinationsTool,
  searchNasaImages: searchNasaImagesTool,
  getMarsRoverPhotos: getMarsRoverPhotosTool,
  getEpicEarthImagery: getEpicEarthImageryTool,
  // Kept for backward compat / non-observation queries
  geocodeLocation: geocodeLocationTool,
  getWeatherForecast: getWeatherForecastTool,
  getObservationConditions: getObservationConditionsTool,
  searchAstrophysicsPapers: searchAstrophysicsPapersTool,
  searchExoplanets: searchExoplanetsTool,
};
