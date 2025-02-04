import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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

  @override
  void initState() {
    super.initState();
    _validateAccessToken();
  }

  void _validateAccessToken() {
    if (accessToken == null) {
      throw Exception('Access token is not available. Please check your .env file.');
    }
  }

  // Mock data for pollution zones
  final List<PollutionZone> pollutionZones = [
    PollutionZone(
      id: '1',
      coordinates: const LatLng(40.6935, -73.9866),
      level: 'high',
      radius: 500,
      data: PollutionData(aqi: 156, pm25: 75.2, pm10: 142.8),
    ),
    PollutionZone(
      id: '2',
      coordinates: const LatLng(40.6895, -73.9845),
      level: 'medium',
      radius: 300,
      data: PollutionData(aqi: 89, pm25: 35.5, pm10: 82.3),
    ),
    PollutionZone(
      id: '3',
      coordinates: const LatLng(40.6915, -73.9825),
      level: 'low',
      radius: 400,
      data: PollutionData(aqi: 42, pm25: 12.8, pm10: 38.5),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
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
                          color:
                              _getPollutionColor(zone.level).withValues(),
                          useRadiusInMeter: true,
                          borderStrokeWidth: 2,
                          borderColor: Colors.white.withValues(),
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
                            onTap: () => setState(() => selectedZone = zone),
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
                  ? const Color(0xFF1E1E1E).withValues()
                  : Colors.white.withValues(),
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
                    ? const Color(0xFF1E1E1E).withValues()
                    : Colors.white.withValues(),
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
                          _buildDataItem(
                              'AQI', selectedZone!.data.aqi.toString(), isDark),
                          const SizedBox(width: 16),
                          _buildDataItem('PM2.5',
                              selectedZone!.data.pm25.toString(), isDark),
                          const SizedBox(width: 16),
                          _buildDataItem('PM10',
                              selectedZone!.data.pm10.toString(), isDark),
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
        color: isDark ? Colors.black26 : Colors.black.withValues(),
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
      case 'low':
        return Colors.green;
      default:
        return Colors.red;
    }
  }
}
