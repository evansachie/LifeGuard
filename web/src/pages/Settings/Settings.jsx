import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaBell, FaUser, FaEnvelope, FaRuler } from 'react-icons/fa';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import Spinner from '../../components/Spinner/Spinner';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleThemeToggle = () => {
    toggleDarkMode();
    // Save theme preference to localStorage
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    toast.success(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
  };

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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`p-8 rounded-xl shadow-lg mb-6 backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-[#2D2D2D]/90 hover:bg-[#2D2D2D]/95' 
          : 'bg-white/90 hover:bg-white/95'
      } transition-all duration-300`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-800'
      }`}>{title}</h2>
      {children}
    </motion.div>
  );

  const ToggleSwitch = ({ enabled, onChange }) => (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full cursor-pointer transition-all duration-300 ${
        enabled 
          ? 'bg-blue-500 shadow-inner shadow-blue-600/50' 
          : isDarkMode 
            ? 'bg-gray-600' 
            : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          enabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </div>
  );

  return (
    <div className={`min-h-screen p-6 md:p-12 ${
      isDarkMode 
        ? 'dark-mode bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <h1 className={`text-4xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Settings</h1>
        </motion.div>

        {/* Theme Settings */}
        <SettingSection title="Appearance">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors">
            <div className="flex items-center gap-4">
              {isDarkMode 
                ? <FaMoon className="text-2xl text-yellow-500" /> 
                : <FaSun className="text-2xl text-yellow-500" />
              }
              <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Dark Mode
              </span>
            </div>
            <ToggleSwitch enabled={isDarkMode} onChange={handleThemeToggle} />
          </div>
        </SettingSection>

        {/* Profile Section */}
        <SettingSection title="Profile">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaUser className="text-2xl text-blue-500" />
              <div className="flex-1">
                <div className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Username
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Spinner size="small" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={settings.username}
                    readOnly
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    } cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-green-500" />
              <div className="flex-1">
                <div className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Email
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Spinner size="small" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                  </div>
                ) : (
                  <input
                    type="email"
                    value={settings.email}
                    readOnly
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    } cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                )}
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors">
              <div className="flex items-center gap-4">
                <FaRuler className="text-2xl text-purple-500" />
                <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Measurement Units
                </span>
              </div>
              <select
                value={settings.units}
                onChange={(e) => handleSettingChange('units', e.target.value)}
                className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                } focus:ring-2 focus:ring-purple-500/50 transition-all`}
              >
                <option value="metric">Metric (kg, km)</option>
                <option value="imperial">Imperial (lb, mi)</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <div className="space-y-6">
            {['notifications', 'workoutReminders'].map((setting) => (
              <div key={setting} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors">
                <div className="flex items-center gap-4">
                  {setting === 'notifications' ? (
                    <FaBell className="text-2xl text-yellow-500" />
                  ) : (
                    settings[setting] 
                      ? <IoMdNotifications className="text-2xl text-blue-500" />
                      : <IoMdNotificationsOff className="text-2xl text-gray-500" />
                  )}
                  <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {setting === 'notifications' ? 'Push Notifications' : 'Workout Reminders'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={settings[setting]}
                  onChange={(value) => handleSettingChange(setting, value)}
                />
              </div>
            ))}
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default SettingsPage;