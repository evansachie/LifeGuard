import { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdAir } from 'react-icons/md';
import Legend from '../../components/PollutionTracker/Legend';
import PollutionInfo from '../../components/PollutionTracker/PollutionInfo';
import PollutionZones from '../../components/PollutionTracker/PollutionZones';
import { INITIAL_VIEW_STATE } from '../../data/initial-view-state';
import { PollutionZone, MapViewState } from '../../types/pollutionTracker.types';
import { getCurrentPosition, isGeolocationAvailable } from '../../utils/geolocationUtils';
import { useBLE } from '../../contexts/BLEContext';
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
  const [liveZones, setLiveZones] = useState<PollutionZone[]>([]);

  // Get live Arduino sensor data
  const { latestSensorData, connectedDevice } = useBLE();

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
    if (isGeolocationAvailable()) {
      getCurrentPosition()
        .then((position) => {
          const { latitude, longitude } = position;
          setUserLocation({ latitude, longitude });
          setViewState((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          console.log('📍 Real location obtained for pollution tracker:', { latitude, longitude });
        })
        .catch((error) => {
          console.error('Error getting user location:', error);
          // Fallback to default location (Kumasi) if geolocation fails
          const fallbackLocation = { latitude: 6.6885, longitude: -1.6244 };
          setUserLocation(fallbackLocation);
          setViewState((prev) => ({
            ...prev,
            ...fallbackLocation,
          }));
          console.warn('Using fallback location (Kumasi) due to geolocation error');
        });
    } else {
      console.warn('Geolocation not available, using default location');
      const defaultLocation = { latitude: 6.6885, longitude: -1.6244 };
      setUserLocation(defaultLocation);
      setViewState((prev) => ({
        ...prev,
        ...defaultLocation,
      }));
    }
  }, []);

  // Create live pollution zones based on real-time Arduino data and current location
  useEffect(() => {
    if (
      connectedDevice &&
      latestSensorData &&
      userLocation &&
      latestSensorData.environmental?.airQuality?.aqi &&
      latestSensorData.environmental.airQuality.aqi > 0
    ) {
      const aqi = latestSensorData.environmental.airQuality.aqi;
      const co2 = latestSensorData.environmental.airQuality.co2 || 400;

      // Determine pollution level based on AQI
      let level: 'low' | 'moderate' | 'medium' | 'high' | 'veryhigh';
      if (aqi <= 50) {
        level = 'low';
      } else if (aqi <= 100) {
        level = 'moderate';
      } else if (aqi <= 150) {
        level = 'medium';
      } else if (aqi <= 200) {
        level = 'high';
      } else {
        level = 'veryhigh';
      }

      const liveZone: PollutionZone = {
        id: `live-${Date.now()}`,
        name: 'Live Arduino Sensor',
        coordinates: [userLocation.latitude, userLocation.longitude],
        radius: 100,
        level,
        data: {
          aqi: Math.round(aqi),
          pm25: Math.round((latestSensorData.environmental?.airQuality?.pm25 || 10) * 10) / 10,
          pm10: Math.round((latestSensorData.environmental?.airQuality?.pm10 || 20) * 10) / 10,
          co2: Math.round(co2 * 10) / 10,
        },
        description: `Live data from Arduino Nicla Sense ME (Updated: ${new Date().toLocaleTimeString()})`,
        isRealTime: true,
        realTimeData: {
          temperature: latestSensorData.environmental?.temperature || 25,
          humidity: latestSensorData.environmental?.humidity || 50,
          pressure: latestSensorData.environmental?.pressure || 1013,
          co2,
          aqi,
          timestamp: Date.now(),
        },
      };

      setLiveZones([liveZone]);
    } else {
      setLiveZones([]);
    }
  }, [connectedDevice, latestSensorData, userLocation]);

  const handleMapClick = (): void => {
    setSelectedZone(null);
  };

  const handleZoneClick = (zone: PollutionZone): void => {
    if (zone.isRealTime) {
      console.log('� POLLUTION TRACKER: Real-time Firebase zone clicked');
      console.log('   📍 Zone:', zone.name);
      console.log('   📊 Data source: REAL FIREBASE DATA from Arduino Nicla Sense ME');
    } else {
      console.log('🗺️ POLLUTION TRACKER: Mock zone clicked');
      console.log('   📍 Zone:', zone.name);
      console.log('   📊 Data source: HARDCODED MOCK DATA (fallback)');
    }
    setSelectedZone(zone);
  };

  const handleMapLoad = (): void => {
    setMapLoaded(true);
  };

  return (
    <div className={`pollution-tracker ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="construction-banner">
        <MdAir size={16} /> Polution Tracker
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
          <PollutionZones onZoneClick={handleZoneClick} liveZones={liveZones} />
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
