import React, { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker, Source, Layer } from 'react-map-gl';
import './PollutionTracker.css';
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';

// Mapbox worker setup for Vite
mapboxgl.workerClass = await import('mapbox-gl/dist/mapbox-gl-csp-worker').then(
  (m) => m.default
);

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

const INITIAL_VIEW_STATE = {
  latitude: 40.6935,
  longitude: -73.9866,
  zoom: 13,
  bearing: 0,
  pitch: 0,
};

// Mock data for pollution zones
const pollutionZones = [
  {
    id: '1',
    coordinates: [40.6935, -73.9866],
    level: 'high',
    radius: 500,
    data: {
      aqi: 156,
      pm25: 75.2,
      pm10: 142.8,
    }
  },
  {
    id: '2',
    coordinates: [40.6895, -73.9845],
    level: 'medium',
    radius: 300,
    data: {
      aqi: 89,
      pm25: 35.5,
      pm10: 82.3,
    }
  },
  {
    id: '3',
    coordinates: [40.6915, -73.9825],
    level: 'low',
    radius: 400,
    data: {
      aqi: 42,
      pm25: 12.8,
      pm10: 38.5,
    }
  },
];

const legendItems = [
  { color: '#FF4444', label: 'High Pollution', description: 'AQI > 150' },
  { color: '#FFB344', label: 'Medium Pollution', description: 'AQI 51-150' },
  { color: '#4CAF50', label: 'Low Pollution', description: 'AQI 0-50' },
];

const Legend = () => (
  <div className="legend">
    <h3><FaInfoCircle /> Pollution Levels</h3>
    {legendItems.map((item, index) => (
      <div key={index} className="legend-item">
        <div className="legend-color" style={{ backgroundColor: item.color }} />
        <div className="legend-info">
          <span className="legend-label">{item.label}</span>
          <span className="legend-description">{item.description}</span>
        </div>
      </div>
    ))}
  </div>
);

const PollutionInfo = ({ zone }) => (
  <div className="pollution-info">
    <h3>Pollution Data</h3>
    <div className="info-grid">
      <div className="info-item">
        <span className="label">AQI</span>
        <span className="value">{zone.data.aqi}</span>
      </div>
      <div className="info-item">
        <span className="label">PM2.5</span>
        <span className="value">{zone.data.pm25}</span>
      </div>
      <div className="info-item">
        <span className="label">PM10</span>
        <span className="value">{zone.data.pm10}</span>
      </div>
    </div>
  </div>
);

const getPollutionColor = (level) => {
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

export default function PollutionTracker({ isDarkMode }) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedZone, setSelectedZone] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewState(prev => ({
          ...prev,
          latitude,
          longitude
        }));
      });
    }
  }, []);

  const geojsonData = {
    type: 'FeatureCollection',
    features: pollutionZones.map(zone => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [zone.coordinates[1], zone.coordinates[0]]
      },
      properties: {
        id: zone.id,
        level: zone.level,
        radius: zone.radius
      }
    }))
  };

  return (
    <div className={`pollution-tracker ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="map-container">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle={isDarkMode ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/light-v10"}
          mapboxAccessToken={MAPBOX_API_KEY}
        >
          <NavigationControl position="top-right" />
          
          {/* Render pollution zones */}
          {pollutionZones.map(zone => (
            <Source
              key={zone.id}
              type="geojson"
              data={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [zone.coordinates[1], zone.coordinates[0]]
                },
                properties: {
                  level: zone.level
                }
              }}
            >
              <Layer
                type="circle"
                paint={{
                  'circle-radius': zone.radius / 50,
                  'circle-color': getPollutionColor(zone.level),
                  'circle-opacity': 0.6,
                  'circle-blur': 0.5,
                }}
                onClick={() => setSelectedZone(zone)}
              />
            </Source>
          ))}

          {/* User location marker */}
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
        
        {selectedZone && (
          <PollutionInfo zone={selectedZone} />
        )}
      </div>
    </div>
  );
}
