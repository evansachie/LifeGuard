import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userNameKey = 'user_name';
  static const String _emailKey = 'email';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _onboardingCompletedKey = 'onboarding_completed';

  // Token management
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  // User ID management
  static Future<void> saveUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  static Future<void> removeUserId() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userIdKey);
  }

  // User name management
  static Future<void> saveUserName(String userName) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userNameKey, userName);
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }

  static Future<void> removeUserName() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userNameKey);
  }

  // Email management
  static Future<void> saveEmail(String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_emailKey, email);
  }

  static Future<String?> getEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_emailKey);
  }

  static Future<void> removeEmail() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_emailKey);
  }

  // Login status management
  static Future<void> setLoggedIn(bool isLoggedIn) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_isLoggedInKey, isLoggedIn);
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_isLoggedInKey) ?? false;
  }

  // Onboarding status
  static Future<void> setOnboardingCompleted(bool completed) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardingCompletedKey, completed);
  }

  static Future<bool> isOnboardingCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_onboardingCompletedKey) ?? false;
  }

  // Authentication data management
  static Future<void> saveAuthData({
    required String token,
    required String userId,
    required String userName,
    required String email,
  }) async {
    await Future.wait([
      saveToken(token),
      saveUserId(userId),
      saveUserName(userName),
      saveEmail(email),
      setLoggedIn(true),
    ]);
  }

  static Future<Map<String, String?>> getAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'token': prefs.getString(_tokenKey),
      'userId': prefs.getString(_userIdKey),
      'userName': prefs.getString(_userNameKey),
      'email': prefs.getString(_emailKey),
    };
  }

  // Clear all authentication data
  static Future<void> clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await Future.wait([
      prefs.remove(_tokenKey),
      prefs.remove(_userIdKey),
      prefs.remove(_userNameKey),
      prefs.remove(_emailKey),
      prefs.setBool(_isLoggedInKey, false),
    ]);
  }

  // Clear all data
  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // Generic storage methods
  static Future<void> saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  static Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  static Future<void> saveBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  static Future<bool?> getBool(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key);
  }

  static Future<void> saveInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(key, value);
  }

  static Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }

  static Future<void> saveDouble(String key, double value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(key, value);
  }

  static Future<double?> getDouble(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(key);
  }

  static Future<void> saveStringList(String key, List<String> value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(key, value);
  }

  static Future<List<String>?> getStringList(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(key);
  }

  static Future<void> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  static Future<bool> containsKey(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(key);
  }
}
