export const getPollutionColor = (level) => {
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
