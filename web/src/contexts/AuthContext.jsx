import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    const logout = useCallback(() => {
        // Clear all auth data
        localStorage.clear();
        setIsAuthenticated(false);
        
        // Clean navigation
        navigate('/log-in', { replace: true });
    }, [navigate]);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        // Set other user data...
        setIsAuthenticated(true);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 