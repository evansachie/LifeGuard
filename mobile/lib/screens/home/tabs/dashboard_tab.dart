import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:lifeguard/providers/auth_provider.dart';
import 'package:lifeguard/providers/profile_provider.dart';
import 'package:lifeguard/screens/bmr_calculator/bmr_calculator.dart';
import 'package:lifeguard/screens/exercise_routines/exercise_routines.dart';
import 'package:lifeguard/screens/health_tips/health_tips.dart';
import 'package:lifeguard/screens/medication/medication_tracker_screen.dart';
import 'package:lifeguard/screens/wellness_hub/wellness_hub.dart';
import 'package:lifeguard/screens/analytics/sensor_analytics.dart';
import 'package:lifeguard/widgets/floating_health_assistant.dart';
import 'package:provider/provider.dart';
import 'package:lifeguard/providers/quote_provider.dart';
import 'package:lifeguard/providers/ble_provider.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  @override
  void initState() {
    super.initState();
    // Fetch quote and profile when dashboard loads
    Future.microtask(() {
      context.read<QuoteProvider>().fetchQuote();
      context.read<ProfileProvider>().loadProfile();
    });
  }

  Future<void> _handleLogout() async {
    try {
      await context.read<AuthProvider>().logout();
      if (mounted) {
        Navigator.of(context)
            .pushNamedAndRemoveUntil('/login', (route) => false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error logging out: ${e.toString()}')),
        );
      }
    }
  }

  String _getInitials(String name) {
    if (name.isEmpty) return 'U';
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name[0].toUpperCase();
  }

  Widget _buildProfileAvatar() {
    return Consumer<ProfileProvider>(
      builder: (context, profileProvider, child) {
        final profile = profileProvider.profileData;
        final isDark = Theme.of(context).brightness == Brightness.dark;

        return PopupMenuButton<String>(
          offset: const Offset(0, 40),
          onSelected: (value) {
            switch (value) {
              case 'profile':
                Navigator.pushNamed(context, '/profile');
                break;
              case 'logout':
                _handleLogout();
                break;
            }
          },
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'profile',
              child: Row(
                children: [
                  Icon(Icons.person_outline),
                  SizedBox(width: 8),
                  Text('Profile'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'logout',
              child: Row(
                children: [
                  Icon(Icons.logout),
                  SizedBox(width: 8),
                  Text('Log Out'),
                ],
              ),
            ),
          ],
          child: Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: const Color(0xFF4285F4),
                width: 2,
              ),
            ),
            child: CircleAvatar(
              radius: 20,
              backgroundColor:
                  isDark ? const Color(0xFF1E1E1E) : Colors.grey[100],
              backgroundImage: profile?.profileImage != null
                  ? NetworkImage(profile!.profileImage!)
                  : null,
              child: profile?.profileImage == null
                  ? Text(
                      _getInitials(profile?.fullName ?? 'User'),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white70 : Colors.grey[600],
                      ),
                    )
                  : null,
            ),
          ),
        );
      },
    );
  }

  Widget _buildMetricCard({
    required BuildContext context,
    required String icon,
    required String title,
    required String value,
    required String unit,
    VoidCallback? onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: isDark
                  ? Colors.black.withOpacity(0.3)
                  : Colors.black.withOpacity(0.05),
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
                  icon,
                  width: 24,
                  height: 24,
                  colorFilter: ColorFilter.mode(
                    isDark ? Colors.white70 : const Color(0xFF4285F4),
                    BlendMode.srcIn,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    color: isDark ? Colors.white70 : Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            Text(
              unit,
              style: TextStyle(
                color: isDark ? Colors.white60 : Colors.grey[600],
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 4 : 2;
        final childAspectRatio = constraints.maxWidth > 600 ? 3.0 : 2.5;

        return GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: crossAxisCount,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: childAspectRatio,
          children: [
            _buildActionButton(
              icon: 'assets/images/health-tips.svg',
              title: 'Health Tips',
              color: const Color(0xFF4285F4),
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const HealthTips(),
                ));
              },
            ),
            _buildActionButton(
              icon: 'assets/images/calculator.svg',
              title: 'Health Metrics',
              color: Colors.green,
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const BMRCalculator(),
                ));
              },
            ),
            _buildActionButton(
              icon: 'assets/images/exercise.svg',
              title: 'Exercise Routines',
              color: Colors.orange,
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const ExerciseRoutines(),
                ));
              },
            ),
            _buildActionButton(
              icon: 'assets/images/wellness.svg',
              title: 'Wellness Hub',
              color: Colors.purple,
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const WellnessHub(),
                ));
              },
            ),
            _buildActionButton(
              icon: 'assets/images/meds.svg',
              title: 'Medication Tracker',
              color: Colors.blue,
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => const MedicationTrackerScreen()));
              },
            ),
            _buildActionButton(
              icon: 'assets/images/analytics.svg',
              title: 'Sensor Analytics',
              color: Colors.cyan,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const SensorAnalytics(),
                  ),
                );
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildActionButton({
    required String icon,
    required String title,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                SvgPicture.asset(
                  icon,
                  width: 24,
                  height: 24,
                  colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final quoteProvider = context.watch<QuoteProvider>();
    final profileProvider = context.watch<ProfileProvider>();
    final authProvider = context.watch<AuthProvider>();
    final bleProvider = context.watch<BleProvider>();

    // Get the display name from profile or fallback to stored name
    String displayName = '...'; // Default loading state

    if (!profileProvider.isLoading &&
        profileProvider.profileData?.fullName.isNotEmpty == true) {
      displayName = profileProvider.profileData!.fullName.split(' ').first;
    } else if (!authProvider.isLoading &&
        authProvider.currentUser?.userName.isNotEmpty == true) {
      // Only use auth provider name if it's not an email address
      final userName = authProvider.currentUser!.userName;
      if (!userName.contains('@')) {
        displayName = userName.split(' ').first;
      }
    } else if (!authProvider.isLoading &&
        authProvider.userName?.isNotEmpty == true) {
      final userName = authProvider.userName!;
      if (!userName.contains('@')) {
        displayName = userName.split(' ').first;
      }
    }

    return SafeArea(
      child: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hi, $displayName!',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFF4285F4),
                                ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildProfileAvatar(),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/notifications');
                          },
                          icon: Container(
                            padding: const EdgeInsets.all(5),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isDark
                                  ? const Color(0xFF1E1E1E)
                                  : Colors.grey[100],
                              border: Border.all(
                                color: const Color(0xFF4285F4),
                                width: 2,
                              ),
                            ),
                            child: Icon(
                              Icons.notifications_outlined,
                              color: isDark ? Colors.white70 : Colors.grey[600],
                              size: 30,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 2),

                // Quote section
                if (quoteProvider.isLoading)
                  Text(
                    'Loading inspiration...',
                    style: TextStyle(
                      fontStyle: FontStyle.italic,
                      color: isDark ? Colors.white70 : Colors.grey[600],
                    ),
                  )
                else if (quoteProvider.quote != null)
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: '"${quoteProvider.quote!.text}"\n',
                          style: TextStyle(
                            fontStyle: FontStyle.italic,
                            color: isDark ? Colors.white70 : Colors.grey[600],
                          ),
                        ),
                        TextSpan(
                          text: '- ${quoteProvider.quote!.author}',
                          style: TextStyle(
                            fontStyle: FontStyle.italic,
                            color: isDark ? Colors.white60 : Colors.grey[500],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),

                const SizedBox(height: 24),

                // Environmental Metrics
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Environmental Metrics',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pushNamed(context, '/emergency-contacts');
                      },
                      icon: const Icon(Icons.warning_amber_rounded, size: 16),
                      label: const Text('EMERGENCY',
                          style: TextStyle(fontSize: 12)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        minimumSize: const Size(0, 32),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.5,
                  children: [
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/temperature.svg',
                      title: 'Temperature',
                      value: bleProvider.isConnected
                          ? '${bleProvider.temperature?.toStringAsFixed(1) ?? '--'}°'
                          : '28.5°',
                      unit: 'Celsius',
                    ),
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/humidity.svg',
                      title: 'Humidity',
                      value: bleProvider.isConnected
                          ? '${bleProvider.humidity?.toStringAsFixed(1) ?? '--'}%'
                          : '65%',
                      unit: 'Relative',
                    ),
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/reminder.svg',
                      title: 'Reminders',
                      value: '3',
                      unit: 'Active',
                      onTap: () => Navigator.pushNamed(context, '/memos'),
                    ),
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/air-quality.svg',
                      title: 'Air Quality',
                      value: bleProvider.isConnected
                          ? bleProvider.airQuality?.toStringAsFixed(0) ?? '--'
                          : '75',
                      unit: 'AQI',
                    ),
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/steps.svg',
                      title: 'Activities',
                      value: bleProvider.isConnected
                          ? (bleProvider.activityStatus ?? '--')
                          : '6,248',
                      unit: bleProvider.isConnected ? 'status' : 'steps today',
                    ),
                    _buildMetricCard(
                      context: context,
                      icon: 'assets/images/atm-pressure.svg',
                      title: 'Pressure',
                      value: bleProvider.isConnected
                          ? bleProvider.pressure?.toStringAsFixed(0) ?? '--'
                          : '1013',
                      unit: 'hPa',
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Quick Actions
                Text(
                  'Quick Actions Tab',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
                const SizedBox(height: 16),
                _buildQuickActions(),
              ],
            ),
          ),
          const FloatingHealthAssistant(),
        ],
      ),
    );
  }
}
