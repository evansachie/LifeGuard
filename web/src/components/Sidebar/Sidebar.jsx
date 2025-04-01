import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import useUserData from '../../hooks/useUserData';
import { navItems } from '../../data/navItems';
import UserProfileSection from './UserProfileSection';
import ProfileMenu from './ProfileMenu';
import NavigationLinks from './NavigationLinks';
import ThemeToggle from '../../contexts/ThemeToggle';
import LogoutButton from './LogoutButton';
import MobileMenuToggle from './MobileMenuToggle';
import MobileSidebar from './MobileSidebar';

import './Sidebar.css';

function Sidebar({ toggleTheme, isDarkMode, onCollapsedChange }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const { userData, profilePhotoUrl, getDisplayName } = useUserData();

    const sidebarRef = useRef(null);
    const profileMenuRef = useRef(null);

    // Event handlers
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    useEffect(() => {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
        if (isProfileMenuOpen && profileMenuRef.current && 
            !profileMenuRef.current.contains(event.target) && 
            !event.target.closest('.user-info')) {
            setIsProfileMenuOpen(false);
        }
    };

    const handleProfileMenuItemClick = (path) => {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        if (path === 'logout') {
            handleLogout();
        } else {
            navigate(path);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const toggleProfileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsProfileMenuOpen(prevState => !prevState);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleCollapse = () => {
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
                <div className="sidebar-header">
                    <UserProfileSection 
                        displayName={getDisplayName()}
                        profilePhotoUrl={profilePhotoUrl}
                        toggleProfileMenu={toggleProfileMenu}
                        isCollapsed={isCollapsed}
                    />
                    <ThemeToggle 
                        isDarkMode={isDarkMode} 
                        toggleTheme={toggleTheme}
                        isCollapsed={isCollapsed}
                    />
                </div>

                {isProfileMenuOpen && (
                    <ProfileMenu 
                        ref={profileMenuRef}
                        onMenuItemClick={handleProfileMenuItemClick}
                        isCollapsed={isCollapsed}
                    />
                )}

                <NavigationLinks 
                    navItems={navItems}
                    isCollapsed={isCollapsed}
                />

                <LogoutButton 
                    onLogout={handleLogout}
                    isCollapsed={isCollapsed}
                />
            </div>

            <button 
                className={`sidebar-collapse-toggle ${isDarkMode ? 'dark-mode' : ''}`}
                onClick={toggleCollapse}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
            </button>

            <MobileMenuToggle 
                isOpen={isMobileMenuOpen}
                toggleMenu={toggleMobileMenu}
            />

            <MobileSidebar 
                isOpen={isMobileMenuOpen}
                sidebarRef={sidebarRef}
                isDarkMode={isDarkMode}
                displayName={getDisplayName()}
                profilePhotoUrl={profilePhotoUrl}
                toggleProfileMenu={toggleProfileMenu}
                isProfileMenuOpen={isProfileMenuOpen}
                profileMenuRef={profileMenuRef}
                handleProfileMenuItemClick={handleProfileMenuItemClick}
                navItems={navItems}
                handleLogout={handleLogout}
                toggleTheme={toggleTheme}
            />
        </>
    );
}

export default Sidebar;