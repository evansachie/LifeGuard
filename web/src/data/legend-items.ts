import { LegendItem } from '../types/pollutionTracker.types';

export const legendItems: LegendItem[] = [
  {
    color: '#2ECC71',
    label: 'Low Pollution',
    description: 'AQI 0-50. Air quality is considered satisfactory.',
  },
  {
    color: '#F39C12',
    label: 'Moderate Pollution',
    description: 'AQI 51-100. Acceptable air quality for most.',
  },
  {
    color: '#E74C3C',
    label: 'High Pollution',
    description: 'AQI 101-150. Unhealthy for sensitive groups.',
  },
  {
    color: '#8E44AD',
    label: 'Very Unhealthy',
    description: 'AQI 151-200. Health warnings for everyone.',
  },
  {
    color: '#7D3C98',
    label: 'Hazardous',
    description: 'AQI 201+. Emergency conditions alert.',
  },
];
