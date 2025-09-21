import 'package:flutter/material.dart';
import 'package:lifeguard/providers/emergency_contact_provider.dart';
import 'package:lifeguard/providers/memo_provider.dart';
import 'package:lifeguard/providers/sound_provider.dart';
import 'package:lifeguard/screens/auth/forgot_password_screen.dart';
import 'package:lifeguard/screens/auth/login_screen.dart';
import 'package:lifeguard/screens/auth/otp_verification_screen.dart';
import 'package:lifeguard/screens/auth/register_screen.dart';
import 'package:lifeguard/screens/emergency_contacts/emergency_contacts_screen.dart';
import 'package:lifeguard/screens/home/home_screen.dart';
import 'package:lifeguard/screens/memos/memos_screen.dart';
import 'package:lifeguard/screens/onboarding/onboarding_screen1.dart';
import 'package:provider/provider.dart';
import 'package:lifeguard/providers/theme_provider.dart';
import 'package:lifeguard/providers/auth_provider.dart';
import 'package:lifeguard/screens/splash/splash_screen.dart';
import 'package:lifeguard/providers/quote_provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:lifeguard/providers/audio_provider.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'providers/profile_provider.dart';
import 'providers/medication_provider.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/settings/privacy_screen.dart';
import 'screens/settings/help_support_screen.dart';
import 'screens/settings/about_screen.dart';
import 'screens/notifications/notifications_screen.dart';
import 'screens/medication/medication_tracker_screen.dart';
import 'providers/ble_provider.dart';
import 'screens/device/device_scanner_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  try {
    await JustAudioBackground.init(
      androidNotificationChannelId: 'com.lifeguard.audio.channel.id',
      androidNotificationChannelName: 'LifeGuard Audio',
      androidNotificationOngoing: true,
      androidStopForegroundOnPause: true,
      androidNotificationIcon: 'mipmap/ic_launcher',
      notificationColor: const Color(0xFF2196f3),
    );
  } catch (e) {
    debugPrint('Audio service initialization error: $e');
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => QuoteProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => MemoProvider()),
        ChangeNotifierProvider(create: (_) => EmergencyContactProvider()),
        ChangeNotifierProvider(create: (_) => SoundProvider()),
        ChangeNotifierProvider(create: (_) => AudioProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
        ChangeNotifierProxyProvider<AuthProvider, MedicationProvider>(
          create: (_) => MedicationProvider(),
          update: (_, authProvider, medicationProvider) {
            medicationProvider!.setAuthProvider(authProvider);
            return medicationProvider;
          },
        ),
        ChangeNotifierProxyProvider<EmergencyContactProvider, BleProvider>(
          create: (_) => BleProvider(),
          update: (_, emergencyProvider, bleProvider) {
            bleProvider!.setEmergencyContactProvider(emergencyProvider);
            return bleProvider;
          },
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) => MaterialApp(
          title: 'LifeGuard',
          themeMode: themeProvider.themeMode,
          theme: ThemeData(
            colorScheme:
                ColorScheme.fromSeed(seedColor: const Color(0xFF4285F4)),
            useMaterial3: true,
          ),
          darkTheme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF4285F4),
              brightness: Brightness.dark,
            ),
            scaffoldBackgroundColor: const Color(0xFF121212),
            useMaterial3: true,
          ),
          home: const SplashScreen(),
          routes: {
            '/login': (context) => const LoginScreen(),
            '/register': (context) => const RegisterScreen(),
            '/home': (context) => const HomeScreen(),
            '/profile': (context) => const ProfileScreen(),
            '/forgot-password': (context) => const ForgotPasswordScreen(),
            '/onboarding': (context) => const OnboardingScreen1(),
            '/welcome': (context) => const SplashScreen(),
            '/memos': (context) => const MemosScreen(),
            '/verify-otp': (context) {
              final email =
                  ModalRoute.of(context)?.settings.arguments as String?;
              return OTPVerificationScreen(email: email);
            },
            '/emergency-contacts': (context) => const EmergencyContactsScreen(),
            '/privacy': (context) => const PrivacyScreen(),
            '/help-support': (context) => const HelpSupportScreen(),
            '/about': (context) => const AboutScreen(),
            '/notifications': (context) => const NotificationsScreen(),
            '/medication-tracker': (context) => const MedicationTrackerScreen(),
            '/device-scanner': (context) => const DeviceScannerScreen(),
          },
        ),
      ),
    );
  }
}
