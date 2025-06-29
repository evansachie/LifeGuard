import { useEffect, useRef, RefObject } from 'react';
import { EmergencyUserData } from '../types/emergency.types';

type Coordinates = [number, number];

export function useEmergencyMap(
  mapContainer: RefObject<HTMLDivElement>,
  isLoading: boolean,
  isDarkMode: boolean,
  userData: EmergencyUserData,
  coordinates: Coordinates
): RefObject<any> {
  const map = useRef<any>(null);

  useEffect(() => {
    if (isLoading || !mapContainer.current || map.current) return;

    const initializeMap = async () => {
      try {
        const token = import.meta.env.VITE_MAPBOX_API_KEY;
        if (!token) {
          console.error('Mapbox access token is not configured');
          if (mapContainer.current) {
            mapContainer.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-center p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }">
                <div>
                  <div class="text-2xl mb-2">📍</div>
                  <div class="font-medium mb-1">Map configuration required</div>
                  <div class="text-sm">${userData.location || 'Location not available'}</div>
                </div>
              </div>
            `;
          }
          return;
        }

        const mapboxModule = await import('mapbox-gl');
        const mapboxgl = (mapboxModule as any).default || mapboxModule;

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: isDarkMode
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/light-v11',
          center: coordinates,
          zoom: 12,
          attributionControl: false,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        if (userData.location) {
          new mapboxgl.Marker({ color: '#ef4444' })
            .setLngLat(coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Emergency Location</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">${userData.location}</p>
                </div>
              `)
            )
            .addTo(map.current);
        }

        // Handle cleanup
        return () => {
          if (map.current) {
            map.current.remove();
            map.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);

        // Show fallback on error using Tailwind classes
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }">
              <div>
                <div class="text-2xl mb-2">📍</div>
                <div class="font-medium mb-1">Map unavailable</div>
                <div class="text-sm">${userData.location || 'Location not available'}</div>
              </div>
            </div>
          `;
        }
      }
    };

    initializeMap();
  }, [isLoading, isDarkMode, userData, coordinates, mapContainer]);

  useEffect(() => {
    if (map.current && !isLoading) {
      try {
        const style = isDarkMode
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11';

        map.current.setStyle(style);
      } catch (error) {
        console.error('Error updating map style:', error);
      }
    }
  }, [isDarkMode, isLoading]);

  return map;
}
