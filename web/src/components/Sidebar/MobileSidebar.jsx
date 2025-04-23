import React from 'react';
import UserProfileSection from './UserProfileSection';
import ThemeToggle from '../../contexts/ThemeToggle';
import NavigationLinks from './NavigationLinks';
import LogoutButton from './LogoutButton';

const MobileSidebar = ({
  isOpen,
  sidebarRef,
  isDarkMode,
  displayName,
  profilePhotoUrl,
  navItems,
  handleLogout,
  toggleTheme,
}) => {
  return (
    <div
      ref={sidebarRef}
      className={`mobile-sidebar ${isOpen ? 'open' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          <UserProfileSection displayName={displayName} profilePhotoUrl={profilePhotoUrl} />
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>

        <NavigationLinks navItems={navItems} onNavLinkClick={() => {}} />

        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default MobileSidebar;
