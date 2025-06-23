import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import '../config/constants.dart';
import '../models/ble_device_model.dart';
import '../models/sensor_data_model.dart';

class BleService {
  static final BleService _instance = BleService._internal();
  factory BleService() => _instance;
  BleService._internal();
  
  final StreamController<List<BleDeviceModel>> _devicesController = 
      StreamController<List<BleDeviceModel>>.broadcast();
  final StreamController<SensorDataModel> _sensorDataController = 
      StreamController<SensorDataModel>.broadcast();
  final StreamController<String> _connectionStatusController = 
      StreamController<String>.broadcast();
  
  Stream<List<BleDeviceModel>> get devicesStream => _devicesController.stream;
  Stream<SensorDataModel> get sensorDataStream => _sensorDataController.stream;
  Stream<String> get connectionStatusStream => _connectionStatusController.stream;
  
  final List<BleDeviceModel> _discoveredDevices = [];
  BleDeviceModel? _connectedDevice;
  BluetoothCharacteristic? _temperatureCharacteristic;
  BluetoothCharacteristic? _humidityCharacteristic;
  BluetoothCharacteristic? _pressureCharacteristic;
  BluetoothCharacteristic? _accelerometerCharacteristic;
  BluetoothCharacteristic? _gyroscopeCharacteristic;
  BluetoothCharacteristic? _quaternionCharacteristic;
  BluetoothCharacteristic? _bsecCharacteristic;
  BluetoothCharacteristic? _co2Characteristic;
  BluetoothCharacteristic? _gasCharacteristic;
  BluetoothCharacteristic? _inferenceCharacteristic;
  BluetoothCharacteristic? _rgbLedCharacteristic;
  
  bool _isScanning = false;
  bool _isInitialized = false;
  
  // Current sensor data
  SensorDataModel? _currentSensorData;
  
  Future<bool> initialize() async {
    if (_isInitialized) return true;
    
    try {
      // Check if Bluetooth is supported
      if (await FlutterBluePlus.isSupported == false) {
        debugPrint("Bluetooth not supported by this device");
        return false;
      }
      
      // Request permissions
      final permissionGranted = await _requestPermissions();
      if (!permissionGranted) {
        debugPrint("Bluetooth permissions not granted");
        return false;
      }
      
      // Check if Bluetooth is on
      final adapterState = await FlutterBluePlus.adapterState.first;
      if (adapterState != BluetoothAdapterState.on) {
        debugPrint("Bluetooth is not turned on");
        // Try to turn on Bluetooth
        try {
          await FlutterBluePlus.turnOn();
        } catch (e) {
          debugPrint("Could not turn on Bluetooth: $e");
          return false;
        }
      }
      
      _isInitialized = true;
      _connectionStatusController.add('BLE Initialized');
      return true;
    } catch (e) {
      debugPrint('BLE initialization error: $e');
      return false;
    }
  }
  
  Future<bool> _requestPermissions() async {
    final permissions = [
      Permission.bluetooth,
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.location,
    ];
    
    final statuses = await permissions.request();
    return statuses.values.every((status) => 
        status == PermissionStatus.granted || 
        status == PermissionStatus.limited);
  }
  
