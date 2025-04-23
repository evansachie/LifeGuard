import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const AppLayout = ({ children, isDarkMode, toggleTheme }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      setIsSidebarCollapsed(isCollapsed);
      // Force layout recalculation
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('storage', handleStorageChange);
    // Listen for sidebar state changes
    window.addEventListener('sidebarStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarStateChange', handleStorageChange);
    };
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <main className={`content-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
