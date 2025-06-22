import 'package:flutter_blue_plus/flutter_blue_plus.dart';

enum BleConnectionStatus {
  disconnected,
  connecting,
  connected,
  disconnecting,
}

class BleDeviceModel {
  final BluetoothDevice device;
  final String name;
  final String id;
  final int rssi;
  BleConnectionStatus connectionStatus;
  DateTime? lastSeen;
  Map<String, dynamic> sensorData;
  
  BleDeviceModel({
    required this.device,
    required this.name,
    required this.id,
    required this.rssi,
    this.connectionStatus = BleConnectionStatus.disconnected,
    this.lastSeen,
    Map<String, dynamic>? sensorData,
  }) : sensorData = sensorData ?? {};
  
  bool get isConnected => connectionStatus == BleConnectionStatus.connected;
  bool get isConnecting => connectionStatus == BleConnectionStatus.connecting;
  bool get isLifeGuardDevice => name.startsWith('NiclaSenseME-');
  
  void updateSensorData(String characteristic, dynamic value) {
    sensorData[characteristic] = value;
    lastSeen = DateTime.now();
  }
  
  T? getSensorValue<T>(String characteristic) {
    final value = sensorData[characteristic];
    return value is T ? value : null;
  }
  
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'id': id,
      'rssi': rssi,
      'connectionStatus': connectionStatus.index,
      'lastSeen': lastSeen?.toIso8601String(),
      'sensorData': sensorData,
    };
  }
  
  factory BleDeviceModel.fromJson(Map<String, dynamic> json) {
    return BleDeviceModel(
      device: BluetoothDevice.fromId(json['id']),
      name: json['name'] ?? '',
      id: json['id'] ?? '',
      rssi: json['rssi'] ?? 0,
      connectionStatus: BleConnectionStatus.values[json['connectionStatus'] ?? 0],
      lastSeen: json['lastSeen'] != null ? DateTime.parse(json['lastSeen']) : null,
      sensorData: Map<String, dynamic>.from(json['sensorData'] ?? {}),
    );
  }
}
