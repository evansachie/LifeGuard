import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { ThemeContext } from '../contexts/ThemeContext';

export const AppLayout = ({ children }) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    
    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            <div className="content-container">
                {children || <Outlet />}
            </div>
        </div>
    );
};

export const AuthLayout = ({ children }) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    
    return (
        <div className={`auth-layout ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="auth-container">
                {React.cloneElement(children, { isDarkMode, toggleTheme })}
            </div>
        </div>
    );
};