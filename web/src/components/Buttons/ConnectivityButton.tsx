import React from 'react';
import { FaBluetooth, FaDatabase, FaCloudUploadAlt, FaExclamationTriangle } from 'react-icons/fa';
import { TbBluetoothConnected } from 'react-icons/tb';
import { BLEDevice } from '../../types/ble.types';

interface ConnectivityButtonProps {
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  connectToDevice: () => Promise<void>;
  disconnectDevice: () => Promise<void>;
  firebaseConnected: boolean;
  firebaseLoading: boolean;
  firebaseError: string | null;
  lastSync?: number;
  syncCount?: number;
  isDarkMode?: boolean;
}

const ConnectivityButton: React.FC<ConnectivityButtonProps> = ({
  bleDevice,
  isConnecting,
  connectToDevice,
  disconnectDevice,
  firebaseConnected,
  firebaseLoading,
  firebaseError,
  lastSync,
  syncCount = 0,
  isDarkMode = false,
}) => {
  const formatLastSync = () => {
    if (!lastSync) return '';
    const now = Date.now();
    const diff = now - lastSync;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return new Date(lastSync).toLocaleTimeString();
    return new Date(lastSync).toLocaleDateString();
  };

  // Button text based on connection state
  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (bleDevice?.connected) return `Connected to ${bleDevice.name || 'Arduino'}`;
    return 'Connect Arduino Device';
  };

  // Firebase status text
  const getFirebaseStatusText = () => {
    if (firebaseError) return 'Firebase Error';
    if (firebaseLoading) return 'Syncing...';
    if (firebaseConnected && lastSync) return `Data Sync (${syncCount})`;
    return '';
  };

  const getFirebaseStatusIcon = () => {
    if (firebaseError) return <FaExclamationTriangle className="text-red-300" />;
    if (firebaseLoading) return <FaCloudUploadAlt className="text-blue-300 animate-pulse" />;
    if (firebaseConnected && lastSync) return <FaDatabase className="text-green-300" />;
    return null;
  };

  const handleClick = async () => {
    if (bleDevice?.connected) {
      await disconnectDevice();
    } else {
      await connectToDevice();
    }
  };

  return (
    <div className="connectivity-button-container">
      <button
        className={`connect-btn ${bleDevice?.connected ? 'connected' : ''} ${
          isConnecting ? 'loading' : ''
        }`}
        onClick={handleClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="loading-spinner"></span>
        ) : bleDevice?.connected ? (
          <TbBluetoothConnected size={18} />
        ) : (
          <FaBluetooth size={18} />
        )}

        <span className="button-text !text-white">{getButtonText()}</span>

        {bleDevice?.connected && (
          <div className="firebase-status-indicator">
            {getFirebaseStatusIcon()}
            <span className="firebase-status-text">{getFirebaseStatusText()}</span>
          </div>
        )}
      </button>

      {bleDevice?.connected && lastSync && (
        <div className={`last-sync-time ${isDarkMode ? 'dark' : ''}`}>
          Last update: {formatLastSync()}
        </div>
      )}
    </div>
  );
};

export default ConnectivityButton;
