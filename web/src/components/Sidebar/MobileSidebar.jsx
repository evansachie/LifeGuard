import React from 'react';
import UserProfileSection from './UserProfileSection';
import ThemeToggle from '../../contexts/ThemeToggle';
import NavigationLinks from './NavigationLinks';
import LogoutButton from './LogoutButton';
import ProfileMenu from './ProfileMenu';

const MobileSidebar = ({ 
  isOpen,
  sidebarRef,
  isDarkMode,
  displayName,
  profilePhotoUrl,
  toggleProfileMenu,
  isProfileMenuOpen,
  profileMenuRef,
  handleProfileMenuItemClick,
  navItems,
  handleLogout,
  toggleTheme
}) => {
  return (
    <div 
      ref={sidebarRef} 
      className={`mobile-sidebar ${isOpen ? 'open' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          <UserProfileSection 
            displayName={displayName}
            profilePhotoUrl={profilePhotoUrl}
            toggleProfileMenu={toggleProfileMenu}
          />
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        </div>
        
        {isProfileMenuOpen && (
          <ProfileMenu 
            ref={profileMenuRef}
            onMenuItemClick={handleProfileMenuItemClick}
          />
        )}
        
        <NavigationLinks 
          navItems={navItems} 
          onNavLinkClick={() => {}}
        />
        
        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default MobileSidebar;
