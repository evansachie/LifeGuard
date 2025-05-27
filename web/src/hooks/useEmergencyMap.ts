import { useEffect, useRef, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'react-toastify';
import { EmergencyUserData } from '../types/emergency.types';

type Coordinates = [number, number];

export function useEmergencyMap(
  mapContainer: RefObject<HTMLDivElement>,
  isLoading: boolean,
  isDarkMode: boolean,
  userData: EmergencyUserData,
  coordinates: Coordinates
): RefObject<mapboxgl.Map | null> {
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (isLoading || !mapContainer.current) return;

    const mapTimer = setTimeout(() => {
      if (map.current) return;

      try {
        if (mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: isDarkMode
              ? 'mapbox://styles/mapbox/dark-v11'
              : 'mapbox://styles/mapbox/streets-v11',
            center: coordinates,
            zoom: 12,
            attributionControl: false,
          });

          map.current.on('load', () => {
            if (!map.current) return;
            
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.current.addControl(
              new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
              }),
              'top-right'
            );
            map.current.addControl(
              new mapboxgl.AttributionControl({ compact: true }),
              'bottom-right'
            );
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Could not load location map');
      }
    }, 500);

    return () => {
      clearTimeout(mapTimer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isLoading, isDarkMode, userData.name, userData.location, coordinates, mapContainer]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(
        isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11'
      );
    }
  }, [isDarkMode]);

  return map;
}
