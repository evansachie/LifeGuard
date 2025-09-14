import 'dart:async';
import 'package:flutter/foundation.dart';
import '../services/ble_service.dart';
import '../models/ble_device_model.dart';
import '../models/sensor_data_model.dart';
import 'emergency_contact_provider.dart';

class BleProvider extends ChangeNotifier {
  final BleService _bleService = BleService();

  List<BleDeviceModel> _discoveredDevices = [];
  BleDeviceModel? _connectedDevice;
  SensorDataModel? _latestSensorData;
  String _connectionStatus = 'Disconnected';
  bool _isScanning = false;
  bool _isInitialized = false;
  String? _error;

  // Emergency contact provider for fall detection alerts
  EmergencyContactProvider? _emergencyContactProvider;

  // Auto-connect preferences
  String? _savedDeviceId;
  bool _autoReconnectEnabled = true;
  Timer? _reconnectTimer;
  Timer? _environmentalDataTimer;

  // Subscriptions
  StreamSubscription? _devicesSubscription;
  StreamSubscription? _sensorDataSubscription;
  StreamSubscription? _connectionStatusSubscription;

  // Getters
  List<BleDeviceModel> get discoveredDevices => _discoveredDevices;
  BleDeviceModel? get connectedDevice => _connectedDevice;
  SensorDataModel? get latestSensorData => _latestSensorData;
  String get connectionStatus => _connectionStatus;
  bool get isScanning => _isScanning;
  bool get isConnected => _connectedDevice?.isConnected ?? false;
  bool get isInitialized => _isInitialized;
  String? get error => _error;
  bool get autoReconnectEnabled => _autoReconnectEnabled;

  // Sensor data getters - delegate to latestSensorData
  double? get temperature => _latestSensorData?.temperature;
  double? get humidity => _latestSensorData?.humidity;
  double? get pressure => _latestSensorData?.pressure;
  double? get airQuality => _latestSensorData?.airQuality;
  String? get activityStatus => _latestSensorData?.activityInference;

  // Accelerometer data getters
  double? get accelerometerX => _latestSensorData?.accelerometer?[0];
  double? get accelerometerY => _latestSensorData?.accelerometer?[1];
  double? get accelerometerZ => _latestSensorData?.accelerometer?[2];

  // Health data getters (these might not be available in current model)
  int? get heartRate => null;
  int? get bloodOxygen => null;
  double? get bodyTemperature =>
      _latestSensorData?.temperature;

  BleProvider() {
    _initializeProvider();
  }

  void setEmergencyContactProvider(EmergencyContactProvider provider) {
    _emergencyContactProvider = provider;
  }

  Future<void> _initializeProvider() async {
    try {
      _isInitialized = await _bleService.initialize();
      if (_isInitialized) {
        _setupSubscriptions();
        _connectionStatus = 'BLE Ready';
        _error = null;
      } else {
        _error = 'Failed to initialize Bluetooth';
      }
    } catch (e) {
      _error = 'Initialization error: $e';
    }
    notifyListeners();
  }

  void _setupSubscriptions() {
    _devicesSubscription = _bleService.devicesStream.listen((devices) {
      _discoveredDevices = devices;

      // Update connected device status
      if (_connectedDevice != null) {
        final updatedDevice = devices.firstWhere(
          (d) => d.id == _connectedDevice!.id,
          orElse: () => _connectedDevice!,
        );
        _connectedDevice = updatedDevice;
      }

      notifyListeners();
    });

    _sensorDataSubscription = _bleService.sensorDataStream.listen((data) {
      _latestSensorData = data;

      // Check for fall detection
      if (data.isFallDetected) {
        _handleFallDetection();
      }

      notifyListeners();
    });

    _connectionStatusSubscription =
        _bleService.connectionStatusStream.listen((status) {
      _connectionStatus = status;

      if (status == 'FALL_DETECTED') {
        _handleFallDetection();
      } else if (status.contains('Disconnected') &&
          _autoReconnectEnabled &&
          _savedDeviceId != null) {
        _startReconnectTimer();
      }

      notifyListeners();
    });
  }

