/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_API_KEY: string;
  readonly VITE_MODEL_URL: string;
  readonly VITE_SERVICE: string;
  readonly VITE_TEMPERATURE: string;
  readonly VITE_HUMIDITY: string;
  readonly VITE_PRESSURE: string;
  readonly VITE_CO2: string;
  readonly VITE_GAS: string;
  readonly VITE_ACCELEROMETER: string;
  readonly VITE_GYROSCOPE: string;
  readonly VITE_QUATERNION: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_CLOUDINARY_API_SECRET: string;
  readonly VITE_FREESOUND_API_KEY: string;
  readonly VITE_TINYMCE_API_KEY: string;
  readonly VITE_GOOGLE_FIT_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Web Bluetooth API type declarations
declare global {
  interface Navigator {
    bluetooth: Bluetooth;
  }

  interface Bluetooth {
    requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
    getAvailability(): Promise<boolean>;
  }

  interface BluetoothRequestDeviceOptions {
    acceptAllDevices?: boolean;
    filters?: BluetoothLEScanFilter[];
    optionalServices?: BluetoothServiceUUID[];
  }

  interface BluetoothLEScanFilter {
    name?: string;
    namePrefix?: string;
    services?: BluetoothServiceUUID[];
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(
      characteristic: BluetoothCharacteristicUUID
    ): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    properties: BluetoothCharacteristicProperties;
    value?: DataView;
    readValue(): Promise<DataView>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
    removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  }

  interface BluetoothCharacteristicProperties {
    notify: boolean;
    read: boolean;
    write: boolean;
  }

  type BluetoothServiceUUID = string | number;
  type BluetoothCharacteristicUUID = string | number;
}

export {};
