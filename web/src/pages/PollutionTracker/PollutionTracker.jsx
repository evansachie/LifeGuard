import React, { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Legend from '../../components/PollutionTracker/Legend';
import PollutionInfo from '../../components/PollutionTracker/PollutionInfo';
import PollutionZones from '../../components/PollutionTracker/PollutionZones';
import { INITIAL_VIEW_STATE } from '../../data/initial-view-state';
import './PollutionTracker.css';

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

const PollutionTracker = ({ isDarkMode }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedZone, setSelectedZone] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    import('mapbox-gl/dist/mapbox-gl-csp-worker').then((workerModule) => {
      mapboxgl.workerClass = workerModule.default;
    });
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      });
    }
  }, []);

  const handleMapClick = () => {
    setSelectedZone(null);
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  return (
    <div className={`pollution-tracker ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="map-container">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle={
            isDarkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10'
          }
          mapboxAccessToken={MAPBOX_API_KEY}
          onClick={handleMapClick}
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
