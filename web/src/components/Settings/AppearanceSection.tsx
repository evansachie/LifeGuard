import { FaMoon, FaSun } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch';
import SettingSection from './SettingSection';

interface AppearanceSectionProps {
  isDarkMode: boolean;
  handleThemeToggle: (enabled: boolean) => void;
}

const AppearanceSection = ({ isDarkMode, handleThemeToggle }: AppearanceSectionProps) => (
  <SettingSection title="Appearance" isDarkMode={isDarkMode}>
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/5 transition-colors">
      <div className="flex items-center gap-4">
        {isDarkMode ? (
          <FaMoon className="text-2xl text-yellow-500" />
        ) : (
          <FaSun className="text-2xl text-yellow-500" />
        )}
        <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Dark Mode
        </span>
      </div>
      <ToggleSwitch enabled={isDarkMode} onChange={handleThemeToggle} isDarkMode={isDarkMode} />
    </div>
  </SettingSection>
);

export default AppearanceSection;
