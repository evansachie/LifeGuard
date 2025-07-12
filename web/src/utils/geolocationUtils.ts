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
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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
