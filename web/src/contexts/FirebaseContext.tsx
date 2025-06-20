import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { database } from '../services/firebaseConfig';
import { firebaseDataService, FirebaseSensorData } from '../services/firebaseDataService';
import { SensorData } from '../types/ble.types';

interface FirebaseContextType {
  isConnected: boolean;
  isInitialized: boolean;
  error: string | null;
  lastSync: number | null;
  pushSensorData: (deviceId: string, deviceName: string, sensorData: SensorData) => Promise<void>;
  subscribeToDevice: (deviceId: string, callback: (data: FirebaseSensorData) => void) => void;
  unsubscribeFromDevice: (deviceId: string) => void;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);

  useEffect(() => {
    // Initialize Firebase connection
    const initializeFirebase = async () => {
      try {
        // Test Firebase connection
        if (database) {
          setIsConnected(true);
          setIsInitialized(true);
          setError(null);
          console.log('✅ Firebase initialized successfully');
        }
      } catch (err) {
        console.error('❌ Firebase initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Firebase initialization failed');
        setIsConnected(false);
      }
    };

    initializeFirebase();
  }, []);
  const pushSensorData = async (
    deviceId: string,
    deviceName: string,
    sensorData: SensorData
  ): Promise<void> => {
    try {
      await firebaseDataService.pushSensorData(deviceId, deviceName, sensorData);
      setLastSync(Date.now());
      setError(null);
    } catch (err) {
      console.error('❌ Failed to push sensor data to Firebase:', err);
      setError(err instanceof Error ? err.message : 'Failed to push data to Firebase');
    }
  };

  const subscribeToDevice = (
    deviceId: string,
    callback: (data: FirebaseSensorData) => void
  ): void => {
    firebaseDataService.subscribeToSensorData(deviceId, callback);
  };

  const unsubscribeFromDevice = (deviceId: string): void => {
    console.log('Unsubscribing from device:', deviceId);
  };

  const value: FirebaseContextType = {
    isConnected,
    isInitialized,
    error,
    lastSync,
    pushSensorData,
    subscribeToDevice,
    unsubscribeFromDevice,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;
