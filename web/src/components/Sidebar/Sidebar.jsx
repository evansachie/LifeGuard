import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaStickyNote, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { TbReportAnalytics } from "react-icons/tb";
import { MdContactEmergency, MdHealthAndSafety, MdOutlineAnalytics } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';

import useUserData from '../../hooks/useUserData';
import UserProfileSection from './UserProfileSection';
import ProfileMenu from './ProfileMenu';
import NavigationLinks from './NavigationLinks';
import ThemeToggle from '../../contexts/ThemeToggle';
import LogoutButton from './LogoutButton';
import MobileMenuToggle from './MobileMenuToggle';
import MobileSidebar from './MobileSidebar';

function Sidebar({ toggleTheme, isDarkMode }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const { userData, profilePhotoUrl, getDisplayName } = useUserData();

    const sidebarRef = useRef(null);
    const profileMenuRef = useRef(null);

    const navItems = [
        { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/analytics', icon: <MdOutlineAnalytics />, label: 'Analytics' },
        { path: '/sticky-notes', icon: <FaStickyNote />, label: 'Sticky Notes' },
        { path: '/health-report', icon: <TbReportAnalytics />, label: 'Health Report' },
        { path: '/pollution-tracker', icon: <FaMap />, label: 'Pollution Tracker' },
        { path: '/health-tips', icon: <MdHealthAndSafety />, label: 'Health Tips' },
        { path: '/emergency-contacts', icon: <MdContactEmergency />, label: 'Emergency Contacts' },
        { path: '/settings', icon: <FaCog />, label: 'Settings' },
        { path: '/help', icon: <FaQuestionCircle />, label: 'Help' },
    ];

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

    return (
        <>
            <div 
                className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`} 
                ref={sidebarRef}
            >
                <div className="sidebar-header">
                    <UserProfileSection 
                        displayName={getDisplayName()}
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
                />

                <LogoutButton onLogout={handleLogout} />
            </div>

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