type PollutionLevel = 'high' | 'medium' | 'low';

/**
 * Returns a color code based on pollution level
 * @param level - The pollution level (high, medium, low)
 * @returns A hex color code
 */
export const getPollutionColor = (level: PollutionLevel): string => {
  switch (level) {
    case 'high':
      return '#FF4444';
    case 'medium':
      return '#FFB344';
    case 'low':
      return '#4CAF50';
    default:
      return '#FF4444';
  }
};
