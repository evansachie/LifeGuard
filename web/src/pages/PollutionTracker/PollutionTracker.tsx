import React, { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RiAlertLine } from 'react-icons/ri';
import Legend from '../../components/PollutionTracker/Legend';
import PollutionInfo from '../../components/PollutionTracker/PollutionInfo';
import PollutionZones from '../../components/PollutionTracker/PollutionZones';
import { INITIAL_VIEW_STATE } from '../../data/initial-view-state';
import { PollutionZone, MapViewState } from '../../types/pollutionTracker.types';
import './PollutionTracker.css';
import '../../types/mapbox-gl.d.ts';

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface PollutionTrackerProps {
  isDarkMode: boolean;
}

const PollutionTracker = ({ isDarkMode }: PollutionTrackerProps) => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [selectedZone, setSelectedZone] = useState<PollutionZone | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    import('mapbox-gl/dist/mapbox-gl-csp-worker')
      .then((workerModule) => {
        // Access mapboxgl from global scope instead of import
        const mapboxgl = (window as unknown as { mapboxgl: { workerClass: unknown } }).mapboxgl;
        if (mapboxgl && workerModule.default) {
          mapboxgl.workerClass = workerModule.default;
        }
      })
      .catch((err) => {
        console.error('Error loading mapbox worker:', err);
      });
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewState((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleMapClick = (): void => {
    setSelectedZone(null);
  };

  const handleZoneClick = (zone: PollutionZone): void => {
    setSelectedZone(zone);
  };

  const handleMapLoad = (): void => {
    setMapLoaded(true);
  };

  return (
    <div className={`pollution-tracker ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="construction-banner">
        <RiAlertLine size={16} /> Page Under Construction
      </div>
      <div className="map-container">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle={
            isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
          }
          mapboxAccessToken={MAPBOX_API_KEY}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
          attributionControl={false}
          reuseMaps
        >
          <NavigationControl position="top-right" />
          <PollutionZones onZoneClick={handleZoneClick} />
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="bottom"
            >
              <div className="location-marker">
                <FaMapMarkerAlt />
              </div>
            </Marker>
          )}
        </Map>
        <Legend />
        {selectedZone && <PollutionInfo zone={selectedZone} />}
      </div>
    </div>
  );
};

export default PollutionTracker;
