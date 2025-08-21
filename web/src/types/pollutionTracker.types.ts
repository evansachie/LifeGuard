// Define the valid pollution level values
export type PollutionLevel = 'low' | 'medium' | 'moderate' | 'high' | 'veryhigh' | 'hazardous';

export interface PollutionData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2?: number;
  co2?: number;
  so2?: number;
  o3?: number;
  [key: string]: number | undefined;
}

export interface PollutionZone {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  radius: number;
  level: PollutionLevel;
  data: PollutionData;
  description?: string;
  isRealTime?: boolean;
}

export interface LegendItem {
  color: string;
  label: string;
  description: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}
