import { useEffect, useState, useMemo } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import { pollutionZones } from '../../data/pollution-data';
import { pollutionDataService } from '../../services/pollutionDataService';
import { getPollutionColor } from '../../utils/getPollutionColor';
import { PollutionZone } from '../../types/pollutionTracker.types';

interface PollutionZonesProps {
  onZoneClick: (zone: PollutionZone) => void;
  liveZones?: PollutionZone[];
}

const PollutionZones = ({ onZoneClick, liveZones = [] }: PollutionZonesProps) => {
  const { current: map } = useMap();
  const [realTimeZones, setRealTimeZones] = useState<PollutionZone[]>([]);
  const [useRealData, setUseRealData] = useState<boolean>(true);

  // Load initial Firebase data and subscribe to real-time updates
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        console.log('Loading initial Firebase pollution data...');
        const pollutionData = await pollutionDataService.getAllDevicesData();
        const zones = pollutionDataService.convertToPollutionZones(pollutionData);

        if (zones.length > 0) {
          console.log(`Loaded ${zones.length} real pollution zones from Firebase`);
          setRealTimeZones(zones);
          setUseRealData(true);
        } else {
          console.warn('No real pollution data found, using mock data');
          setUseRealData(false);
        }
      } catch (error) {
        console.error('Error loading Firebase pollution data:', error);
        setUseRealData(false);
      }
    };

    loadFirebaseData();

    // Subscribe to real-time updates
    pollutionDataService.subscribeToRealTimeData((zones) => {
      if (zones.length > 0) {
        console.log(`🔄 Real-time pollution zones updated: ${zones.length} zones`);
        setRealTimeZones(zones);
        setUseRealData(true);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      pollutionDataService.unsubscribeFromRealTimeData();
    };
  }, []);

  // Combine live zones with Firebase zones and fallback to mock data
  const activeZones = useMemo(() => {
    const combinedZones = [...liveZones];

    if (useRealData && realTimeZones.length > 0) {
      combinedZones.push(...realTimeZones);
    } else if (liveZones.length === 0) {
      combinedZones.push(...pollutionZones);
    }
    return combinedZones;
  }, [liveZones, realTimeZones, useRealData]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: mapboxgl.MapMouseEvent): void => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: activeZones.map((zone) => `zone-${zone.id}`),
      });

      if (features.length > 0) {
        const clickedZone = activeZones.find((zone) => `zone-${zone.id}` === features[0].layer.id);
        if (clickedZone) {
          // Log data source when zone is clicked
          if (clickedZone.isRealTime) {
            console.log('🔥 POLLUTION TRACKER: Real-time Firebase zone clicked');
            console.log('   📍 Zone:', clickedZone.name);
            console.log('   📊 Data source: REAL FIREBASE DATA from Arduino Nicla Sense ME');
            console.log('   🌿 AQI:', clickedZone.data.aqi, '[REAL-TIME ARDUINO DATA]');
            console.log('   🌫️ PM2.5:', clickedZone.data.pm25, 'µg/m³ [REAL-TIME ARDUINO DATA]');
            console.log('   🌫️ PM10:', clickedZone.data.pm10, 'µg/m³ [REAL-TIME ARDUINO DATA]');
          } else {
            console.log('🗺️ POLLUTION TRACKER: Mock zone clicked');
            console.log('   📍 Zone:', clickedZone.name);
            console.log('   📊 Data source: HARDCODED MOCK DATA (fallback)');
          }
          onZoneClick(clickedZone);
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onZoneClick, activeZones]);

  return (
    <>
      {activeZones.map((zone) => (
        <Source
          key={zone.id}
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [zone.coordinates[1], zone.coordinates[0]],
            },
            properties: {
              level: zone.level,
            },
          }}
        >
          <Layer
            id={`zone-${zone.id}`}
            type="circle"
            paint={{
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                zone.radius / 100,
                15,
                zone.radius / 50,
              ],
              'circle-color': getPollutionColor(zone.level),
              'circle-opacity': 0.6,
              'circle-blur': 0.5,
            }}
          />
        </Source>
      ))}
    </>
  );
};

export default PollutionZones;
