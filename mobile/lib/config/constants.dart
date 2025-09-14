class Constants {
  // API URLs
  static const String baseUrl = 'https://lifeguard-hiij.onrender.com';
  static const String nodeApiUrl = 'https://lifeguard-node.onrender.com';
  
  // Development URLs (uncomment for local development)
  // static const String baseUrl = 'http://localhost:5000';
  // static const String nodeApiUrl = 'http://localhost:5001';
  
  // API Endpoints
  static const String apiPath = '/api';
  
  // Auth endpoints
  static const String loginEndpoint = '$baseUrl$apiPath/Account/login';
  static const String registerEndpoint = '$baseUrl$apiPath/Account/register';
  static const String forgotPasswordEndpoint = '$baseUrl$apiPath/Account/forgot-password';
  static const String resetPasswordEndpoint = '$baseUrl$apiPath/Account/ResetPassword';
  static const String verifyOtpEndpoint = '$baseUrl$apiPath/Account/VerifyOTP';
  static const String resendOtpEndpoint = '$baseUrl$apiPath/Account/ResendOTP';
  static const String googleLoginEndpoint = '$baseUrl$apiPath/Account/google-login';
  
  // User endpoints
  static String getUserEndpoint(String userId) => '$baseUrl$apiPath/Account/$userId';
  static String getProfileEndpoint(String userId) => '$baseUrl$apiPath/Account/GetProfile/$userId';
  static const String completeProfileEndpoint = '$baseUrl$apiPath/Account/CompleteProfile';
  
  // Photo endpoints
  static String getPhotoEndpoint(String userId) => '$baseUrl/$userId/photo';
  static String uploadPhotoEndpoint(String userId) => '$baseUrl/$userId/photo';
  static String deletePhotoEndpoint(String userId) => '$baseUrl/$userId/photo';
  
  // Node.js endpoints
  static const String memosEndpoint = '$nodeApiUrl/api/memos';
  static const String emergencyContactsEndpoint = '$nodeApiUrl/api/emergency-contacts';
  static const String healthMetricsEndpoint = '$nodeApiUrl/api/health-metrics';
  static const String medicationsEndpoint = '$nodeApiUrl/api/medications';
  static const String exerciseEndpoint = '$nodeApiUrl/api/exercise';
  static const String favoriteSoundsEndpoint = '$nodeApiUrl/api/favorite-sounds';
  static const String freesoundEndpoint = '$nodeApiUrl/api/freesound';
  static const String ragEndpoint = '$nodeApiUrl/api/rag';
  
  // App constants
  static const String appName = 'LifeGuard';
  static const String appVersion = '1.0.0';
  
  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String userNameKey = 'user_name';
  static const String emailKey = 'email';
  static const String isLoggedInKey = 'is_logged_in';
  static const String onboardingCompletedKey = 'onboarding_completed';
  static const String themeKey = 'theme_mode';
  
  // Validation constants
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 128;
  static const int otpLength = 6;
  
  // Network constants
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // File upload
  static const int maxFileSize = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  
  // Medication constants
  static const List<String> medicationFrequencies = [
    'daily',
    'weekly',
    'monthly',
    'as needed'
  ];
  
  static const List<String> medicationUnits = [
    'mg',
    'g',
    'ml',
    'tablet',
    'capsule',
    'drop',
    'spray'
  ];
  
  // Health metrics constants
  static const Map<String, Map<String, double>> healthRanges = {
    'heartRate': {
      'min': 60.0,
      'max': 100.0,
    },
    'systolicBP': {
      'min': 90.0,
      'max': 120.0,
    },
    'diastolicBP': {
      'min': 60.0,
      'max': 80.0,
    },
    'temperature': {
      'min': 36.1,
      'max': 37.2,
    },
    'oxygenSaturation': {
      'min': 95.0,
      'max': 100.0,
    },
  };
  
  // Error messages
  static const String networkErrorMessage = 'Network error. Please check your connection.';
  static const String serverErrorMessage = 'Server error. Please try again later.';
  static const String unauthorizedErrorMessage = 'Unauthorized. Please log in again.';
  static const String validationErrorMessage = 'Please check your input and try again.';
  
  // Success messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registrationSuccessMessage = 'Registration successful! Please verify your email.';
  static const String passwordResetSuccessMessage = 'Password reset link sent to your email.';
  static const String profileUpdateSuccessMessage = 'Profile updated successfully!';
  
  // Feature flags
  static const bool enableGoogleAuth = true;
  static const bool enableBiometricAuth = true;
  static const bool enableNotifications = true;
  static const bool enableOfflineMode = true;
  
  // Debug flags
  static const bool enableLogging = true;
  static const bool enableCrashReporting = true;
  
  // BLE Constants
  static const String bleDevicePrefix = 'NiclaSenseME-';
  static const String bleServiceUuid = '19b10000-0000-537e-4f6c-d104768a1214';
  
  // BLE Characteristic UUIDs (matching firmware)
  static const String temperatureCharacteristicUuid = '19b10000-2001-537e-4f6c-d104768a1214';
  static const String humidityCharacteristicUuid = '19b10000-3001-537e-4f6c-d104768a1214';
  static const String pressureCharacteristicUuid = '19b10000-4001-537e-4f6c-d104768a1214';
  static const String accelerometerCharacteristicUuid = '19b10000-5001-537e-4f6c-d104768a1214';
  static const String gyroscopeCharacteristicUuid = '19b10000-6001-537e-4f6c-d104768a1214';
  static const String quaternionCharacteristicUuid = '19b10000-7001-537e-4f6c-d104768a1214';
  static const String rgbLedCharacteristicUuid = '19b10000-8001-537e-4f6c-d104768a1214';
  static const String bsecCharacteristicUuid = '19b10000-9001-537e-4f6c-d104768a1214';
  static const String co2CharacteristicUuid = '19b10000-9002-537e-4f6c-d104768a1214';
  static const String gasCharacteristicUuid = '19b10000-9003-537e-4f6c-d104768a1214';
  static const String inferenceCharacteristicUuid = '19b10000-8005-537e-4f6c-d104768a1214';
  
  // BLE Configuration
  static const int bleScanTimeoutSeconds = 10;
  static const int bleConnectionTimeoutSeconds = 15;
  static const int bleDataUpdateIntervalMs = 1000;
  
  // Device thresholds for health monitoring
  static const double fallDetectionThreshold = 0.7;
  static const double temperatureAlertMin = 35.0; // °C
  static const double temperatureAlertMax = 39.0; // °C
  static const double humidityAlertMax = 80.0; // %
  static const double airQualityAlertMax = 150.0; // IAQ
}
