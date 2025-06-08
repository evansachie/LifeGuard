import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../providers/auth_provider.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    await Future.delayed(const Duration(seconds: 4));

    if (!mounted) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final prefs = await SharedPreferences.getInstance();
    
    // Check if user is logged in first
    final token = prefs.getString('token');
    final userId = prefs.getString('userId');
    
    if (token != null && userId != null) {
      // User has valid credentials, verify with provider
      final isLoggedIn = await authProvider.checkLoginStatus();
      if (isLoggedIn && mounted) {
        Navigator.pushReplacementNamed(context, '/home');
        return;
      }
    }

    // If not logged in, check onboarding status
    final hasSeenOnboarding = prefs.getBool('hasSeenOnboarding') ?? false;
    if (!mounted) return;

    if (hasSeenOnboarding) {
      Navigator.pushReplacementNamed(context, '/welcome');
    } else {
      Navigator.pushReplacementNamed(context, '/onboarding');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFE1F2F5),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              'assets/images/lifeguard-logo.svg',
              width: 250,
              height: 250,
              // colorFilter: ColorFilter.mode(
              //   isDark ? Colors.white : Colors.black,
              //   BlendMode.srcIn,
              // ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
