import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import '../../providers/ble_provider.dart';

class PollutionZone {
  final String id;
  final LatLng coordinates;
  final String level;
  final double radius;
  final PollutionData data;

  PollutionZone({
    required this.id,
    required this.coordinates,
    required this.level,
    required this.radius,
    required this.data,
  });
}

class PollutionData {
  final int aqi;
  final double pm25;
  final double pm10;

  PollutionData({
    required this.aqi,
    required this.pm25,
    required this.pm10,
  });
}

class PollutionTracker extends StatefulWidget {
  const PollutionTracker({super.key});

  @override
  State<PollutionTracker> createState() => _PollutionTrackerState();
}

class _PollutionTrackerState extends State<PollutionTracker> {
  PollutionZone? selectedZone;
  final accessToken = dotenv.env['MAPBOX_ACCESS_TOKEN'];
  List<PollutionZone> pollutionZones = [];
  LatLng? userLocation;

  @override
  void initState() {
    super.initState();
    _validateAccessToken();
    _generatePollutionZones();
  }

  void _validateAccessToken() {
    if (accessToken == null) {
      throw Exception(
          'Access token is not available. Please check your .env file.');
    }
  }

  void _generatePollutionZones() {
    // This will be called when sensor data is available
    // For now, we'll generate zones based on current location
    if (userLocation != null) {
      _createPollutionZonesFromSensorData();
    }
  }

  void _createPollutionZonesFromSensorData() {
    // This method will be called when we have real sensor data
    // For now, we'll create a single zone at the user's location
    if (userLocation != null) {
      setState(() {
        pollutionZones = [
          PollutionZone(
            id: 'user_location',
            coordinates: userLocation!,
            level: 'low', // Default level
            radius: 200,
            data: PollutionData(aqi: 50, pm25: 15.0, pm10: 30.0),
          ),
        ];
      });
    }
  }

  void _updatePollutionZonesFromSensorData(dynamic sensorData) {
    if (userLocation == null) return;

    // Extract air quality data from sensor data
    final airQuality = sensorData.airQuality ?? 50.0;

    // Determine pollution level based on air quality
    String level = 'low';
    if (airQuality > 100) {
      level = 'high';
    } else if (airQuality > 75) {
      level = 'medium';
    } else if (airQuality > 50) {
      level = 'moderate';
    }

    // Calculate PM2.5 and PM10 based on air quality (simplified)
    final pm25 = (airQuality * 0.5).clamp(0.0, 200.0);
    final pm10 = (airQuality * 0.8).clamp(0.0, 300.0);

    setState(() {
      pollutionZones = [
        PollutionZone(
          id: 'user_location',
          coordinates: userLocation!,
          level: level,
          radius: 200,
          data: PollutionData(
            aqi: airQuality.round(),
            pm25: pm25,
            pm10: pm10,
          ),
        ),
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Consumer<BleProvider>(
      builder: (context, bleProvider, child) {
        // Update pollution zones when sensor data changes
        if (bleProvider.latestSensorData != null && userLocation != null) {
          _updatePollutionZonesFromSensorData(bleProvider.latestSensorData!);
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(
              'Pollution Tracker',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF4285F4),
                  ),
            ),
          ),
          body: Stack(
            children: [
              FlutterMap(
                options: MapOptions(
                  initialCenter: const LatLng(40.6935, -73.9866),
                  initialZoom: 13,
                  onTap: (tapPosition, point) {
                    // Clear selection when tapping the map
                    setState(() => selectedZone = null);
                  },
                ),
                children: [
                  TileLayer(
                    urlTemplate:
                        'https://api.mapbox.com/styles/v1/mapbox/${isDark ? 'dark' : 'light'}-v10/tiles/{z}/{x}/{y}@2x?access_token={accessToken}',
                    additionalOptions: {
                      'accessToken': accessToken!,
                    },
                  ),
                  // Pollution Zones
                  CircleLayer(
                    circles: pollutionZones
                        .map((zone) => CircleMarker(
                              point: zone.coordinates,
                              radius: zone.radius / 50,
                              color: _getPollutionColor(zone.level)
                                  .withOpacity(0.6),
                              useRadiusInMeter: true,
                              borderStrokeWidth: 2,
                              borderColor: Colors.white.withOpacity(0.8),
                            ))
                        .toList(),
                  ),
                  // Clickable markers for zones
                  MarkerLayer(
                    markers: pollutionZones
                        .map((zone) => Marker(
                              point: zone.coordinates,
                              width: zone.radius / 25,
                              height: zone.radius / 25,
                              child: GestureDetector(
                                onTap: () =>
                                    setState(() => selectedZone = zone),
                                child: Container(
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Colors.transparent,
                                  ),
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                ],
              ),
              // Legend Card
              Positioned(
                left: 16,
                bottom: 16,
                child: Card(
                  color: isDark
                      ? const Color(0xFF1E1E1E).withOpacity(0.9)
                      : Colors.white.withOpacity(0.9),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.info_outline,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Pollution Levels',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : Colors.black,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildLegendItem(
                          color: Colors.red,
                          label: 'High Pollution',
                          description: 'AQI > 150',
                          isDark: isDark,
                        ),
                        const SizedBox(height: 8),
                        _buildLegendItem(
                          color: Colors.orange,
                          label: 'Medium Pollution',
                          description: 'AQI 51-150',
                          isDark: isDark,
                        ),
                        const SizedBox(height: 8),
                        _buildLegendItem(
                          color: Colors.green,
                          label: 'Low Pollution',
                          description: 'AQI 0-50',
                          isDark: isDark,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Pollution Info Card
              if (selectedZone != null)
                Positioned(
                  top: 16,
                  right: 16,
                  child: Card(
                    color: isDark
                        ? const Color(0xFF1E1E1E).withOpacity(0.9)
                        : Colors.white.withOpacity(0.9),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Pollution Data',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _buildDataItem('AQI',
                                  selectedZone!.data.aqi.toString(), isDark),
                              const SizedBox(width: 16),
                              _buildDataItem(
                                  'PM2.5',
                                  selectedZone!.data.pm25.toStringAsFixed(1),
                                  isDark),
                              const SizedBox(width: 16),
                              _buildDataItem(
                                  'PM10',
                                  selectedZone!.data.pm10.toStringAsFixed(1),
                                  isDark),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLegendItem({
    required Color color,
    required String label,
    required String description,
    required bool isDark,
  }) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                color: isDark ? Colors.white : Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              description,
              style: TextStyle(
                color: isDark ? Colors.white70 : Colors.black54,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDataItem(String label, String value, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isDark ? Colors.black26 : Colors.black.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white70 : Colors.black54,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  Color _getPollutionColor(String level) {
    switch (level) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'moderate':
        return Colors.yellow;
      case 'low':
        return Colors.green;
      default:
        return Colors.red;
    }
  }
}
