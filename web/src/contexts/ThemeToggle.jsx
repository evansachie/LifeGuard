import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle({ isDarkMode, toggleTheme }) {
    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
}
