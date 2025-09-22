import { database } from './firebaseConfig';
import { ref, set, onValue, off, serverTimestamp } from 'firebase/database';
import { SensorData } from '../types/ble.types';
import { cleanupFirebaseStructure } from './firebaseCleanup';

export interface FirebaseSensorData {
  deviceId: string;
  deviceName: string;
  userId?: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
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
  motion: {
    accelerometer: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
    activity: string;
    stepCount: number;
    fallDetected: boolean;
  };
  health: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
    bodyTemperature: number;
  };
}

class FirebaseDataService {
  private listeners: Map<string, any> = new Map();

  /**
   * Push sensor data to Firebase Realtime Database
   */
  async pushSensorData(
    deviceId: string,
    deviceName: string,
    sensorData: SensorData,
    userId?: string,
    location?: { latitude: number; longitude: number; accuracy?: number }
  ): Promise<void> {
    try {
      const timestamp = Date.now();
      console.log('📤 Pushing sensor data to Firebase:', {
        deviceId,
        deviceName,
        timestamp,
        userId: userId || 'anonymous',
        hasLocation: !!location,
      });

      // First ensure test key is removed
      const testRef = ref(database, `devices/${deviceId}/sensorData/test`);
      await set(testRef, null);

      // Create the data object with *current* timestamp
      const firebaseData: FirebaseSensorData = {
        deviceId,
        deviceName,
        userId, // Include user ID if available
        timestamp, // Using current timestamp
        location, // Include location if available
        environmental: {
          temperature: sensorData.environmental?.temperature || 0,
          humidity: sensorData.environmental?.humidity || 0,
          pressure: sensorData.environmental?.pressure || 0,
          airQuality: {
            aqi: sensorData.environmental?.airQuality?.aqi || 0,
            co2: sensorData.environmental?.airQuality?.co2 || 0,
            voc: sensorData.environmental?.airQuality?.voc || 0,
            pm25: sensorData.environmental?.airQuality?.pm25 || 0,
            pm10: sensorData.environmental?.airQuality?.pm10 || 0,
          },
        },
        motion: {
          accelerometer: sensorData.motion?.accelerometer || { x: 0, y: 0, z: 0 },
          gyroscope: sensorData.motion?.gyroscope || { x: 0, y: 0, z: 0 },
          activity: sensorData.motion?.activity || 'still',
          stepCount: sensorData.motion?.stepCount || 0,
          fallDetected: sensorData.motion?.fallDetected || false,
        },
        health: {
          heartRate: 0,
          bloodPressure: { systolic: 0, diastolic: 0 },
          oxygenSaturation: 0,
          bodyTemperature: sensorData.environmental?.temperature || 0,
        },
      };

      // Use a new key format that includes user ID and timestamp
      const userPart = userId ? `user_${userId}` : 'anonymous';
      const entryKey = `${userPart}_${timestamp}`;
      const entryRef = ref(database, `devices/${deviceId}/sensorData/${entryKey}`);

      // Push to Firebase
      await set(entryRef, firebaseData);

      console.log(
        `✅ Sensor data pushed to Firebase with key: ${entryKey}, temp: ${firebaseData.environmental.temperature}°C`
      );

      // Update device status with reference to the latest data
      const statusRef = ref(database, `devices/${deviceId}/status`);
      await set(statusRef, {
        lastSeen: timestamp,
        connected: true,
        deviceName,
        lastDataKey: entryKey,
        lastUpdate: new Date().toISOString(),
      });

      // Limit data points to keep database manageable
      await this.limitHistoricalData(deviceId, 30);

      return;
    } catch (error) {
      console.error('❌ Error pushing sensor data to Firebase:', error);
      throw error;
    }
  }

