import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Check if the user has a saved preference
  const savedTheme = localStorage.getItem('theme');

  // Check if the user prefers dark mode at the OS level
  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initialize state with saved preference, OS preference, or default to light
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    savedTheme ? savedTheme === 'dark' : prefersDarkMode
  );

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Apply theme on initial load and changes
  useEffect(() => {
    // Apply the current theme to the document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);

    // Also set a class on the body for broader styling
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};

export default useTheme;
