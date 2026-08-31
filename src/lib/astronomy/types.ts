export type ObjectType =
  | 'planet'
  | 'moon'
  | 'star'
  | 'galaxy'
  | 'nebula'
  | 'exoplanet'
  | 'asteroid'
  | 'comet'
  | 'star-cluster'
  | 'black-hole'
  | 'other';

export interface SpaceObject {
  id: string;
  objectType: ObjectType;
  name: string;
  canonicalName: string;
  description: string;
  rightAscension?: number;
  declination?: number;
  distanceValue?: number;
  distanceUnit?: 'pc' | 'ly' | 'au' | 'km';
  magnitude?: number;
  metadata: Record<string, unknown>;
  status: 'active' | 'deprecated';
}

export interface CelestialEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  relatedObjectIds: string[];
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  launchDate?: Date;
  status: 'planned' | 'active' | 'completed' | 'failed';
  agencies: string[];
  targetObjectIds: string[];
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
}

export interface Observation {
  id: string;
  objectId: string;
  observer: string;
  date: Date;
  notes: string;
  equipment?: string;
  conditions?: string;
}

export interface ResearchReference {
  id: string;
  title: string;
  authors: string[];
  publicationDate: Date;
  url: string;
  relatedObjectIds: string[];
}
