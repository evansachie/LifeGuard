import { database } from './firebaseConfig';
import { ref, onValue, off, get } from 'firebase/database';
import { PollutionZone } from '../types/pollutionTracker.types';

export interface RealTimePollutionData {
  deviceId: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  environmental: {
    temperature: number;
    humidity: number;
    pressure: number;
    airQuality: {
      aqi: number;
      co2: number;
      voc: number;
      pm25: number;
      pm10: number;
    };
  };
}

class PollutionDataService {
  private listeners: Map<string, any> = new Map();

  /**
   * Get all devices with sensor data from Firebase
   */
  async getAllDevicesData(): Promise<RealTimePollutionData[]> {
    try {
      console.log('🔥 Fetching all devices pollution data from Firebase...');
      const devicesRef = ref(database, 'devices');
      const snapshot = await get(devicesRef);

      if (!snapshot.exists()) {
        console.warn('📭 No devices data found in Firebase');
        return [];
      }

      const devicesData = snapshot.val();
      const pollutionDataArray: RealTimePollutionData[] = [];

      // Extract latest sensor data from each device
      Object.keys(devicesData).forEach((deviceId) => {
        const deviceData = devicesData[deviceId];

        if (deviceData.sensorData) {
          // Get the latest sensor reading
          const sensorDataEntries = Object.values(deviceData.sensorData) as any[];
          const latestEntry = sensorDataEntries
            .filter((entry) => entry.timestamp && entry.environmental)
            .sort((a, b) => b.timestamp - a.timestamp)[0];

          if (latestEntry) {
            const pollutionData: RealTimePollutionData = {
              deviceId,
              timestamp: latestEntry.timestamp,
              location: latestEntry.location,
              environmental: {
                temperature: latestEntry.environmental.temperature || 0,
                humidity: latestEntry.environmental.humidity || 0,
                pressure: latestEntry.environmental.pressure || 0,
                airQuality: {
                  aqi: latestEntry.environmental.airQuality?.aqi || 0,
                  co2: latestEntry.environmental.airQuality?.co2 || 0,
                  voc: latestEntry.environmental.airQuality?.voc || 0,
                  pm25: latestEntry.environmental.airQuality?.pm25 || 0,
                  pm10: latestEntry.environmental.airQuality?.pm10 || 0,
                },
              },
            };

            pollutionDataArray.push(pollutionData);
            console.log(`📊 Found pollution data for device ${deviceId}:`, {
              aqi: pollutionData.environmental.airQuality.aqi,
              pm25: pollutionData.environmental.airQuality.pm25,
              pm10: pollutionData.environmental.airQuality.pm10,
              location: pollutionData.location,
            });
          }
        }
      });

      console.log(`✅ Retrieved pollution data from ${pollutionDataArray.length} devices`);
      return pollutionDataArray;
    } catch (error) {
      console.error('❌ Error fetching devices pollution data:', error);
      return [];
    }
  }

  /**
   * Convert Firebase pollution data to PollutionZones for map display
   */
  convertToPollutionZones(pollutionDataArray: RealTimePollutionData[]): PollutionZone[] {
    return pollutionDataArray
      .filter((data) => data.location && data.location.latitude && data.location.longitude)
      .map((data, index) => {
        const aqi = data.environmental.airQuality.aqi;

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

        const zone: PollutionZone = {
          id: `firebase-${data.deviceId}-${index}`,
          name: `Arduino Sensor ${data.deviceId.substring(0, 8)}`,
          coordinates: [data.location!.latitude, data.location!.longitude],
          radius: 200,
          level,
          data: {
            aqi: Math.round(aqi),
            pm25: Math.round(data.environmental.airQuality.pm25 * 10) / 10,
            pm10: Math.round(data.environmental.airQuality.pm10 * 10) / 10,
          },
          description: `Real-time data from Arduino Nicla Sense ME (Last updated: ${new Date(data.timestamp).toLocaleTimeString()})`,
          isRealTime: true,
        };

        console.log(`🌿 Created pollution zone from Firebase data:`, {
          name: zone.name,
          level: zone.level,
          aqi: zone.data.aqi,
          pm25: zone.data.pm25,
          pm10: zone.data.pm10,
          coordinates: zone.coordinates,
        });

        return zone;
      });
  }

  /**
   * Subscribe to real-time pollution data updates
   */
  subscribeToRealTimeData(callback: (zones: PollutionZone[]) => void): void {
    const devicesRef = ref(database, 'devices');

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        const pollutionDataArray: RealTimePollutionData[] = [];

        Object.keys(devicesData).forEach((deviceId) => {
          const deviceData = devicesData[deviceId];

          if (deviceData.sensorData) {
            const sensorDataEntries = Object.values(deviceData.sensorData) as any[];
            const latestEntry = sensorDataEntries
              .filter((entry) => entry.timestamp && entry.environmental)
              .sort((a, b) => b.timestamp - a.timestamp)[0];

            if (latestEntry) {
              pollutionDataArray.push({
                deviceId,
                timestamp: latestEntry.timestamp,
                location: latestEntry.location,
                environmental: {
                  temperature: latestEntry.environmental.temperature || 0,
                  humidity: latestEntry.environmental.humidity || 0,
                  pressure: latestEntry.environmental.pressure || 0,
                  airQuality: {
                    aqi: latestEntry.environmental.airQuality?.aqi || 0,
                    co2: latestEntry.environmental.airQuality?.co2 || 0,
                    voc: latestEntry.environmental.airQuality?.voc || 0,
                    pm25: latestEntry.environmental.airQuality?.pm25 || 0,
                    pm10: latestEntry.environmental.airQuality?.pm10 || 0,
                  },
                },
              });
            }
          }
        });

        const zones = this.convertToPollutionZones(pollutionDataArray);
        console.log(`🔄 Real-time pollution data updated: ${zones.length} zones`);
        callback(zones);
      } else {
        console.warn('📭 No real-time pollution data available');
        callback([]);
      }
    });

    this.listeners.set('realtime-pollution', unsubscribe);
  }

  /**
   * Unsubscribe from real-time data
   */
  unsubscribeFromRealTimeData(): void {
    const unsubscribe = this.listeners.get('realtime-pollution');
    if (unsubscribe) {
      off(ref(database, 'devices'), 'value', unsubscribe);
      this.listeners.delete('realtime-pollution');
      console.log('🔕 Unsubscribed from real-time pollution data');
    }
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.listeners.forEach((unsubscribe, key) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      console.log(`🧹 Cleaned up listener: ${key}`);
    });
    this.listeners.clear();
  }
}

export const pollutionDataService = new PollutionDataService();
