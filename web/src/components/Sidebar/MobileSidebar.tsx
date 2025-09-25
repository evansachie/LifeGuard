import { RefObject } from 'react';
import UserProfileSection from './UserProfileSection';
import ThemeToggle from '../../contexts/ThemeToggle';
import NavigationLinks from './NavigationLinks';
import LogoutButton from './LogoutButton';
import { NavItem } from '../../types/common.types';

interface MobileSidebarProps {
  isOpen: boolean;
  sidebarRef: RefObject<HTMLDivElement>;
  isDarkMode: boolean;
  displayName: string;
  profilePhotoUrl: string | null;
  navItems: NavItem[];
  handleLogout: () => void;
  toggleTheme: () => void;
}

const MobileSidebar = ({
  isOpen,
  sidebarRef,
  isDarkMode,
  displayName,
  profilePhotoUrl,
  navItems,
  handleLogout,
  toggleTheme,
}: MobileSidebarProps) => {
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
