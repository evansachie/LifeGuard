import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:lifeguard/screens/health_report/widgets/health_report_modal.dart';
import 'package:lifeguard/services/health_report_service.dart';
import 'package:lifeguard/providers/ble_provider.dart';

class HealthReport extends StatefulWidget {
  const HealthReport({super.key});

  @override
  State<HealthReport> createState() => _HealthReportState();
}

class _HealthReportState extends State<HealthReport> {
  Map<String, dynamic>? reportData;
  bool isLoading = false;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadReportData();
  }

  Future<void> _loadReportData() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final data = await HealthReportService.generateHealthReport();
      setState(() {
        reportData = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bleProvider = context.watch<BleProvider>();

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Health Report',
          style: TextStyle(
            fontSize: 25,
            fontWeight: FontWeight.bold,
            color: Color(0xFF4285F4),
          ),
        ),
        centerTitle: false,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Colors.red[300],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load health report',
                        style: TextStyle(
                          fontSize: 18,
                          color: isDark ? Colors.white70 : Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        error!,
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark ? Colors.white54 : Colors.grey[500],
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadReportData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: isDark
                              ? const Color(0xFF2D1B1B)
                              : const Color(0xFFFBE9E7),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Current Temperature',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: isDark
                                    ? Colors.white
                                    : const Color(0xFF333333),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      bleProvider.isConnected
                                          ? (bleProvider.temperature
                                                  ?.toStringAsFixed(1) ??
                                              '--')
                                          : (reportData?['vitals']
                                                          ?['bodyTemperature']
                                                      ?['average']
                                                  ?.replaceAll('°C', '') ??
                                              '--'),
                                      style: const TextStyle(
                                        fontSize: 64,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const Padding(
                                      padding: EdgeInsets.only(top: 12),
                                      child: Text(
                                        '°C',
                                        style: TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                SvgPicture.asset(
                                  'assets/images/temp.svg',
                                  width: 80,
                                  height: 80,
                                  colorFilter: const ColorFilter.mode(
                                    Color(0xFFD32F2F),
                                    BlendMode.srcIn,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF1A2327)
                                    : const Color(0xFFE3F2FD),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      SvgPicture.asset(
                                        'assets/images/humidity-in.svg',
                                        width: 24,
                                        height: 24,
                                        colorFilter: const ColorFilter.mode(
                                          Color(0xFF1976D2),
                                          BlendMode.srcIn,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      const Text(
                                        'Humidity',
                                        style: TextStyle(
                                          fontSize: 16,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        bleProvider.isConnected
                                            ? (bleProvider.humidity
                                                    ?.toStringAsFixed(1) ??
                                                '--')
                                            : (reportData?['environmentalMetrics']
                                                            ?['humidity']
                                                        ?['average']
                                                    ?.replaceAll('%', '') ??
                                                '--'),
                                        style: const TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const Text(
                                        ' %',
                                        style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF2A2316)
                                    : const Color(0xFFFFF3E0),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      SvgPicture.asset(
                                        'assets/images/steps.svg',
                                        width: 24,
                                        height: 24,
                                        colorFilter: const ColorFilter.mode(
                                          Color(0xFFF57C00),
                                          BlendMode.srcIn,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      const Text(
                                        'Steps',
                                        style: TextStyle(
                                          fontSize: 16,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    reportData?['activityMetrics']
                                                ?['totalWorkouts']?['value']
                                            ?.toString() ??
                                        '--',
                                    style: const TextStyle(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Latest Reports',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color:
                              isDark ? Colors.white : const Color(0xFF333333),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: 2,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          return Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E1E1E)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? const Color(0xFF1A2327)
                                        : const Color(0xFFE3F2FD),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(
                                    Icons.description_outlined,
                                    color: isDark
                                        ? Colors.blue[300]
                                        : const Color(0xFF1976D2),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'General Report',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: isDark
                                              ? Colors.white
                                              : const Color(0xFF333333),
                                        ),
                                      ),
                                      Text(
                                        index == 0
                                            ? 'Jul 10, 2023'
                                            : 'Jul 5, 2023',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDark
                                              ? Colors.grey[400]
                                              : Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.more_vert),
                                  onPressed: () {},
                                  color: isDark
                                      ? Colors.grey[400]
                                      : Colors.grey[600],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: 16,
          top: 8,
        ),
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => const HealthReportModal(
                userData: {'name': 'Evans Acheampongg'},
              ),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF4285F4),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
            elevation: 4,
          ),
          child: const Text(
            'Generate Report',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
