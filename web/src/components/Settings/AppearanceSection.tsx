import React from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import SettingSection from './SettingSection';
import ToggleSwitch from './ToggleSwitch';

interface AppearanceSectionProps {
  isDarkMode: boolean;
  handleThemeToggle: () => void;
}

const AppearanceSection = ({ isDarkMode, handleThemeToggle }: AppearanceSectionProps) => {
  return (
  <SettingSection title="Appearance" isDarkMode={isDarkMode}>
      <div className="space-y-6">
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors">
      <div className="flex items-center gap-4">
        {isDarkMode ? (
              <FaMoon className="text-2xl text-blue-400" />
        ) : (
          <FaSun className="text-2xl text-yellow-500" />
        )}
            <div className="flex flex-col">
        <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isDarkMode
                  ? 'Easier on the eyes in low light'
                  : 'Better visibility in bright light'}
        </span>
      </div>
          </div>
      <ToggleSwitch enabled={isDarkMode} onChange={handleThemeToggle} isDarkMode={isDarkMode} />
    </div>

        {/* Color Scheme Option - Disabled for now */}
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors opacity-50">
          <div className="flex items-center gap-4">
            <FaPalette className="text-2xl text-purple-500" />
            <div className="flex flex-col">
              <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Color Scheme
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose your accent color
              </span>
            </div>
          </div>
          <select
            disabled
            className={`p-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-700/50 border-gray-600 text-gray-400'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            } cursor-not-allowed`}
          >
            <option>Default Blue</option>
            <option>Coming Soon</option>
          </select>
        </div>
      </div>
  </SettingSection>
);
};

export default AppearanceSection;
