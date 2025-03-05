/**
 * Format a value to a specified number of decimal places
 * @param {number|string} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted value
 */
export const formatValue = (value, decimals = 1) => {
    return typeof value === 'number' ? value.toFixed(decimals) : '0.0';
};

/**
 * Get color for Air Quality Index (AQI)
 * @param {number} aqi - Air Quality Index value
 * @returns {string} - Color code
 */
export const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
};
