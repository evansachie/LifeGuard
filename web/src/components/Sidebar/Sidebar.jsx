import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaStickyNote, FaCog, FaQuestionCircle, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { TbReportAnalytics } from "react-icons/tb";
import { MdContactEmergency, MdHealthAndSafety, MdOutlineAnalytics } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar({ toggleTheme, isDarkMode }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const profileMenuRef = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const data = await fetchWithAuth(`${API_ENDPOINTS.GET_USER}?id=${userId}`);
                setUserData(data);
                localStorage.setItem('userName', data.userName);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

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

    const getDisplayName = () => {
        if (!userData?.userName) return 'User';
        return userData.userName.split(' ')[0];
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
        if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('.user-info')) {
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

    const renderNavLink = (item) => (
        <Link
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
        </Link>
    );

    const renderUserInfo = () => (
        <div className="user-info" onClick={toggleProfileMenu}>
            <div className="profile-picture-container">
                <img 
                    src={`https://ui-avatars.com/api/?name=${getDisplayName()}&background=random`}
                    alt="Profile" 
                    className="profile-picture" 
                />
            </div>
            <span className="username">{getDisplayName()}</span>
        </div>
    );

    return (
        <>
            <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    {renderUserInfo()}
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
                            renderNavLink(item)
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
                        {renderUserInfo()}
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
                                    renderNavLink(item)
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