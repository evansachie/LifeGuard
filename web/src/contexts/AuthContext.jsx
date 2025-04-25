import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const logout = useCallback(() => {
    const theme = localStorage.getItem('theme');

    localStorage.clear();
    localStorage.setItem('theme', theme);

    setIsAuthenticated(false);
    navigate('/log-in', { replace: true });
  }, [navigate]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
