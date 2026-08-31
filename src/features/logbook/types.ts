export type LogCategory = 
  | "stargazing"
  | "astrophotography"
  | "expedition"
  | "research";

export interface SkyCondition {
  bortleScale: number; // 1 to 9
  seeingIndex: string; // e.g. "I (Excellent)", "II (Good)", "III (Moderate)"
  transparencyPercent: number; // 0 - 100
  moonPhase: string; // e.g. "New Moon", "Waxing Crescent (14%)", "Full Moon"
  temperatureC?: number;
  humidityPercent?: number;
}

export interface ImagingHardware {
  telescopeOrLens: string;
  apertureMm?: number;
  focalLengthMm?: number;
  mountType?: string;
  cameraSensor?: string;
  iso?: number;
  exposureSeconds?: number;
  totalIntegrationMinutes?: number;
  filtersUsed?: string[];
  subFramesCount?: number;
}

export interface LogbookEntry {
  id: string;
  title: string;
  category: LogCategory;
  targetObject: string;
  targetType: "planet" | "galaxy" | "nebula" | "star_cluster" | "meteor" | "comet" | "spacecraft" | "event";
  observerName: string;
  observerRole: string; // "Amateur Astrophotographer" | "Research Astronomer" | "Field Observer"
  date: string; // YYYY-MM-DD
  timeUtc: string; // HH:MM UTC
  locationName: string;
  coordinates?: string;
  altitudeM?: number;
  summary: string;
  detailedNotes: string;
  scientificFindings?: string[];
  skyCondition: SkyCondition;
  imagingHardware?: ImagingHardware;
  imageUrl?: string;
  tags: string[];
  verified: boolean;
  isCustom?: boolean;
}

export interface LogbookStats {
  totalSessions: number;
  totalDarkSkyHours: number;
  targetsObserved: number;
  avgBortle: number;
  verifiedDiscoveries: number;
}
