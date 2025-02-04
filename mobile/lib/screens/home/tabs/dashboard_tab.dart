import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:lifeguard/screens/bmr_calculator/bmr_calculator.dart';
import 'package:lifeguard/screens/exercise_routines/exercise_routines.dart';
import 'package:lifeguard/screens/health_tips/health_tips.dart';
import 'package:lifeguard/screens/wellness_hub/wellness_hub.dart';
import 'package:provider/provider.dart';
import 'package:lifeguard/providers/quote_provider.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  @override
  void initState() {
    super.initState();
    // Fetch quote when dashboard loads
    Future.microtask(
      () => context.read<QuoteProvider>().fetchQuote(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final quoteProvider = context.watch<QuoteProvider>();

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hi, Evans!',
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF4285F4),
                              ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    PopupMenuButton(
                      offset: const Offset(0, 40),
                      child: Container(
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
                        child: SvgPicture.asset(
                          'assets/images/account.svg',
                          width: 24,
                          height: 24,
                          colorFilter: ColorFilter.mode(
                            isDark ? Colors.white70 : Colors.grey[600]!,
                            BlendMode.srcIn,
                          ),
                        ),
                      ),
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'profile',
                          child: Row(
                            children: [
                              Icon(Icons.person_outline),
                              SizedBox(width: 8),
                              Text('Edit Profile'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'settings',
                          child: Row(
                            children: [
                              Icon(Icons.settings_outlined),
                              SizedBox(width: 8),
                              Text('Settings'),
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
                      onSelected: (value) {
                        switch (value) {
                          case 'profile':
                            // Navigate to profile
                            break;
                          case 'settings':
                            // Navigate to settings
                            break;
                          case 'logout':
                            // Handle logout
                            break;
                        }
                      },
                    ),
                    IconButton(
                      onPressed: () {
                        // Handle notifications
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
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 2),
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
            Text(
              'Environmental Metrics',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
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
                  value: '28.5°',
                  unit: 'Celsius',
                ),
                _buildMetricCard(
                  context: context,
                  icon: 'assets/images/humidity.svg',
                  title: 'Humidity',
                  value: '65%',
                  unit: 'Relative',
                ),
                _buildMetricCard(
                  context: context,
                  icon: 'assets/images/reminder.svg',
                  title: 'Reminders',
                  value: '3',
                  unit: 'Active',
                ),
                _buildMetricCard(
                  context: context,
                  icon: 'assets/images/air-quality.svg',
                  title: 'Air Quality',
                  value: '75',
                  unit: 'AQI',
                ),
                _buildMetricCard(
                  context: context,
                  icon: 'assets/images/steps.svg',
                  title: 'Activities',
                  value: '6,248',
                  unit: 'steps today',
                ),
                _buildMetricCard(
                  context: context,
                  icon: 'assets/images/atm-pressure.svg',
                  title: 'Pressure',
                  value: '1013',
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
    );
  }

  Widget _buildMetricCard({
    required BuildContext context,
    required String icon,
    required String title,
    required String value,
    required String unit,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
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
              title: 'BMR Calculator',
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
}