  Future<void> startScan() async {
    if (_isScanning) return;
    
    if (!_isInitialized) {
      final initialized = await initialize();
      if (!initialized) return;
    }
    
    try {
      _isScanning = true;
      _discoveredDevices.clear();
      _connectionStatusController.add('Scanning for devices...');
      
      debugPrint("Starting BLE scan...");
      
      // Listen to scan results
      final scanSubscription = FlutterBluePlus.scanResults.listen((results) {
        debugPrint("Scan results received: ${results.length} devices");
        
        for (ScanResult result in results) {
          final device = result.device;
          // Try all possible name fields (platformName, advName, localName)
          String name = '';
          if (device.platformName.isNotEmpty) {
            name = device.platformName;
          } else if (result.advertisementData.advName.isNotEmpty) {
            name = result.advertisementData.advName;
          } else if (result.advertisementData.localName.isNotEmpty) {
            name = result.advertisementData.localName;
          }

          debugPrint("Found device: $name (${device.remoteId})");

          // Check for LifeGuard devices - be more flexible with naming
          if (name.isNotEmpty && (
              name.startsWith(Constants.bleDevicePrefix) ||
              name.toLowerCase().contains('nicla') ||
              name.toLowerCase().contains('lifeguard'))) {

            debugPrint("LifeGuard device found: $name");

            final existingIndex = _discoveredDevices.indexWhere(
                (d) => d.id == device.remoteId.toString());

            final bleDevice = BleDeviceModel(
              device: device,
              name: name,
              id: device.remoteId.toString(),
              rssi: result.rssi,
              lastSeen: DateTime.now(),
            );

            if (existingIndex >= 0) {
              _discoveredDevices[existingIndex] = bleDevice;
            } else {
              _discoveredDevices.add(bleDevice);
              debugPrint("Added device to list: $name");
            }

            _devicesController.add(List.from(_discoveredDevices));
          }
        }
      });
      
      // Start scanning - remove service filter to find all devices
      await FlutterBluePlus.startScan(
        timeout: const Duration(seconds: Constants.bleScanTimeoutSeconds),
        // Remove withServices filter to scan for all devices
        // withServices: [Guid(Constants.bleServiceUuid)],
      );
      
      debugPrint("Scan started, waiting for results...");
      
      // Wait for scan to complete
      await Future.delayed(const Duration(seconds: Constants.bleScanTimeoutSeconds));
      
      await scanSubscription.cancel();
      await FlutterBluePlus.stopScan();
      
      _isScanning = false;
      _connectionStatusController.add('Scan completed - Found ${_discoveredDevices.length} devices');
      debugPrint("Scan completed. Found ${_discoveredDevices.length} LifeGuard devices");
      
    } catch (e) {
      _isScanning = false;
      _connectionStatusController.add('Scan error: $e');
      debugPrint('BLE scan error: $e');
    }
  }
  
  Future<bool> connectToDevice(BleDeviceModel deviceModel) async {
    try {
      _connectionStatusController.add('Connecting to ${deviceModel.name}...');
      deviceModel.connectionStatus = BleConnectionStatus.connecting;
      _devicesController.add(List.from(_discoveredDevices));
      
      debugPrint("Attempting to connect to ${deviceModel.name}");
      
      // Connect to device
      await deviceModel.device.connect(
        timeout: const Duration(seconds: Constants.bleConnectionTimeoutSeconds),
        autoConnect: false,
      );
      
      debugPrint("Connected to device, discovering services...");
      
      // Discover services
      List<BluetoothService> services = await deviceModel.device.discoverServices();
      
      debugPrint("Discovered ${services.length} services");
      for (var service in services) {
        debugPrint("Service UUID: ${service.uuid}");
      }
      
      // Find LifeGuard service - be more flexible
      BluetoothService? lifeGuardService;
      for (var service in services) {
        final serviceUuid = service.uuid.toString().toLowerCase();
        debugPrint("Checking service: $serviceUuid");
        
        if (serviceUuid.contains('19b10000') || 
            serviceUuid == Constants.bleServiceUuid.toLowerCase()) {
          lifeGuardService = service;
          debugPrint("Found LifeGuard service: $serviceUuid");
          break;
        }
      }
      
      if (lifeGuardService == null) {
        debugPrint("LifeGuard service not found. Available services:");
        for (var service in services) {
          debugPrint("  - ${service.uuid}");
        }
        throw Exception('LifeGuard service not found');
      }
      
      // Get characteristics
      await _setupCharacteristics(lifeGuardService);
      
      // Setup notifications for streaming data
      await _setupNotifications();
      
      _connectedDevice = deviceModel;
      deviceModel.connectionStatus = BleConnectionStatus.connected;
      _devicesController.add(List.from(_discoveredDevices));
      _connectionStatusController.add('Connected to ${deviceModel.name}');
      
      debugPrint("Successfully connected to ${deviceModel.name}");
      return true;
      
    } catch (e) {
      deviceModel.connectionStatus = BleConnectionStatus.disconnected;
      _devicesController.add(List.from(_discoveredDevices));
      _connectionStatusController.add('Connection failed: $e');
      debugPrint('BLE connection error: $e');
      return false;
    }
  }
  
