import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaStickyNote,FaCog, FaQuestionCircle, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { TbReportAnalytics } from "react-icons/tb";
import { MdContactEmergency, MdHealthAndSafety } from "react-icons/md";

import { FaMap } from "react-icons/fa";
import DefaultUser from '../../assets/lifeguard/user.png';
import './Sidebar.css';

function Sidebar({ toggleTheme, isDarkMode }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const profileMenuRef = useRef(null);

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

    // useEffect(() => {
    //     fetchUserDetails();
    // }, []);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
        if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('.user-info')) {
            setIsProfileMenuOpen(false);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/users/details', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsername(response.data.username);
            setProfilePictureUrl(response.data.profilePictureUrl);
        } catch (error) {
            console.error('Error fetching user details:', error);
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
        localStorage.removeItem('token');
        navigate('/');
    };

    const toggleProfileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsProfileMenuOpen(prevState => !prevState);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = [
        { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/sticky-notes', icon: <FaStickyNote />, label: 'Sticky Notes' },
        { path: '/health-report', icon: <TbReportAnalytics />, label: 'Health Report' },
        { path: '/pollution-tracker', icon: <FaMap />, label: 'Pollution Tracker' },
        { path: '/health-tips', icon: <MdHealthAndSafety />, label: 'Health Tips' },
        { path: '/emergency-contacts', icon: <MdContactEmergency />, label: 'Emergency Contacts' },
        { path: '/settings', icon: <FaCog />, label: 'Settings' },
        { path: '/help', icon: <FaQuestionCircle />, label: 'Help' },
    ];

    const renderProfileMenu = () => (
        <div ref={profileMenuRef} className="profile-menu">
            <button 
                className="profile-menu-item" 
                onMouseDown={() => handleProfileMenuItemClick('/profile')}>
                Edit Profile
            </button>
            <button 
                className="profile-menu-item" 
                onMouseDown={() => handleProfileMenuItemClick('/settings')}>
                Settings
            </button>
            <button 
                className="profile-menu-item logout" 
                onMouseDown={() => handleProfileMenuItemClick('logout')}>
                Log Out
            </button>
        </div>
    );

    return (
        <>
            <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    <div className="user-info" onClick={toggleProfileMenu}>
                        <div className="profile-picture-container">
                            <img src={profilePictureUrl || DefaultUser} alt="Profile" className="profile-picture" />
                        </div>
                        {/* <span className="username">{username}</span> */}
                        <span className="username">Evans</span>
                    </div>
                    <button className="theme-toggle" onClick={toggleTheme}> 
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>

                {isProfileMenuOpen && renderProfileMenu()}

                <nav className="sidebar-nav">
                {navItems.map((item, index) => (
                    <div key={index}>
                        {item.subItems ? (
                            <>
                                <div className={`nav-link ${isActivityDropdownOpen ? 'active' : ''}`} onClick={() => setIsActivityDropdownOpen(!isActivityDropdownOpen)}>
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </div>
                                {isActivityDropdownOpen && (
                                    <div className="subnav">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                to={subItem.path}
                                                className={`nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className="nav-icon">{subItem.icon}</span>
                                                <span className="nav-label">{subItem.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        )}
                    </div>
                ))}
                </nav>

                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </button>
            </div>

            <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div ref={sidebarRef} className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="user-info" onClick={toggleProfileMenu}>
                            <div className="profile-picture-container">
                                <img src={profilePictureUrl || DefaultUser} alt="Profile" className="profile-picture" />
                            </div>
                            <span className="username">{username}</span>
                        </div>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {isDarkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                    {isProfileMenuOpen && renderProfileMenu()}
                    <nav className="sidebar-nav">
                        {navItems.map((item, index) => (
                            <div key={index}>
                                {item.subItems ? (
                                    <>
                                        <div className={`nav-link ${isActivityDropdownOpen ? 'active' : ''}`} onClick={() => setIsActivityDropdownOpen(!isActivityDropdownOpen)}>
                                            <span className="nav-icon">{item.icon}</span>
                                            <span className="nav-label">{item.label}</span>
                                        </div>
                                        {isActivityDropdownOpen && (
                                            <div className="subnav">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={subItem.path}
                                                        className={`nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span className="nav-icon">{subItem.icon}</span>
                                                        <span className="nav-label">{subItem.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;