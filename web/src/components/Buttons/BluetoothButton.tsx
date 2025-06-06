import React from 'react';
import { FaBluetooth, FaSpinner, FaBluetoothB } from 'react-icons/fa';
import { BLEDevice } from '../../types/ble.types';

interface BluetoothButtonProps {
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  isScanning?: boolean;
  connectToDevice: () => void;
  disconnectDevice: () => void;
}

const BluetoothButton: React.FC<BluetoothButtonProps> = ({
  bleDevice,
  isConnecting,
  isScanning = false,
  connectToDevice,
  disconnectDevice,
}) => {
  const getButtonText = () => {
    if (isScanning) return 'Scanning...';
    if (isConnecting) return 'Connecting...';
    if (bleDevice?.connected) return `Connected to ${bleDevice.name}`;
    return 'Connect Bluetooth';
  };

  const getButtonClass = () => {
    const baseClass = 'connect-btn';
    if (bleDevice?.connected) return `${baseClass} connected`;
    if (isConnecting || isScanning) return `${baseClass} loading`;
    return baseClass;
  };

  const handleClick = () => {
    if (bleDevice?.connected) {
      disconnectDevice();
    } else {
      connectToDevice();
    }
  };

  return (
    <div className="ble-connect-button">
      <button
        className={getButtonClass()}
        onClick={handleClick}
        disabled={isConnecting || isScanning}
        type="button"
        aria-label={
          bleDevice?.connected ? 'Disconnect from Bluetooth device' : 'Connect to Bluetooth device'
        }
      >
        {isConnecting || isScanning ? (
          <FaSpinner className="animate-spin" />
        ) : bleDevice?.connected ? (
          <FaBluetoothB />
        ) : (
          <FaBluetooth />
        )}
        {getButtonText()}
      </button>
    </div>
  );
};

export default BluetoothButton;