  Future<void> _setupCharacteristics(BluetoothService service) async {
    debugPrint("Setting up characteristics...");
    
    for (var characteristic in service.characteristics) {
      final uuid = characteristic.uuid.toString().toLowerCase();
      debugPrint("Found characteristic: $uuid");
      
      switch (uuid) {
        case '19b10000-2001-537e-4f6c-d104768a1214':
          _temperatureCharacteristic = characteristic;
          debugPrint("Temperature characteristic found");
          break;
        case '19b10000-3001-537e-4f6c-d104768a1214':
          _humidityCharacteristic = characteristic;
          debugPrint("Humidity characteristic found");
          break;
        case '19b10000-4001-537e-4f6c-d104768a1214':
          _pressureCharacteristic = characteristic;
          debugPrint("Pressure characteristic found");
          break;
        case '19b10000-5001-537e-4f6c-d104768a1214':
          _accelerometerCharacteristic = characteristic;
          debugPrint("Accelerometer characteristic found");
          break;
        case '19b10000-6001-537e-4f6c-d104768a1214':
          _gyroscopeCharacteristic = characteristic;
          debugPrint("Gyroscope characteristic found");
          break;
        case '19b10000-7001-537e-4f6c-d104768a1214':
          _quaternionCharacteristic = characteristic;
          debugPrint("Quaternion characteristic found");
          break;
        case '19b10000-9001-537e-4f6c-d104768a1214':
          _bsecCharacteristic = characteristic;
          debugPrint("BSEC characteristic found");
          break;
        case '19b10000-9002-537e-4f6c-d104768a1214':
          _co2Characteristic = characteristic;
          debugPrint("CO2 characteristic found");
          break;
        case '19b10000-9003-537e-4f6c-d104768a1214':
          _gasCharacteristic = characteristic;
          debugPrint("Gas characteristic found");
          break;
        case '19b10000-8005-537e-4f6c-d104768a1214':
          _inferenceCharacteristic = characteristic;
          debugPrint("Inference characteristic found");
          break;
        case '19b10000-8001-537e-4f6c-d104768a1214':
          _rgbLedCharacteristic = characteristic;
          debugPrint("RGB LED characteristic found");
          break;
      }
    }
  }
  
  Future<void> _setupNotifications() async {
    debugPrint("Setting up notifications...");
    
    // Enable notifications for streaming characteristics
    if (_accelerometerCharacteristic != null) {
      try {
        await _accelerometerCharacteristic!.setNotifyValue(true);
        _accelerometerCharacteristic!.onValueReceived.listen(_onAccelerometerData);
        debugPrint("Accelerometer notifications enabled");
      } catch (e) {
        debugPrint("Error enabling accelerometer notifications: $e");
      }
    }
    
    if (_gyroscopeCharacteristic != null) {
      try {
        await _gyroscopeCharacteristic!.setNotifyValue(true);
        _gyroscopeCharacteristic!.onValueReceived.listen(_onGyroscopeData);
        debugPrint("Gyroscope notifications enabled");
      } catch (e) {
        debugPrint("Error enabling gyroscope notifications: $e");
      }
    }
    
    if (_quaternionCharacteristic != null) {
      try {
        await _quaternionCharacteristic!.setNotifyValue(true);
        _quaternionCharacteristic!.onValueReceived.listen(_onQuaternionData);
        debugPrint("Quaternion notifications enabled");
      } catch (e) {
        debugPrint("Error enabling quaternion notifications: $e");
      }
    }
    
    if (_inferenceCharacteristic != null) {
      try {
        await _inferenceCharacteristic!.setNotifyValue(true);
        _inferenceCharacteristic!.onValueReceived.listen(_onInferenceData);
        debugPrint("Inference notifications enabled");
      } catch (e) {
        debugPrint("Error enabling inference notifications: $e");
      }
    }
  }
  
  void _onAccelerometerData(List<int> value) {
    if (value.length >= 12) { // 3 floats = 12 bytes
      final buffer = Uint8List.fromList(value).buffer;
      final x = ByteData.view(buffer).getFloat32(0, Endian.little);
      final y = ByteData.view(buffer).getFloat32(4, Endian.little);
      final z = ByteData.view(buffer).getFloat32(8, Endian.little);
      
      _updateSensorData(accelerometer: [x, y, z]);
    }
  }
  
  void _onGyroscopeData(List<int> value) {
    if (value.length >= 12) { // 3 floats = 12 bytes
      final buffer = Uint8List.fromList(value).buffer;
      final x = ByteData.view(buffer).getFloat32(0, Endian.little);
      final y = ByteData.view(buffer).getFloat32(4, Endian.little);
      final z = ByteData.view(buffer).getFloat32(8, Endian.little);
      
      _updateSensorData(gyroscope: [x, y, z]);
    }
  }
  
  void _onQuaternionData(List<int> value) {
    if (value.length >= 16) { // 4 floats = 16 bytes
      final buffer = Uint8List.fromList(value).buffer;
      final x = ByteData.view(buffer).getFloat32(0, Endian.little);
      final y = ByteData.view(buffer).getFloat32(4, Endian.little);
      final z = ByteData.view(buffer).getFloat32(8, Endian.little);
      final w = ByteData.view(buffer).getFloat32(12, Endian.little);
      
      _updateSensorData(quaternion: [x, y, z, w]);
    }
  }
  
