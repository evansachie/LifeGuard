import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../../utils/auth';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        // Process the callback data from URL params
        await handleGoogleCallback();
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google login');
        navigate('/log-in');
      }
    };

    completeAuth();
  }, [navigate]);

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
