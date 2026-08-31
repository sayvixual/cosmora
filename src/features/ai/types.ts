export type TargetType = 
  | "planet" 
  | "nebula" 
  | "galaxy" 
  | "meteor" 
  | "moon" 
  | "star-cluster" 
  | "spacecraft" 
  | "deep-space";

export interface EphemerisHighlight {
  name: string;
  targetType?: TargetType;
  window: string;
  magnitude: string;
  bestInstrument: string;
  altitude?: string;
  coordinates?: {
    ra: string;
    dec: string;
  };
  filterRecommendation?: string;
}

export interface ObservationCartItem {
  id: string;
  targetName: string;
  targetType: TargetType;
  windowTime: string;
  magnitude: string;
  coordinates: {
    ra: string;
    dec: string;
  };
  bestInstrument: string;
  opticsFilter?: string;
  altitude?: string;
  notes?: string;
  addedAt: string;
  completed?: boolean;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  targetObject?: string;
  highlights?: EphemerisHighlight[];
  recommendations?: string[];
  suggestedPrompts?: string[];
  actionType?: "observe" | "photo" | "research" | "visit";
  sourceDataset?: string;
}

export interface AIQueryPreset {
  id: string;
  category: "tonight" | "astrophotography" | "deep-space" | "missions" | "science";
  label: string;
  query: string;
  target?: string;
}
