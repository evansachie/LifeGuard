import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMoon, FaSun, FaBell, FaUser, FaEnvelope, FaClock, FaRuler } from 'react-icons/fa';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';

const SettingsPage = ({ isDarkMode, toggleDarkMode }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    email: '',
    username: '',
    units: 'metric',
    language: 'english',
    workoutReminders: true,
    emergencyContacts: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(`${API_ENDPOINTS.GET_USER}?id=${localStorage.getItem('userId')}`, {
          method: 'GET',
        });
        
        setSettings(prev => ({
          ...prev,
          email: response.email,
          username: response.userName
        }));
      } catch (error) {
        toast.error('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Mock API call
    console.log(`Updating setting: ${key} to ${value}`);
    toast.success('Settings updated successfully!');
  };

  const SettingSection = ({ title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg mb-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </motion.div>
  );

  const ToggleSwitch = ({ enabled, onChange }) => (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
        enabled 
          ? 'bg-blue-500' 
          : isDarkMode 
            ? 'bg-gray-600' 
            : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Theme Settings */}
      <SettingSection title="Appearance">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl text-yellow-500" />}
            <span>Dark Mode</span>
          </div>
          <ToggleSwitch enabled={isDarkMode} onChange={toggleDarkMode} />
        </div>
      </SettingSection>

      {/* Profile Settings */}
      <SettingSection title="Profile">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-xl text-blue-500" />
            <div className="flex-1">
              <div className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Username
              </div>
              <input
                type="text"
                value={settings.username}
                readOnly
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-200 border-gray-300'
                } cursor-not-allowed`}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-xl text-green-500" />
            <div className="flex-1">
              <div className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Email
              </div>
              <input
                type="email"
                value={settings.email}
                readOnly
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-200 border-gray-300'
                } cursor-not-allowed`}
              />
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRuler className="text-xl text-purple-500" />
              <span>Measurement Units</span>
            </div>
            <select
              value={settings.units}
              onChange={(e) => handleSettingChange('units', e.target.value)}
              className={`p-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="metric">Metric (kg, km)</option>
              <option value="imperial">Imperial (lb, mi)</option>
            </select>
          </div>
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBell className="text-xl text-yellow-500" />
              <span>Push Notifications</span>
            </div>
            <ToggleSwitch
              enabled={settings.notifications}
              onChange={(value) => handleSettingChange('notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.workoutReminders 
                ? <IoMdNotifications className="text-xl text-blue-500" />
                : <IoMdNotificationsOff className="text-xl text-gray-500" />
              }
              <span>Workout Reminders</span>
            </div>
            <ToggleSwitch
              enabled={settings.workoutReminders}
              onChange={(value) => handleSettingChange('workoutReminders', value)}
            />
          </div>
        </div>
      </SettingSection>
    </div>
  );
};

export default SettingsPage;