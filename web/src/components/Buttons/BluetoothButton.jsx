import React from 'react';
import { FaBluetooth, FaBluetoothB } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';

const BluetoothButton = ({ bleDevice, isConnecting, connectToDevice, disconnectDevice }) => {
  return (
    <div className="ble-connect-button">
      {isConnecting ? (
        <button className="connect-btn loading" disabled>
          <Spinner size="small" color="#fff" />
          Connecting...
        </button>
      ) : bleDevice ? (
        <button className="connect-btn connected" onClick={disconnectDevice}>
          <FaBluetoothB />
          Disconnect
        </button>
      ) : (
        <button className="connect-btn" onClick={connectToDevice}>
          <FaBluetooth />
          Connect Device
        </button>
      )}
    </div>
  );
};

export default BluetoothButton;
