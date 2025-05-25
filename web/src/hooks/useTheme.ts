import { useState, useEffect } from 'react';

interface ThemeHookResult {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useTheme = (): ThemeHookResult => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const toggleTheme = (): void => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};
