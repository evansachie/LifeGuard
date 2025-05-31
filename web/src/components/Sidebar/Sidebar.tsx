import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import useUserData from '../../hooks/useUserData';
import { navItems } from '../../data/navItems';
import UserProfileSection from './UserProfileSection';
import NavigationLinks from './NavigationLinks';
import ThemeToggle from '../../contexts/ThemeToggle';
import LogoutButton from './LogoutButton';
import MobileMenuToggle from './MobileMenuToggle';
import MobileSidebar from './MobileSidebar';
import { UseUserDataReturn } from '../../types/common.types';

import './Sidebar.css';

interface SidebarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleTheme, isDarkMode, onCollapsedChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  const location = useLocation();
  const { logout } = useAuth();

  const { profilePhotoUrl, getDisplayName } = useUserData() as UseUserDataReturn;

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Event handlers
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleClickOutside = (event: MouseEvent): void => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = (): void => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState.toString());
    window.dispatchEvent(new Event('sidebarStateChange'));
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsedState);
    }
  };

  return (
    <>
      <div
        className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'} ${
          isCollapsed ? 'collapsed' : ''
        }`}
        ref={sidebarRef}
      >
        {' '}
        <div className="sidebar-header">
          <UserProfileSection displayName={getDisplayName()} profilePhotoUrl={profilePhotoUrl} />
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <NavigationLinks navItems={navItems} onNavLinkClick={() => {}} />
        <LogoutButton onLogout={handleLogout} />
      </div>

      <button
        className={`sidebar-collapse-toggle ${isDarkMode ? 'dark-mode' : ''} z-[900]`}
        onClick={toggleCollapse}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
      </button>

      <MobileMenuToggle isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        sidebarRef={sidebarRef}
        isDarkMode={isDarkMode}
        displayName={getDisplayName()}
        profilePhotoUrl={profilePhotoUrl}
        navItems={navItems}
        handleLogout={handleLogout}
        toggleTheme={toggleTheme}
      />
    </>
  );
};

export default Sidebar;
