export type MissionCategory = 
  | "space_telescope" 
  | "interstellar_probe" 
  | "planetary_rover" 
  | "lunar_exploration" 
  | "space_station" 
  | "deep_space_orbiter";

export type MissionStatus = 
  | "active" 
  | "completed" 
  | "extended_mission" 
  | "interstellar" 
  | "en_route";

export interface MissionTelemetry {
  velocityKmS: number;               // Velocity relative to Sun or Earth (km/s)
  distanceFromEarthKm: number;       // Distance from Earth in km
  distanceFromEarthAU?: number;      // Distance in Astronomical Units (AU)
  distanceFromSunKm?: number;
  oneWayLightTimeSeconds?: number;   // One-way signal communication delay (seconds)
  roundTripLightTimeFormatted?: string; // Formatted light time (e.g. "22h 45m 12s")
  missionDurationDays: number;       // Elapsed mission duration (days)
  solCount?: number;                 // For rovers (e.g. Sol 1250)
  orbitType?: string;                // e.g. "Sun-Earth L2 Halo Orbit", "Interstellar Heliocentric", "Low Earth Orbit (418km)"
  powerSource: string;               // e.g. "5-Layer Kapton Solar Shield + Solar Array", "Multi-Mission RTG (Pu-238)"
}

export interface MissionInstrument {
  name: string;
  type: string;                      // e.g. "Infrared Spectrometer", "Laser Induced Breakdown", "Magnetometer"
  description: string;
  operationalStatus?: "active" | "standby" | "degraded";
}

export interface MissionDiscovery {
  title: string;
  year?: number;
  description: string;
  scientificImpact: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  designation?: string;
  agency: string;                    // NASA, ESA, JAXA, CSA, etc.
  internationalPartners?: string[];
  category: MissionCategory;
  status: MissionStatus;
  launchDate: string;                // ISO date or formatted (e.g. "2021-12-25")
  launchVehicle: string;             // e.g. "Ariane 5 ECA", "Titan IIIE-Centaur", "Atlas V 541"
  launchSite: string;                // e.g. "Kourou, French Guiana (Guiana Space Centre)"
  targetBody: string;                // e.g. "Deep Space / Cosmic Dawn (L2)", "Interstellar Medium", "Mars (Jezero Crater)"
  summary: string;
  highlight: string;
  imageUrl: string;
  modelType: "jwst" | "voyager" | "perseverance" | "artemis" | "iss" | "cassini" | "hubble" | "newhorizons";
  telemetry: MissionTelemetry;
  instruments: MissionInstrument[];
  keyDiscoveries: MissionDiscovery[];
  primaryObjectives: string[];
  trajectoryNodes?: {
    label: string;
    date: string;
    distance: string;
    description: string;
  }[];
}
