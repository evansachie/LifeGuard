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

import './Sidebar.css';

function Sidebar({ toggleTheme, isDarkMode, onCollapsedChange }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    const location = useLocation();
    const { logout } = useAuth();

    const { profilePhotoUrl, getDisplayName } = useUserData();

    const sidebarRef = useRef(null);

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

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
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
                        isCollapsed={isCollapsed}
                    />
                    <ThemeToggle 
                        isDarkMode={isDarkMode} 
                        toggleTheme={toggleTheme}
                        isCollapsed={isCollapsed}
                    />
                </div>

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
                navItems={navItems}
                handleLogout={handleLogout}
                toggleTheme={toggleTheme}
            />
        </>
    );
}

export default Sidebar;