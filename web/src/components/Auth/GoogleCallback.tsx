import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../../utils/auth';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async (): Promise<void> => {
      try {
        // Check if we have the required URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hasRequiredParams =
          urlParams.get('token') &&
          urlParams.get('userId') &&
          urlParams.get('email') &&
          urlParams.get('userName');

        if (hasRequiredParams) {
        // Process the callback data from URL params
        await handleGoogleCallback();
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
        } else {
          // Missing required parameters
          console.error('Missing required Google callback parameters');
          toast.error('Invalid Google login callback');
          navigate('/log-in');
        }
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
