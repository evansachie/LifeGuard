/**
 * Formats a numeric value with specified decimal places
 * @param value - The value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string representation
 */
export const formatValue = (value: number, decimals: number = 1): string => {
  if (value === undefined || value === null) {
    return '—';
  }
  return value.toFixed(decimals);
};

/**
 * Gets a color based on the Air Quality Index value
 * @param aqi - Air Quality Index value
 * @returns CSS color string
 */
export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#4CAF50'; // Good (Green)
  if (aqi <= 100) return '#FFC107'; // Moderate (Yellow)
  if (aqi <= 150) return '#FF9800'; // Unhealthy for Sensitive Groups (Orange)
  if (aqi <= 200) return '#F44336'; // Unhealthy (Red)
  if (aqi <= 300) return '#9C27B0'; // Very Unhealthy (Purple)
  return '#880E4F'; // Hazardous (Maroon)
};

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

/**
 * Formats a time to a readable string
 * @param time - Time to format
 * @returns Formatted time string
 */
export const formatTime = (time: Date | string): string => {
  if (!time) return '';
  const t = typeof time === 'string' ? new Date(time) : time;
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
