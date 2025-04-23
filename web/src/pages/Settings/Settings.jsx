import React, { useState, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';
import Header from '../../components/Settings/Header';
import AppearanceSection from '../../components/Settings/AppearanceSection';
import { Link } from 'react-router-dom';
import {
  FaBell,
  FaUser,
  FaEnvelope,
  FaRuler,
  FaShieldAlt,
  FaFileContract,
  FaChevronRight,
} from 'react-icons/fa';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import Spinner from '../../components/Spinner/Spinner';
import SettingSection from '../../components/Settings/SettingSection';
import ToggleSwitch from '../../components/Settings/ToggleSwitch';

const SettingsPage = ({ isDarkMode, toggleDarkMode }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    email: '',
    username: '',
    units: 'metric',
    language: 'english',
    workoutReminders: true,
    emergencyContacts: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth(
          `${API_ENDPOINTS.GET_USER(localStorage.getItem('userId'))}`,
          {
            method: 'GET',
          }
        );

        setSettings((prev) => ({
          ...prev,
          email: response.email,
          username: response.userName,
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
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    toast.success(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Mock API call
    console.log(`Updating setting: ${key} to ${value}`);
    toast.success('Settings updated successfully!');
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-12 ${
        isDarkMode
          ? 'dark-mode bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <Header isDarkMode={isDarkMode} />
        <AppearanceSection isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        {/* Profile Section */}
        <SettingSection title="Profile" isDarkMode={isDarkMode}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaUser className="text-2xl text-blue-500" />
              <div className="flex-1">
                <div
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
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
                <div
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
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
        <SettingSection title="Preferences" isDarkMode={isDarkMode}>
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
        <SettingSection title="Notifications" isDarkMode={isDarkMode}>
          <div className="space-y-6">
            {['notifications', 'workoutReminders'].map((setting) => (
              <div
                key={setting}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {setting === 'notifications' ? (
                    <FaBell className="text-2xl text-yellow-500" />
                  ) : settings[setting] ? (
                    <IoMdNotifications className="text-2xl text-blue-500" />
                  ) : (
                    <IoMdNotificationsOff className="text-2xl text-gray-500" />
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

        {/* Legal & Privacy */}
        <SettingSection title="Legal & Privacy" isDarkMode={isDarkMode}>
          <div className="space-y-4">
            <Link
              to="/privacy-policy"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FaShieldAlt className="text-2xl text-blue-500" />
                <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Privacy Policy
                </span>
              </div>
              <FaChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </Link>
            <Link
              to="/terms-of-use"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FaFileContract className="text-2xl text-green-500" />
                <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Terms of Service
                </span>
              </div>
              <FaChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </Link>
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default SettingsPage;
