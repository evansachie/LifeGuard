import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGoogleCallback } from '../../utils/auth';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const response = await fetch(location.href);
        const data = await response.json();

        await handleGoogleCallback(data);
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google login');
        navigate('/log-in');
      }
    };

    completeAuth();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loader"></div>
        <p className="mt-4">Completing Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
