import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const BLEContext = createContext(null);

export const BLE_UUID = {
    SERVICE: import.meta.env.VITE_SERVICE,
    TEMPERATURE: import.meta.env.VITE_TEMPERATURE,
    HUMIDITY: import.meta.env.VITE_HUMIDITY,
    PRESSURE: import.meta.env.VITE_PRESSURE,
    CO2: import.meta.env.VITE_CO2,
    GAS: import.meta.env.VITE_GAS,
    ACCELEROMETER: import.meta.env.VITE_ACCELEROMETER,
    GYROSCOPE: import.meta.env.VITE_GYROSCOPE,
    QUATERNION: import.meta.env.VITE_QUATERNION
};

export function BLEProvider({ children }) {
    const [bleDevice, setBleDevice] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [sensorData, setSensorData] = useState(null);

    const connectToDevice = useCallback(async () => {
        try {
            setIsConnecting(true);
            
            // Log UUIDs for debugging
            console.log('BLE UUIDs:', BLE_UUID);

            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'NiclaSenseME-' }],
                optionalServices: [BLE_UUID.SERVICE]
            });

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(BLE_UUID.SERVICE);

            // Validate UUIDs before getting characteristics
            const characteristicUUIDs = [
                BLE_UUID.TEMPERATURE,
                BLE_UUID.HUMIDITY,
                BLE_UUID.PRESSURE,
                BLE_UUID.CO2,
                BLE_UUID.GAS,
                BLE_UUID.ACCELEROMETER,
                BLE_UUID.GYROSCOPE,
                BLE_UUID.QUATERNION
            ];

            // Check for undefined UUIDs
            const validUUIDs = characteristicUUIDs.filter(uuid => uuid !== undefined);
            if (validUUIDs.length !== characteristicUUIDs.length) {
                console.error('Some UUIDs are undefined:', 
                    characteristicUUIDs.map((uuid, i) => 
                        `${Object.keys(BLE_UUID)[i+1]}: ${uuid}`
                    )
                );
                throw new Error('Invalid UUIDs configuration');
            }

            // Get characteristics
            const characteristics = await Promise.all(
                validUUIDs.map(uuid => service.getCharacteristic(uuid))
            );

            setBleDevice(device);
            startDataReading(characteristics);
            toast.success('Connected to Nicla Sense ME');

        } catch (error) {
            console.error('Bluetooth Error:', error);
            toast.error(error.message || 'Failed to connect to device');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const startDataReading = useCallback(async (characteristics) => {
        const [tempChar, humChar, pressChar, co2Char, gasChar, accChar, gyroChar, quatChar] = characteristics;

        // Enable notifications for motion sensors
        await accChar.startNotifications();
        await gyroChar.startNotifications();
        await quatChar.startNotifications();

        // Add event listeners for notifications
        accChar.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            setSensorData(prev => ({
                ...prev,
                accelerometer: {
                    x: value.getFloat32(0, true),
                    y: value.getFloat32(4, true),
                    z: value.getFloat32(8, true)
                }
            }));
        });

        gyroChar.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            setSensorData(prev => ({
                ...prev,
                gyroscope: {
                    x: value.getFloat32(0, true),
                    y: value.getFloat32(4, true),
                    z: value.getFloat32(8, true)
                }
            }));
        });

        quatChar.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            setSensorData(prev => ({
                ...prev,
                quaternion: {
                    x: value.getFloat32(0, true),
                    y: value.getFloat32(4, true),
                    z: value.getFloat32(8, true),
                    w: value.getFloat32(12, true)
                }
            }));
        });

        // Poll other sensors less frequently
        const pollEnvironmentalData = async () => {
            try {
                const [temp, hum, press, co2, gas] = await Promise.all([
                    tempChar.readValue(),
                    humChar.readValue(),
                    pressChar.readValue(),
                    co2Char.readValue(),
                    gasChar.readValue()
                ]);

                setSensorData(prev => ({
                    ...prev,
                    temperature: temp.getFloat32(0, true),
                    humidity: hum.getUint8(0),
                    pressure: press.getFloat32(0, true),
                    co2: co2.getInt32(0, true),
                    gas: gas.getUint32(0, true)
                }));
            } catch (error) {
                console.error('Error reading sensor data:', error);
            }
        };

        const envInterval = setInterval(pollEnvironmentalData, 1000);
        pollEnvironmentalData(); // Initial read

        return () => {
            clearInterval(envInterval);
            accChar.stopNotifications();
            gyroChar.stopNotifications();
            quatChar.stopNotifications();
        };
    }, []);

    const disconnectDevice = useCallback(async () => {
        if (bleDevice) {
            await bleDevice.gatt.disconnect();
            setBleDevice(null);
            setSensorData(null);
            toast.info('Device disconnected');
        }
    }, [bleDevice]);

    return (
        <BLEContext.Provider value={{
            bleDevice,
            isConnecting,
            sensorData,
            connectToDevice,
            disconnectDevice
        }}>
            {children}
        </BLEContext.Provider>
    );
}

export function useBLE() {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error('useBLE must be used within a BLEProvider');
    }
    return context;
} 