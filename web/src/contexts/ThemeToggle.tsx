import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeToggleProps } from '../types/common.types';

export default function ThemeToggle({ isDarkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}
