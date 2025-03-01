import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaExclamationTriangle, FaHeartbeat } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EmergencyTracking({ isDarkMode }) {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState({
    name: 'LifeGuard User',
    location: 'Last known location',
    phone: 'Not available',
    email: 'Not available',
    medicalInfo: 'No medical information available',
    timestamp: new Date().toLocaleString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const token = searchParams.get('token');

  useEffect(() => {
    // simulate data for now
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserData({
        name: 'John Doe',
        location: '123 Main Street, Anytown, USA',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        medicalInfo: 'Allergic to penicillin, has asthma',
        timestamp: new Date().toLocaleString()
      });
      toast.info('Emergency data loaded');
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-4xl mr-3" />
            <h1 className="text-3xl font-bold">Emergency Alert</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            A LifeGuard user has triggered an emergency alert and needs assistance.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-red-500 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-400 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-400 rounded w-64"></div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="mb-6 pb-6 border-b border-gray-300">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Emergency Information
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Alert triggered at {userData.timestamp}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4">User Information</h3>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Name:</span> {userData.name}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2 text-green-500" />
                    <span className="font-medium mr-2">Phone:</span> {userData.phone}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    <span className="font-medium mr-2">Email:</span> {userData.email}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4">Location Information</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 text-red-500 mt-1" />
                    <span>
                      <span className="font-medium">Last Known Location:</span>
                      <br />
                      {userData.location}
                    </span>
                  </p>
                  <div className="h-32 bg-gray-200 rounded-lg mt-2 flex items-center justify-center">
                    <p className="text-gray-500">Map view would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="text-xl font-semibold mb-4">Medical Information</h3>
              <p>{userData.medicalInfo}</p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors mb-4 w-full md:w-auto"
                onClick={() => window.open(`tel:${userData.phone.replace(/\D/g, '')}`)}
              >
                <FaPhone className="inline mr-2" /> Call User Now
              </button>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Please contact emergency services if you believe this is a life-threatening situation.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default EmergencyTracking;
