/**
 * Utility functions for handling geolocation data
 */

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Get the current user's geolocation
 * @returns Promise resolving to geolocation position
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Provide more detailed error information
        let errorMessage = 'Failed to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Unknown geolocation error';
        }
        console.warn(`Geolocation error: ${errorMessage}`, error);
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Check if geolocation API is available in the browser
 * @returns boolean indicating if geolocation is available
 */
export const isGeolocationAvailable = (): boolean => {
  return !!navigator.geolocation;
};
