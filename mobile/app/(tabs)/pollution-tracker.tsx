import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { PollutionZone, LegendItem } from '../../types/pollution';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_API_KEY = 'pk.eyJ1Ijoic2Vya2hhbmkiLCJhIjoiY201ZDluYnM0MmppNTJrczJ6M3Z2a2ZqOSJ9.TUP4GZ15D462LkUy5PUcWQ';

const INITIAL_VIEW_STATE = {
  latitude: 40.6935,
  longitude: -73.9866,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 }
};

// Mock data for pollution zones
const pollutionZones: PollutionZone[] = [
  {
    id: '1',
    coordinates: {
      latitude: 40.6935,
      longitude: -73.9866,
    },
    level: 'high',
    radius: 500,
  },
  {
    id: '2',
    coordinates: {
      latitude: 40.6895,
      longitude: -73.9845,
    },
    level: 'medium',
    radius: 300,
  },
  {
    id: '3',
    coordinates: {
      latitude: 40.6915,
      longitude: -73.9825,
    },
    level: 'low',
    radius: 400,
  },
];

const legendItems: LegendItem[] = [
  { color: '#FF4444', label: 'Heavily Polluted Zones' },
  { color: '#FFB344', label: 'Midly Polluted Zones' },
  { color: '#4CAF50', label: 'Low Polluted Zones' },
];

const Legend = () => (
  <View style={styles.legendContainer}>
    <View style={styles.legendHeader}>
      <Text style={styles.legendTitle}>KEY / LEGEND</Text>
    </View>
    {legendItems.map((item, index) => (
      <View key={index} style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const getPollutionColor = (level: PollutionZone['level']) => {
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

export default function PollutionTrackerScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setViewState(prev => ({
        ...prev,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      }));
    })();
  }, []);

  const onMove = useCallback(({ viewState }: any) => {
    setViewState(viewState);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/pollution.svg')}
          style={styles.mapIcon}
        />
        <Text style={styles.headerTitle}>Pollution Tracker</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <Map
          {...viewState}
          onMove={onMove}
          mapboxAccessToken={MAPBOX_API_KEY}
          style={styles.map}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          <NavigationControl position="top-right" />
          
          {/* Pollution Zone Markers */}
          {pollutionZones.map((zone) => (
            <Marker
              key={zone.id}
              longitude={zone.coordinates.longitude}
              latitude={zone.coordinates.latitude}
            >
              <View 
                style={[
                  styles.pollutionMarker,
                  {
                    backgroundColor: `${getPollutionColor(zone.level)}50`,
                    borderColor: getPollutionColor(zone.level),
                    width: zone.radius / 50,
                    height: zone.radius / 50,
                  }
                ]} 
              />
            </Marker>
          ))}

          {/* Current Location */}
          {location && (
            <Marker
              longitude={location.coords.longitude}
              latitude={location.coords.latitude}
            >
              <View style={styles.currentLocationMarker} />
            </Marker>
          )}
        </Map>

        {/* Legend */}
        <Legend />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mapIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendHeader: {
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pollutionMarker: {
    borderRadius: 50,
    borderWidth: 2,
    opacity: 0.7,
  },
});