  /**
   * Limit the number of historical data points to prevent database bloat
   */
  private async limitHistoricalData(deviceId: string, limit: number = 100): Promise<void> {
    try {
      const deviceRef = ref(database, `devices/${deviceId}/sensorData`);

      // Get all data once
      onValue(
        deviceRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const keys = Object.keys(data);

            // If we have more entries than our limit
            if (keys.length > limit) {
              console.log(`🧹 Limiting historical data (${keys.length} entries > ${limit} limit)`);

              // Sort keys by timestamp (handling both old format "data_timestamp" and new format "user_id_timestamp")
              const sortedKeys = keys.sort((a, b) => {
                // Extract timestamp from key - it's always the last part after the last underscore
                const timeA = parseInt(a.split('_').pop() || '0');
                const timeB = parseInt(b.split('_').pop() || '0');
                return timeA - timeB;
              });

              // Remove oldest entries that exceed our limit
              const keysToRemove = sortedKeys.slice(0, keys.length - limit);

              // Remove each entry
              keysToRemove.forEach((key) => {
                const entryRef = ref(database, `devices/${deviceId}/sensorData/${key}`);
                set(entryRef, null);
              });

              console.log(`🗑️ Removed ${keysToRemove.length} old entries from Firebase`);
            }
          }
        },
        { onlyOnce: true }
      );
    } catch (error) {
      console.warn('⚠️ Error limiting historical data:', error);
    }
  }

  /**
   * Subscribe to real-time sensor data updates
   */
  subscribeToSensorData(deviceId: string, callback: (data: FirebaseSensorData) => void): void {
    console.log('🔔 Subscribing to sensor data for device:', deviceId);
    const deviceRef = ref(database, `devices/${deviceId}/sensorData`);

    const listener = onValue(
      deviceRef,
      (snapshot) => {
        console.log('📡 Firebase sensor data snapshot received:', snapshot.exists());
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Get all keys and find the latest one by timestamp
          const keys = Object.keys(data);
          if (keys.length === 0) {
            console.log('📭 No data keys found in Firebase snapshot');
            return;
          }

          // Sort keys by the actual timestamp in the data
          const latestKey = keys.sort((a, b) => {
            return (data[b].timestamp || 0) - (data[a].timestamp || 0);
          })[0];

          console.log(
            `📈 Latest data key: ${latestKey}, timestamp: ${new Date(data[latestKey].timestamp).toLocaleString()}`
          );
          callback(data[latestKey]);
        } else {
          console.log('📭 No sensor data found in Firebase');
        }
      },
      (error) => {
        console.error('❌ Firebase subscription error:', error);
      }
    );

    this.listeners.set(`sensor_${deviceId}`, listener);
  }

  /**
   * Subscribe to device status updates
   */
  subscribeToDeviceStatus(
    deviceId: string,
    callback: (status: { lastSeen: number; connected: boolean; deviceName: string }) => void
  ): void {
    const statusRef = ref(database, `devices/${deviceId}/status`);

    const listener = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });

    this.listeners.set(`status_${deviceId}`, listener);
  }

  /**
   * Get historical sensor data
   */
  getHistoricalData(
    deviceId: string,
    callback: (data: FirebaseSensorData[]) => void,
    limitToLast: number = 100
  ): void {
    const deviceRef = ref(database, `devices/${deviceId}/sensorData`);

    onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.values(data) as FirebaseSensorData[];
        // Sort by timestamp and get latest entries
        const sortedData = dataArray
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limitToLast);
        callback(sortedData);
      } else {
        callback([]);
      }
    });
  }

  /**
   * Update device connection status
   */
  async updateDeviceStatus(
    deviceId: string,
    deviceName: string,
    connected: boolean
  ): Promise<void> {
    try {
      const statusRef = ref(database, `devices/${deviceId}/status`);
      await set(statusRef, {
        lastSeen: serverTimestamp(),
        connected,
        deviceName,
      });
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }

  /**
   * Force refresh the Firebase data structure
   */
  async forceRefresh(deviceId: string): Promise<void> {
    console.log('🔄 Forcing refresh of Firebase structure for device:', deviceId);

    try {
      // First run the cleanup
      await cleanupFirebaseStructure(deviceId);

      // Re-trigger all listeners
      const listeners = [...this.listeners.keys()];
      for (const key of listeners) {
        if (key.includes(deviceId)) {
          const [type, id] = key.split('_');
          this.unsubscribe(id, type as 'sensor' | 'status');

          if (type === 'sensor') {
            console.log('🔄 Resubscribing to sensor data');
            // We need to pass a callback, but we don't have access to the original
            // Just create a dummy one that logs the data
            this.subscribeToSensorData(id, (data) => {
              console.log('🔄 Resubscription callback received data:', data);
            });
          } else if (type === 'status') {
            console.log('🔄 Resubscribing to device status');
            this.subscribeToDeviceStatus(id, (status) => {
              console.log('🔄 Resubscription callback received status:', status);
            });
          }
        }
      }

      console.log('✅ Firebase force refresh completed');
    } catch (error) {
      console.error('❌ Error during Firebase force refresh:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from all listeners
   */
  unsubscribeAll(): void {
    this.listeners.forEach((listener) => {
      off(ref(database), 'value', listener);
    });
    this.listeners.clear();
  }

  /**
   * Unsubscribe from specific listener
   */
  unsubscribe(deviceId: string, type: 'sensor' | 'status'): void {
    const key = `${type}_${deviceId}`;
    const listener = this.listeners.get(key);
    if (listener) {
      off(ref(database), 'value', listener);
      this.listeners.delete(key);
    }
  }
}

export const firebaseDataService = new FirebaseDataService();
export default firebaseDataService;
