import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../../utils/auth';
import { toast } from 'react-toastify';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async (): Promise<void> => {
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
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Completing Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
