import { PollutionLevel } from '../types/pollutionTracker.types';

/**
 * Returns a color code based on the pollution level
 * @param level - The pollution level
 * @returns The color code as a string
 */
export function getPollutionColor(level: PollutionLevel): string {
  switch (level) {
    case 'low':
      return '#2ECC71'; // Green
    case 'medium':
    case 'moderate': // Support both spellings for compatibility
      return '#F39C12'; // Orange/Amber
    case 'high':
      return '#E74C3C'; // Red
    case 'veryhigh':
      return '#8E44AD'; // Purple
    case 'hazardous':
      return '#7D3C98'; // Dark Purple/Violet
    default:
      return '#95A5A6'; // Gray (default)
  }
}
