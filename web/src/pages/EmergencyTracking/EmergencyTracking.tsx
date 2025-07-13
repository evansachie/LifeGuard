import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useEmergencyData } from '../../hooks/useEmergencyData';
import { useEmergencyActions } from '../../hooks/useEmergencyActions';

import EmergencyHeader from '../../components/EmergencyTracking/EmergencyHeader';
import TabNavigation from '../../components/EmergencyTracking/TabNavigation';
import LoadingIndicator from '../../components/EmergencyTracking/LoadingIndicator';
import InfoTab from '../../components/EmergencyTracking/InfoTab';
import MedicalTab from '../../components/EmergencyTracking/MedicalTab';
import ActionsTab from '../../components/EmergencyTracking/ActionsTab';

import 'mapbox-gl/dist/mapbox-gl.css';
import { getDatabase, ref, onValue, off } from 'firebase/database';

interface EmergencyTrackingProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

type TabType = 'info' | 'medical' | 'actions';

const EmergencyTracking = ({ isDarkMode, toggleTheme }: EmergencyTrackingProps) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [locationDisplayName, setLocationDisplayName] = useState<string | null>(null);

  const { userData, isLoading } = useEmergencyData(userId || '');
  const actions = useEmergencyActions();

  // Default coordinates for Kumasi, Ghana (only used as fallback)
  const kumasiCoordinates = useMemo<[number, number]>(() => [-1.5716, 6.6745], []);

  // Listen for real-time location updates from Firebase
  useEffect(() => {
    if (!userId) return;

    const db = getDatabase();
    const locationRef = ref(db, `users/${userId}/location`);

    const locationListener = onValue(locationRef, (snapshot) => {
      const locationData = snapshot.val();
      if (locationData && locationData.latitude && locationData.longitude) {
        // Convert to the format expected by Mapbox
        setUserCoordinates([locationData.longitude, locationData.latitude]);

        // If using test coordinates for Kumasi (approximately)
        if (
          Math.abs(locationData.latitude - 6.6745) < 0.01 &&
          Math.abs(locationData.longitude - -1.5716) < 0.01
        ) {
          // Update the location name for display
          setLocationDisplayName('Kumasi, Ghana');
        } else {
          setLocationDisplayName(null);
        }
      }
    });

    return () => {
      // Clean up listener when component unmounts
      off(locationRef, 'value', locationListener);
    };
  }, [userId]);

  return (
    <div
      className={`min-h-screen pb-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <EmergencyHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} userName={userData.name} />

      <div className="max-w-5xl mx-auto px-4 pt-3">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isDarkMode={isDarkMode}
            />

            <div className="p-4">
              {activeTab === 'info' && (
                <InfoTab
                  userData={userData}
                  isDarkMode={isDarkMode}
                  actions={actions}
                  accraCoordinates={userCoordinates || kumasiCoordinates}
                  isLoading={isLoading}
                  locationOverride={locationDisplayName}
                />
              )}

              {activeTab === 'medical' && (
                <MedicalTab userData={userData} actions={actions} isDarkMode={isDarkMode} />
              )}

              {activeTab === 'actions' && (
                <ActionsTab userData={userData} actions={actions} isDarkMode={isDarkMode} />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmergencyTracking;
