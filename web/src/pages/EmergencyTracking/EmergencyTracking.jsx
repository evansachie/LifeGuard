import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaExclamationTriangle,
  FaHeartbeat,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { API_ENDPOINTS, fetchWithAuth } from '../../utils/api';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

function EmergencyTracking({ isDarkMode, toggleTheme }) {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState({
    name: 'LifeGuard User',
    location: 'Last known location',
    phone: 'Not available',
    email: 'Not available',
    medicalInfo: 'No medical information available',
    timestamp: new Date().toLocaleString(),
    mapUrl: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const token = searchParams.get('token');
  const mapContainer = useRef(null);
  const map = useRef(null);

  const accraCoordinates = useMemo(() => [-0.1869644, 5.6037168], []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(API_ENDPOINTS.GET_PROFILE(token));
        const userData = await response.json();

        if (userData) {
          setUserData({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            phone: userData.phoneNumber || 'Not available',
            location: userData.location || 'Not available',
            medicalInfo: userData.medicalInfo || 'No medical information available',
            timestamp: new Date().toLocaleString(),
            mapUrl: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (isLoading || !mapContainer.current) return;

    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11',
      center: accraCoordinates,
      zoom: 12,
    });

    const marker = new mapboxgl.Marker()
      .setLngLat(accraCoordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<p>${userData.name}</p><p>${userData.location}</p>`))
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      marker.remove();
      map.current?.remove();
    };
  }, [isLoading, isDarkMode, userData.name, userData.location, accraCoordinates]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(
        isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11'
      );
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-4xl mr-3 animate-pulse" />
            <h1 className="text-3xl font-bold">Emergency Alert</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {userData.name} has triggered an emergency alert and needs assistance.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-red-500 rounded-full mb-4 animate-ping"></div>
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
                <FaHeartbeat className="text-red-500 mr-2 animate-pulse" />
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
                    <span className="font-medium mr-2">Phone:</span>
                    <a
                      href={`tel:${userData.phone.replace(/\D/g, '')}`}
                      className="text-blue-500 hover:underline"
                    >
                      {userData.phone}
                    </a>
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    <span className="font-medium mr-2">Email:</span>
                    <a href={`mailto:${userData.email}`} className="text-blue-500 hover:underline">
                      {userData.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4">Location Information</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 text-red-500 mt-1 animate-bounce" />
                    <span>
                      <span className="font-medium">Last Known Location:</span>
                      <br />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {userData.location}
                      </a>
                    </span>
                  </p>
                  {/* Mapbox map container */}
                  <div
                    ref={mapContainer}
                    className="h-48 bg-gray-200 rounded-lg mt-2 overflow-hidden"
                  />
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Medical Information
              </h3>
              <div
                className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <p className="font-bold !text-red-500">Important Medical Details:</p>
                <p className="!text-red-400">{userData.medicalInfo}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex-1 md:flex-initial flex items-center justify-center"
                  onClick={() => window.open(`tel:${userData.phone.replace(/\D/g, '')}`)}
                >
                  <FaPhone className="mr-2" /> Call User Now
                </button>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex-1 md:flex-initial flex items-center justify-center"
                  onClick={() => window.open(`mailto:${userData.email}`)}
                >
                  <FaEnvelope className="mr-2" /> Send Email
                </button>
              </div>
              <div className="text-center">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Please contact emergency services if you believe this is a life-threatening
                  situation.
                </p>
                <button
                  className="mt-2 px-6 py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition-colors"
                  onClick={() => window.open('tel:112')}
                >
                  Call Emergency Services (112)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default EmergencyTracking;
