export interface ObservationContext {
  bestSeason: string;
  skyQuality: number; // Bortle scale (1-9)
  sqmRating?: string; // E.g. "21.95 mag/arcsec²"
  clearNightsPerYear?: number; // E.g. 330
  humidityAverage?: string; // E.g. "< 10%" or "Very Dry"
  lightPollutionClass: string;
  visibilityNotes: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  requirements?: string[];
}

export type DestinationCategory = "observatory" | "dark_sky" | "analog_habitat" | "historic";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  category?: DestinationCategory;
  description: string;
  countryCode: string;
  region: string;
  elevationM: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  websiteUrl?: string;
  managedBy?: string;
  establishedYear?: number;
  instruments?: string[];
  highlight?: string;
  keyDiscoveries?: string[];
  observationContext: ObservationContext;
  activities: Activity[];
  relatedObjectIds?: string[];
}
