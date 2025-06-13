import { useEffect, useState } from 'react';
import { FaCloud, FaCloudUploadAlt, FaExclamationTriangle, FaDatabase } from 'react-icons/fa';

interface FirebaseStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync?: number;
  isDarkMode?: boolean;
}

const FirebaseStatus = ({
  isConnected,
  isLoading,
  error,
  lastSync,
  isDarkMode = false,
}: FirebaseStatusProps) => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('No data yet');
  const [updateCounter, setUpdateCounter] = useState<number>(0);

  // Update the last sync time display every second
  useEffect(() => {
    if (lastSync) {
      const formatTime = () => {
        const now = Date.now();
        const diff = now - lastSync;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        return new Date(lastSync).toLocaleTimeString();
      };

      setLastUpdateTime(formatTime());
      const timer = setInterval(() => {
        setLastUpdateTime(formatTime());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lastSync]);

  // Update counter when lastSync changes
  useEffect(() => {
    if (lastSync) {
      setUpdateCounter((prev) => prev + 1);
    }
  }, [lastSync]);

  const getStatusIcon = () => {
    if (error) return <FaExclamationTriangle className="text-red-500" />;
    if (isLoading && !lastSync) return <FaCloudUploadAlt className="text-blue-500 animate-pulse" />;
    if (isConnected && lastSync) return <FaDatabase className="text-green-500" />;
    return <FaCloud className="text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) return 'Firebase Error';
    if (isLoading && !lastSync) return 'Connecting...';
    if (isConnected && lastSync)
      return `Data Sync ${updateCounter > 0 ? `(${updateCounter})` : ''}`;
    if (isConnected) return 'Connected';
    return 'No Data';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isLoading && !lastSync) return 'text-blue-500';
    if (isConnected && lastSync) return 'text-green-500';
    return 'text-gray-400';
  };

  return (
    <div className={`firebase-status ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex items-center gap-2 p-2">
        {getStatusIcon()}
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
          <span className="text-xs opacity-70">{lastUpdateTime}</span>
        </div>
      </div>

      {error && (
        <div className="error-message mt-2 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default FirebaseStatus;
