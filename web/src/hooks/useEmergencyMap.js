import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'react-toastify';

export function useEmergencyMap(mapContainer, isLoading, isDarkMode, userData, coordinates) {
  const map = useRef(null);

  useEffect(() => {
    if (isLoading || !mapContainer.current) return;

    const mapTimer = setTimeout(() => {
      if (map.current) return;

      try {
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