  void _onInferenceData(List<int> value) {
    final inference = String.fromCharCodes(value).trim();
    _updateSensorData(activityInference: inference);
    
    // Check for fall detection
    if (inference.toLowerCase().contains('falling')) {
      _connectionStatusController.add('FALL_DETECTED');
    }
  }
  
  void _updateSensorData({
    List<double>? accelerometer,
    List<double>? gyroscope,
    List<double>? quaternion,
    String? activityInference,
  }) {
    _currentSensorData = (_currentSensorData ?? SensorDataModel(timestamp: DateTime.now()))
        .copyWith(
          timestamp: DateTime.now(),
          accelerometer: accelerometer,
          gyroscope: gyroscope,
          quaternion: quaternion,
          activityInference: activityInference,
        );
    
    _sensorDataController.add(_currentSensorData!);
  }
  
  Future<void> readEnvironmentalData() async {
    if (!isConnected) return;
    
    try {
      double? temperature, humidity, pressure, airQuality;
      int? co2Level, gasLevel;
      
      // Read temperature
      if (_temperatureCharacteristic != null) {
        final value = await _temperatureCharacteristic!.read();
        if (value.length >= 4) {
          temperature = ByteData.view(Uint8List.fromList(value).buffer)
              .getFloat32(0, Endian.little);
        }
      }
      
      // Read humidity
      if (_humidityCharacteristic != null) {
        final value = await _humidityCharacteristic!.read();
        if (value.isNotEmpty) {
          humidity = value[0].toDouble();
        }
      }
      
      // Read pressure
      if (_pressureCharacteristic != null) {
        final value = await _pressureCharacteristic!.read();
        if (value.length >= 4) {
          pressure = ByteData.view(Uint8List.fromList(value).buffer)
              .getFloat32(0, Endian.little);
        }
      }
      
      // Read air quality
      if (_bsecCharacteristic != null) {
        final value = await _bsecCharacteristic!.read();
        if (value.length >= 4) {
          airQuality = ByteData.view(Uint8List.fromList(value).buffer)
              .getFloat32(0, Endian.little);
        }
      }
      
      // Read CO2
      if (_co2Characteristic != null) {
        final value = await _co2Characteristic!.read();
        if (value.length >= 4) {
          co2Level = ByteData.view(Uint8List.fromList(value).buffer)
              .getInt32(0, Endian.little);
        }
      }
      
      // Read gas
      if (_gasCharacteristic != null) {
        final value = await _gasCharacteristic!.read();
        if (value.length >= 4) {
          gasLevel = ByteData.view(Uint8List.fromList(value).buffer)
              .getUint32(0, Endian.little);
        }
      }
      
      _currentSensorData = (_currentSensorData ?? SensorDataModel(timestamp: DateTime.now()))
          .copyWith(
            timestamp: DateTime.now(),
            temperature: temperature,
            humidity: humidity,
            pressure: pressure,
            airQuality: airQuality,
            co2Level: co2Level,
            gasLevel: gasLevel,
          );
      
      _sensorDataController.add(_currentSensorData!);
      
    } catch (e) {
      debugPrint('Error reading environmental data: $e');
    }
  }
  
  Future<void> setLedColor(int red, int green, int blue) async {
    if (_rgbLedCharacteristic != null && isConnected) {
      try {
        await _rgbLedCharacteristic!.write([red, green, blue]);
      } catch (e) {
        debugPrint('Error setting LED color: $e');
      }
    }
  }
  
  Future<void> disconnect() async {
    if (_connectedDevice != null) {
      try {
        _connectedDevice!.connectionStatus = BleConnectionStatus.disconnecting;
        _devicesController.add(List.from(_discoveredDevices));
        
        await _connectedDevice!.device.disconnect();
        
        _connectedDevice!.connectionStatus = BleConnectionStatus.disconnected;
        _devicesController.add(List.from(_discoveredDevices));
        _connectedDevice = null;
        _connectionStatusController.add('Disconnected');
        
      } catch (e) {
        debugPrint('Disconnect error: $e');
      }
    }
  }
  
  bool get isConnected => _connectedDevice?.isConnected ?? false;
  bool get isScanning => _isScanning;
  BleDeviceModel? get connectedDevice => _connectedDevice;
  SensorDataModel? get currentSensorData => _currentSensorData;
  List<BleDeviceModel> get discoveredDevices => List.from(_discoveredDevices);
  
  void dispose() {
    _devicesController.close();
    _sensorDataController.close();
    _connectionStatusController.close();
  }
}
