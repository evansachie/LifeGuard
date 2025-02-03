import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello, Evans!',
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF4285F4),
                              ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'How are you feeling today?',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    PopupMenuButton(
                      offset: const Offset(0, 40),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey[100],
                          border: Border.all(
                            color: const Color(0xFF4285F4),
                            width: 2,
                          ),
                        ),
                        child: SvgPicture.asset(
                          'assets/images/account.svg',
                          width: 24,
                          height: 24,
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
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey[100],
                          border: Border.all(
                            color: const Color(0xFF4285F4),
                            width: 2,
                          ),
                        ),
                        child: const Icon(Icons.notifications_outlined),
                      ),
                      color: Colors.grey[600],
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Environmental Stats
            const Text(
              'Environmental Stats',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
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
                _buildStatCard(
                  icon: 'assets/images/temperature.svg',
                  title: 'Temperature',
                  value: '28.5',
                  unit: '°C',
                  color: Colors.orange[400]!,
                ),
                _buildStatCard(
                  icon: 'assets/images/humidity.svg',
                  title: 'Humidity',
                  value: '65',
                  unit: '%',
                  color: Colors.blue[400]!,
                ),
                _buildStatCard(
                  icon: 'assets/images/atm-pressure.svg',
                  title: 'Pressure',
                  value: '1013',
                  unit: 'hPa',
                  color: Colors.purple[400]!,
                ),
                _buildStatCard(
                  icon: 'assets/images/reminder.svg',
                  title: 'Reminders',
                  value: '3',
                  unit: 'Active',
                  color: Colors.red[400]!,
                ),
                _buildStatCard(
                  icon: 'assets/images/air-quality.svg',
                  title: 'Air Quality',
                  value: '75',
                  unit: 'AQI',
                  color: Colors.green[400]!,
                ),
                _buildStatCard(
                  icon: 'assets/images/co2.svg',
                  title: 'CO₂',
                  value: '412',
                  unit: 'ppm',
                  color: Colors.teal[400]!,
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Actions
            const Text(
              'Quick Actions Tabs',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildQuickActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required String icon,
    required String title,
    required String value,
    required String unit,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
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
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                unit,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 2.5,
      children: [
        _buildActionButton(
          icon: 'assets/images/health-tips.svg',
          title: 'Health Tips',
          color: const Color(0xFF4285F4),
        ),
        _buildActionButton(
          icon: 'assets/images/calculator.svg',
          title: 'BMR Calculator',
          color: Colors.green,
        ),
        _buildActionButton(
          icon: 'assets/images/exercise.svg',
          title: 'Exercise Routines',
          color: Colors.orange,
        ),
        _buildActionButton(
          icon: 'assets/images/wellness.svg',
          title: 'Wellness Hub',
          color: Colors.purple,
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required String icon,
    required String title,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
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
