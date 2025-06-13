import { useState, useEffect } from 'react';
import { firebaseDataService, FirebaseSensorData } from '../services/firebaseDataService';
import { cleanupFirebaseStructure } from '../services/firebaseCleanup';

interface UseFirebaseDataProps {
  deviceId?: string;
  enabled?: boolean;
}

interface UseFirebaseDataReturn {
  sensorData: FirebaseSensorData | null;
  historicalData: FirebaseSensorData[];
  deviceStatus: {
    lastSeen: number;
    connected: boolean;
    deviceName: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  forceUpdate: () => void;
}

export const useFirebaseData = ({
  deviceId,
  enabled = true,
}: UseFirebaseDataProps = {}): UseFirebaseDataReturn => {
  const [sensorData, setSensorData] = useState<FirebaseSensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<FirebaseSensorData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<{
    lastSeen: number;
    connected: boolean;
    deviceName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  // Force update function that can be called to refresh data
  const forceUpdate = () => {
    if (deviceId) {
      setIsLoading(true);
      setError(null);

      firebaseDataService
        .forceRefresh(deviceId)
        .then(() => {
          setForceUpdateCounter((prev) => prev + 1);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to force update Firebase data:', err);
          setError(err instanceof Error ? err.message : 'Failed to refresh Firebase data');
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!enabled || !deviceId) {
      console.log('🔇 Firebase hook disabled or no deviceId');
      setIsLoading(false);
      return;
    }

    console.log('🔔 Setting up Firebase subscriptions for device:', deviceId);
    setIsLoading(true);
    setError(null);

    // First run cleanup
    cleanupFirebaseStructure(deviceId).catch((err) =>
      console.warn('Firebase cleanup on hook init failed:', err)
    );

    try {
      // Subscribe to real-time sensor data
      firebaseDataService.subscribeToSensorData(deviceId, (data) => {
        console.log('🔔 Received sensor data update:', data);
        setSensorData(data);
        setIsLoading(false);
      });

      // Subscribe to device status
      firebaseDataService.subscribeToDeviceStatus(deviceId, (status) => {
        console.log('🔔 Received device status update:', status);
        setDeviceStatus(status);
      });

      // Get historical data
      firebaseDataService.getHistoricalData(
        deviceId,
        (data) => {
          console.log('📚 Received historical data:', data.length, 'records');
          setHistoricalData(data);
        },
        50
      );

      // Set a timeout to stop loading state if no data comes in
      const loadingTimeout = setTimeout(() => {
        console.log('⏰ Loading timeout reached, stopping loading state');
        setIsLoading(false);

        if (!sensorData) {
          console.log('⚠️ No data received within timeout, attempting structure cleanup');
          cleanupFirebaseStructure(deviceId).catch(console.warn);
        }
      }, 10000); // 10 seconds

      return () => {
        clearTimeout(loadingTimeout);
      };
    } catch (err) {
      console.error('❌ Firebase hook error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Firebase');
      setIsLoading(false);
    }

    // Cleanup on unmount or when deviceId changes
    return () => {
      console.log('🧹 Cleaning up Firebase subscriptions for device:', deviceId);
      if (deviceId) {
        firebaseDataService.unsubscribe(deviceId, 'sensor');
        firebaseDataService.unsubscribe(deviceId, 'status');
      }
    };
  }, [deviceId, enabled, forceUpdateCounter]);

  return {
    sensorData,
    historicalData,
    deviceStatus,
    isLoading,
    error,
    forceUpdate,
  };
};

export default useFirebaseData;
