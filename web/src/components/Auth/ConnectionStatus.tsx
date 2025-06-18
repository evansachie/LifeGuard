import { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

interface ConnectionStatusProps {
  isDarkMode?: boolean;
}

const ConnectionStatus = ({ isDarkMode = false }: ConnectionStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'slow' | 'offline'>(
    'checking'
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server status
    const checkServerStatus = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch('https://lifeguard-hiij.onrender.com/', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          setServerStatus(responseTime > 5000 ? 'slow' : 'online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    if (isOnline) {
      checkServerStatus();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-md ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}
      >
        <FaExclamationTriangle />
        <span className="text-sm">No internet connection</span>
      </div>
    );
  }

  if (serverStatus === 'slow') {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-md ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}
      >
        <FaWifi className="animate-pulse" />
        <span className="text-sm">Server responding slowly</span>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-md ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}
      >
        <FaExclamationTriangle />
        <span className="text-sm">Server unavailable</span>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;
