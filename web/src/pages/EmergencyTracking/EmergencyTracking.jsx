import { useState, useMemo } from 'react';
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

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

function EmergencyTracking({ isDarkMode, toggleTheme }) {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [activeTab, setActiveTab] = useState('info');

  const { userData, isLoading } = useEmergencyData(userId);
  const actions = useEmergencyActions();

  const accraCoordinates = useMemo(() => [-0.1869644, 5.6037168], []);

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
                  accraCoordinates={accraCoordinates}
                  isLoading={isLoading}
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
}

export default EmergencyTracking;
