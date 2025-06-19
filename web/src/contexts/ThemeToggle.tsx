import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeToggleProps } from '../types/common.types';

export default function ThemeToggle({ isDarkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      className={`theme-toggle flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all duration-300 ${
        isDarkMode
          ? 'bg-gray-800 border-2 border-gray-700 hover:bg-gray-700'
          : 'bg-white border-2 border-gray-200 hover:bg-gray-100'
      }`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FaSun className="text-yellow-300 transform transition-transform duration-700 hover:rotate-90" />
      ) : (
        <FaMoon className="text-blue-700 transform transition-transform duration-500 hover:scale-110" />
      )}
    </button>
  );
}
