export type PollutionLevel = 'high' | 'medium' | 'low';
export type PollutionType = 'aqi' | 'pm25' | 'pm10' | string;

/**
 * Determines pollution level based on value and type
 * @param value - Numeric value of pollution measurement
 * @param type - Type of pollution measurement
 * @returns Pollution level category
 */
export const getPollutionLevel = (value: number, type: PollutionType): PollutionLevel => {
  switch (type) {
    case 'aqi':
      return value > 150 ? 'high' : value > 50 ? 'medium' : 'low';
    case 'pm25':
      return value > 35 ? 'high' : value > 12 ? 'medium' : 'low';
    case 'pm10':
      return value > 150 ? 'high' : value > 50 ? 'medium' : 'low';
    default:
      return 'medium';
  }
};
