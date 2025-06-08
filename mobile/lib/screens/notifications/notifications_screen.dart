import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Add mark all as read functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Mark all as read - Coming soon!'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            icon: const Icon(Icons.done_all),
            tooltip: 'Mark all as read',
          ),
          IconButton(
            onPressed: () {
              // TODO: Add notification settings
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Notification settings - Coming soon!'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            icon: const Icon(Icons.settings),
            tooltip: 'Notification settings',
          ),
        ],
      ),
      body: _buildEmptyState(isDark),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: MediaQuery.of(context).size.height - 
                       AppBar().preferredSize.height - 
                       MediaQuery.of(context).padding.top - 
                       MediaQuery.of(context).padding.bottom - 48,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: MediaQuery.of(context).size.width > 400 ? 180 : 150,
                height: MediaQuery.of(context).size.width > 400 ? 180 : 150,
                padding: const EdgeInsets.all(20),
                child: SvgPicture.asset(
                  'assets/images/no-notifications.svg',
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Title
              Text(
                'No Notifications Yet',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 12),
              
              // Description - More compact
              Text(
                'Stay tuned! You\'ll receive notifications for:',
                style: TextStyle(
                  fontSize: 15,
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 16),
              
              // Feature list - More compact
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark 
                      ? const Color(0xFF1E1E1E) 
                      : Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDark 
                        ? Colors.grey[700]! 
                        : Colors.grey[200]!,
                  ),
                ),
                child: Column(
                  children: [
                    _buildFeatureItem('Health metric reminders', Icons.favorite, isDark),
                    _buildFeatureItem('Medication schedules', Icons.medication, isDark),
                    _buildFeatureItem('Emergency alerts', Icons.warning, isDark),
                    _buildFeatureItem('Wellness tips', Icons.tips_and_updates, isDark),
                    _buildFeatureItem('Exercise reminders', Icons.fitness_center, isDark),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Action buttons - Stack on smaller screens
              MediaQuery.of(context).size.width > 400
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildDashboardButton(),
                        const SizedBox(width: 12),
                        _buildSettingsButton(),
                      ],
                    )
                  : Column(
                      children: [
                        SizedBox(
                          width: double.infinity,
                          child: _buildDashboardButton(),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: _buildSettingsButton(),
                        ),
                      ],
                    ),
              
              const SizedBox(height: 20),
              
              // Info card
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF4285F4).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: const Color(0xFF4285F4).withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.info_outline,
                      color: Color(0xFF4285F4),
                      size: 18,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Notifications will appear here once you start using LifeGuard features.',
                        style: TextStyle(
                          fontSize: 13,
                          color: isDark ? Colors.grey[300] : Colors.grey[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(String text, IconData icon, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            icon,
            size: 16,
            color: const Color(0xFF4285F4),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: isDark ? Colors.grey[300] : Colors.grey[700],
                height: 1.3,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardButton() {
    return ElevatedButton.icon(
      onPressed: () {
        Navigator.pushNamed(context, '/home');
      },
      icon: const Icon(Icons.home, size: 18),
      label: const Text('Go to Dashboard'),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF4285F4),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 10,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  Widget _buildSettingsButton() {
    return OutlinedButton.icon(
      onPressed: () {
        // TODO: Navigate to settings when notification preferences are implemented
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Notification preferences - Coming soon!'),
            duration: Duration(seconds: 2),
          ),
        );
      },
      icon: const Icon(Icons.tune, size: 18),
      label: const Text('Settings'),
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF4285F4),
        side: const BorderSide(color: Color(0xFF4285F4)),
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 10,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}
