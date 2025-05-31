import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Check URL parameters for auth data
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  const userId = urlParams.get('userId');
  const email = urlParams.get('email');
  const userName = urlParams.get('userName');

  // If we have auth data in URL, store it first
  if (token && userId && email) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName || email);
    localStorage.setItem('email', email);

    // Clean up URL params
    window.history.replaceState({}, document.title, location.pathname);
    return <>{children}</>;
  }

  // Regular auth check
  const hasToken = localStorage.getItem('token');
  if (!hasToken) {
    toast.error('Please login to access this page');
    return <Navigate to="/log-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