  Future<void> startScan() async {
    if (!_isInitialized) return;

    try {
      _isScanning = true;
      _error = null;
      notifyListeners();

      await _bleService.startScan();
    } catch (e) {
      _error = 'Scan error: $e';
    } finally {
      _isScanning = false;
      notifyListeners();
    }
  }

  Future<bool> connectToDevice(BleDeviceModel device) async {
    try {
      _error = null;
      notifyListeners();

      final success = await _bleService.connectToDevice(device);

      if (success) {
        _connectedDevice = device;
        _savedDeviceId = device.id;
        _startEnvironmentalDataTimer();

        // Save device preference
        await _saveDevicePreference(device.id);
      }

      notifyListeners();
      return success;
    } catch (e) {
      _error = 'Connection error: $e';
      notifyListeners();
      return false;
    }
  }

  Future<void> disconnect() async {
    try {
      _stopTimers();
      await _bleService.disconnect();
      _connectedDevice = null;
      _latestSensorData = null;
      notifyListeners();
    } catch (e) {
      _error = 'Disconnect error: $e';
      notifyListeners();
    }
  }

  Future<void> setLedColor(int red, int green, int blue) async {
    if (isConnected) {
      await _bleService.setLedColor(red, green, blue);
    }
  }

  void _startEnvironmentalDataTimer() {
    _environmentalDataTimer?.cancel();
    _environmentalDataTimer = Timer.periodic(
      const Duration(seconds: 5),
      (_) => _bleService.readEnvironmentalData(),
    );
  }

  void _startReconnectTimer() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer.periodic(
      const Duration(seconds: 10),
      (_) => _attemptReconnect(),
    );
  }

  Future<void> _attemptReconnect() async {
    if (_savedDeviceId != null && !isConnected) {
      // Try to find the saved device in discovered devices
      final savedDevice = _discoveredDevices
          .where(
            (device) => device.id == _savedDeviceId,
          )
          .firstOrNull;

      if (savedDevice != null) {
        final success = await connectToDevice(savedDevice);
        if (success) {
          _reconnectTimer?.cancel();
        }
      } else {
        // Device not found, start scanning
        await startScan();
      }
    }
  }

  void _handleFallDetection() async {
    if (_emergencyContactProvider != null) {
      try {
        // Get current location if possible (you might want to add location service)
        final Map<String, dynamic>? location = await _getCurrentLocation();

        // Send emergency alert with fall detection information and location
        await _emergencyContactProvider!.sendEmergencyAlert(
          isTest: false,
          customMessage:
              'FALL DETECTED! LifeGuard device has detected a potential fall. Please check on the user immediately.',
          location: location,
        );

        // Set LED to red to indicate emergency
        await setLedColor(255, 0, 0);
      } catch (e) {
        debugPrint('Error sending fall detection alert: $e');
      }
    }
  }

  // Helper method to get current location (optional implementation)
  Future<Map<String, dynamic>?> _getCurrentLocation() async {
    try {
      // You can implement location services here if needed
      // For now, return null or basic location data
      return {
        'timestamp': DateTime.now().toIso8601String(),
        'source': 'ble_device',
        'accuracy': 'high',
      };
    } catch (e) {
      debugPrint('Could not get location: $e');
      return null;
    }
  }

  void setAutoReconnect(bool enabled) {
    _autoReconnectEnabled = enabled;

    if (!enabled) {
      _reconnectTimer?.cancel();
    } else if (!isConnected && _savedDeviceId != null) {
      _startReconnectTimer();
    }

    notifyListeners();
  }

  Future<void> _saveDevicePreference(String deviceId) async {
    // Implement shared preferences saving
    // This would save the device ID for auto-reconnect
  }

  void _stopTimers() {
    _reconnectTimer?.cancel();
    _environmentalDataTimer?.cancel();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _stopTimers();
    _devicesSubscription?.cancel();
    _sensorDataSubscription?.cancel();
    _connectionStatusSubscription?.cancel();
    _bleService.dispose();
    super.dispose();
  }
}
