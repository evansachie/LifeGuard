import 'package:flutter/material.dart';
import 'package:lifeguard/screens/auth/welcome_screen.dart';
import 'package:flutter_svg/flutter_svg.dart';

class OnboardingScreen2 extends StatelessWidget {
  const OnboardingScreen2({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      body: SafeArea(
        child: Stack(
          children: [
            // Skip Button
            Positioned(
              top: 16,
              right: 16,
              child: TextButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const WelcomeScreen()),
                  );
                },
                child: Text(
                  'Skip',
                  style: TextStyle(
                    color: isDark ? Colors.white70 : const Color(0xFF666666),
                    fontSize: 16,
                  ),
                ),
              ),
            ),

            Column(
              children: [
                const SizedBox(height: 80),
                // Image
                Expanded(
                  flex: 3,
                  child: SvgPicture.asset(
                    'assets/images/fitness-2.svg',
                    fit: BoxFit.contain,
                  ),
                ),

                // Content
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        Text(
                          'Get notified for any\nanomalies in\nyour health',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color:
                                isDark ? Colors.white : const Color(0xFF333333),
                          ),
                        ),
                        const SizedBox(height: 30),

                        // Pagination dots
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.white24
                                    : const Color(0xFFDDDDDD),
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                            Container(
                              width: 24,
                              height: 8,
                              margin: const EdgeInsets.only(left: 8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF4285F4),
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Next Button
            Positioned(
              bottom: 40,
              right: 24,
              child: FloatingActionButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const WelcomeScreen(),
                    ),
                  );
                },
                backgroundColor: const Color(0xFF4285F4),
                child: const Icon(
                  Icons.arrow_forward,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
