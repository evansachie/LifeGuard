import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const AppLayout = ({ children, isDarkMode, toggleTheme }) => {
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
