import 'package:flutter/material.dart';
import 'package:lifeguard/screens/home/tabs/dashboard_tab.dart';
import 'package:lifeguard/screens/pollution_tracker/pollution_tracker.dart';
import 'package:lifeguard/screens/health_report/health_report.dart';
import 'package:lifeguard/screens/settings/settings_tab.dart';
import 'package:lifeguard/widgets/voice_commands_widget.dart';
import 'package:provider/provider.dart';
import 'package:lifeguard/providers/voice_commands_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const PollutionTracker(),
    const HealthReport(),
    const SettingsTab(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final voiceProvider = context.read<VoiceCommandsProvider>();
      voiceProvider.initialize();
      voiceProvider.setNavigationCallback(_handleNavigation);
    });
  }

  void _handleNavigation(String route) {
    switch (route) {
      case '/health_report':
        setState(() => _currentIndex = 2);
        break;
      case '/medications':
        Navigator.pushNamed(context, '/medication-tracker');
        break;
      case '/emergency_contacts':
        Navigator.pushNamed(context, '/emergency-contacts');
        break;
      case '/wellness_hub':
        Navigator.pushNamed(context, '/wellness-hub');
        break;
      default:
        try {
          Navigator.pushNamed(context, route);
        } catch (e) {
          debugPrint('Navigation failed for route: $route');
        }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: _tabs[_currentIndex],
      floatingActionButton: VoiceCommandsWidget(
        isDarkMode: isDark,
        onCommandExecuted: () {
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.startFloat,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          boxShadow: [
            BoxShadow(
              color: isDark
                  ? Colors.black.withOpacity(0.3)
                  : Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          selectedItemColor: const Color(0xFF4285F4),
          unselectedItemColor: isDark ? Colors.white60 : Colors.grey,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.air_outlined),
              activeIcon: Icon(Icons.air),
              label: 'Pollution',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.health_and_safety_outlined),
              activeIcon: Icon(Icons.health_and_safety),
              label: 'Health',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings_outlined),
              activeIcon: Icon(Icons.settings),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}
