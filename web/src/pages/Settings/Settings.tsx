import React, { useState, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { withErrorHandling } from '../../utils/errorHandler';
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

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface SettingsState {
  notifications: boolean;
  email: string;
  username: string;
  units: 'metric' | 'imperial';
  language: string;
  workoutReminders: boolean;
  emergencyContacts: boolean;
}

const SettingsPage = ({ isDarkMode, toggleTheme }: SettingsProps) => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    email: '',
    username: '',
    units: 'metric',
    language: 'english',
    workoutReminders: true,
    emergencyContacts: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      setIsLoading(true);

      await withErrorHandling(
        async () => {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            throw new Error('User ID not found');
          }

          const response = await fetchWithAuth(`${API_ENDPOINTS.GET_USER(userId)}`, {
            method: 'GET',
          });

          setSettings((prev) => ({
            ...prev,
            email: response.email || '',
            username: response.userName || '',
          }));
        },
        'Fetch user data',
        true,
        'Failed to load user information'
      );

      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleThemeToggle = (): void => {
    // Use the toggleTheme function from props
    toggleTheme();
    toast.success(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
  };

  const handleSettingChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ): void => {
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
                    id="username-input"
                    type="text"
                    value={settings.username}
                    readOnly
                    title="Your username (read-only)"
                    placeholder="Username will appear here"
                    aria-label="Username field (read-only)"
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
                    id="email-input"
                    type="email"
                    value={settings.email}
                    readOnly
                    title="Your email address (read-only)"
                    placeholder="Email address will appear here"
                    aria-label="Email address field (read-only)"
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
                <div className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Measurement Units
                </div>
              </div>
              <select
                id="units-select"
                value={settings.units}
                onChange={(e) =>
                  handleSettingChange('units', e.target.value as 'metric' | 'imperial')
                }
                title="Choose your preferred measurement units"
                aria-label="Select measurement units preference"
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
            {(['notifications', 'workoutReminders'] as const).map((setting) => (
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
                  isDarkMode={isDarkMode}
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
