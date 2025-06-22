import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/ble_provider.dart';
import '../../models/ble_device_model.dart';

class DeviceScannerScreen extends StatefulWidget {
  const DeviceScannerScreen({super.key});

  @override
  State<DeviceScannerScreen> createState() => _DeviceScannerScreenState();
}

class _DeviceScannerScreenState extends State<DeviceScannerScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final bleProvider = context.read<BleProvider>();
      if (bleProvider.isInitialized) {
        bleProvider.startScan();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('LifeGuard Devices'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
        actions: [
          Consumer<BleProvider>(
            builder: (context, bleProvider, _) {
              return IconButton(
                onPressed: bleProvider.isScanning ? null : () {
                  bleProvider.startScan();
                },
                icon: bleProvider.isScanning 
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.refresh),
                tooltip: 'Scan for devices',
              );
            },
          ),
        ],
      ),
      body: Consumer<BleProvider>(
        builder: (context, bleProvider, _) {
          return Column(
            children: [
              // Connection Status Card
              if (bleProvider.connectedDevice != null)
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.green.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Colors.green,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.bluetooth_connected,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Connected to ${bleProvider.connectedDevice!.name}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                            Text(
                              bleProvider.connectionStatus,
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? Colors.grey[400] : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => bleProvider.disconnect(),
                        child: const Text('Disconnect'),
                      ),
                    ],
                  ),
                ),

              // Status Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: isDark ? const Color(0xFF1E1E1E) : Colors.grey[100],
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(
                          bleProvider.isScanning 
                              ? Icons.bluetooth_searching 
                              : Icons.bluetooth,
                          color: const Color(0xFF4285F4),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            bleProvider.isScanning 
                                ? 'Scanning for LifeGuard devices...'
                                : bleProvider.discoveredDevices.isEmpty
                                    ? 'No devices found. Tap refresh to scan again.'
                                    : '${bleProvider.discoveredDevices.length} device(s) found',
                            style: TextStyle(
                              color: isDark ? Colors.white : Colors.black87,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (bleProvider.error != null) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                bleProvider.error!,
                                style: const TextStyle(color: Colors.red, fontSize: 12),
                              ),
                            ),
                            IconButton(
                              onPressed: () => bleProvider.clearError(),
                              icon: const Icon(Icons.close, size: 16),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              // Devices List
              Expanded(
                child: bleProvider.discoveredDevices.isEmpty
                    ? _buildEmptyState(isDark, bleProvider.isScanning)
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: bleProvider.discoveredDevices.length,
                        itemBuilder: (context, index) {
                          final device = bleProvider.discoveredDevices[index];
                          return _buildDeviceCard(device, bleProvider, isDark);
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(bool isDark, bool isScanning) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            isScanning ? Icons.bluetooth_searching : Icons.bluetooth_disabled,
            size: 64,
            color: isDark ? Colors.grey[600] : Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            isScanning 
                ? 'Scanning for devices...'
                : 'No LifeGuard devices found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isScanning
                ? 'Please wait while we search for nearby devices'
                : 'Make sure your device is powered on and nearby',
            style: TextStyle(
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
          if (!isScanning) ...[
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                context.read<BleProvider>().startScan();
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Scan Again'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4285F4),
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDeviceCard(BleDeviceModel device, BleProvider bleProvider, bool isDark) {
    final isConnected = device.isConnected;
    final isConnecting = device.isConnecting;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: isConnected 
            ? Border.all(color: Colors.green, width: 2)
            : null,
        boxShadow: [
          BoxShadow(
            color: isDark 
                ? Colors.black.withOpacity(0.3) 
                : Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isConnected 
                ? Colors.green
                : const Color(0xFF4285F4).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            isConnected 
                ? Icons.bluetooth_connected
                : Icons.watch_outlined,
            color: isConnected 
                ? Colors.white
                : const Color(0xFF4285F4),
            size: 24,
          ),
        ),
        title: Text(
          device.name,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              'Signal: ${device.rssi} dBm',
              style: TextStyle(
                color: isDark ? Colors.grey[400] : Colors.grey[600],
                fontSize: 12,
              ),
            ),
            if (device.lastSeen != null) ...[
              const SizedBox(height: 2),
              Text(
                'Last seen: ${_formatLastSeen(device.lastSeen!)}',
                style: TextStyle(
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ],
            if (isConnected) ...[
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'CONNECTED',
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
        trailing: isConnecting
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : isConnected
                ? IconButton(
                    onPressed: () => bleProvider.disconnect(),
                    icon: const Icon(Icons.bluetooth_disabled),
                    tooltip: 'Disconnect',
                  )
                : ElevatedButton(
                    onPressed: () async {
                      final success = await bleProvider.connectToDevice(device);
                      if (!success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Failed to connect to ${device.name}'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      } else if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Connected to ${device.name}'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4285F4),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Connect'),
                  ),
        onTap: isConnected 
            ? () => _showDeviceDetails(context, device, bleProvider)
            : null,
      ),
    );
  }

  String _formatLastSeen(DateTime lastSeen) {
    final now = DateTime.now();
    final difference = now.difference(lastSeen);
    
    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else {
      return '${difference.inHours}h ago';
    }
  }

  void _showDeviceDetails(BuildContext context, BleDeviceModel device, BleProvider bleProvider) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: DeviceDetailsSheet(device: device, bleProvider: bleProvider),
      ),
    );
  }
}

class DeviceDetailsSheet extends StatelessWidget {
  final BleDeviceModel device;
  final BleProvider bleProvider;

  const DeviceDetailsSheet({
    super.key,
    required this.device,
    required this.bleProvider,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      children: [
        // Handle bar
        Container(
          width: 40,
          height: 4,
          margin: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isDark ? Colors.grey[600] : Colors.grey[300],
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        
        // Header
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.bluetooth_connected,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      device.name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    Text(
                      'Connected • Signal: ${device.rssi} dBm',
                      style: TextStyle(
                        fontSize: 14,
                        color: isDark ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close),
              ),
            ],
          ),
        ),
        
        const Divider(),
        
        // Content
        Expanded(
          child: Consumer<BleProvider>(
            builder: (context, provider, _) {
              final sensorData = provider.latestSensorData;
              
              return SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Real-time Sensor Data',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    if (sensorData != null) ...[
                      _buildSensorTile(
                        'Temperature',
                        sensorData.temperature?.toStringAsFixed(1) ?? 'N/A',
                        '°C',
                        Icons.thermostat,
                        Colors.orange,
                        isDark,
                      ),
                      _buildSensorTile(
                        'Humidity',
                        sensorData.humidity?.toStringAsFixed(0) ?? 'N/A',
                        '%',
                        Icons.opacity,
                        Colors.blue,
                        isDark,
                      ),
                      _buildSensorTile(
                        'Air Quality',
                        sensorData.airQuality?.toStringAsFixed(0) ?? 'N/A',
                        'IAQ',
                        Icons.air,
                        Colors.green,
                        isDark,
                      ),
                      _buildSensorTile(
                        'Activity',
                        sensorData.activityInference ?? 'Unknown',
                        '',
                        Icons.directions_walk,
                        Colors.purple,
                        isDark,
                      ),
                    ] else ...[
                      Center(
                        child: Column(
                          children: [
                            const CircularProgressIndicator(),
                            const SizedBox(height: 16),
                            Text(
                              'Waiting for sensor data...',
                              style: TextStyle(
                                color: isDark ? Colors.grey[400] : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    
                    const SizedBox(height: 24),
                    
                    // LED Control Section
                    Text(
                      'Device Control',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.grey[800] : Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.lightbulb_outline),
                              const SizedBox(width: 8),
                              const Text('LED Color'),
                              const Spacer(),
                              Row(
                                children: [
                                  _buildColorButton(Colors.red, () {
                                    provider.setLedColor(255, 0, 0);
                                  }),
                                  const SizedBox(width: 8),
                                  _buildColorButton(Colors.green, () {
                                    provider.setLedColor(0, 255, 0);
                                  }),
                                  const SizedBox(width: 8),
                                  _buildColorButton(Colors.blue, () {
                                    provider.setLedColor(0, 0, 255);
                                  }),
                                  const SizedBox(width: 8),
                                  _buildColorButton(Colors.white, () {
                                    provider.setLedColor(255, 255, 255);
                                  }),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSensorTile(String label, String value, String unit, IconData icon, Color color, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    color: isDark ? Colors.grey[400] : Colors.grey[600],
                  ),
                ),
                Text(
                  '$value $unit',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildColorButton(Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey, width: 1),
        ),
      ),
    );
  }
}
