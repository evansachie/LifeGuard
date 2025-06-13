import { FaBluetooth, FaSpinner, FaBluetoothB } from 'react-icons/fa';
import { BLEDevice } from '../../types/ble.types';

interface BluetoothButtonProps {
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  isScanning?: boolean;
  connectToDevice: () => void;
  disconnectDevice: () => void;
}

const BluetoothButton = ({
  bleDevice,
  isConnecting,
  isScanning = false,
  connectToDevice,
  disconnectDevice,
}: BluetoothButtonProps) => {
  const getButtonText = () => {
    if (isScanning) return 'Scanning...';
    if (isConnecting) return 'Connecting...';
    if (bleDevice?.connected) {
      const deviceName = bleDevice.name || 'Arduino Device';
      const shortName = deviceName.length > 15 ? `${deviceName.substring(0, 15)}...` : deviceName;
      return `Connected to ${shortName}`;
    }
    return 'Connect Bluetooth Device';
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
        style={{
          minWidth: '220px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
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
        <span style={{ marginLeft: '8px' }}>{getButtonText()}</span>
      </button>
    </div>
  );
};

export default BluetoothButton;
