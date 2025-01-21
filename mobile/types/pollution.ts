export type PollutionLevel = 'high' | 'medium' | 'low';

export interface PollutionZone {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  level: PollutionLevel;
  radius: number; // in meters
}

export interface MapStyle {
  version: number;
  name: string;
  sources: Record<string, any>;
  layers: Array<Record<string, any>>;
}

export interface LegendItem {
  color: string;
  label: string;
}
