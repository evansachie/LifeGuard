export const getPollutionLevel = (value, type) => {
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
