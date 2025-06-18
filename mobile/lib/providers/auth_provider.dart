import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _token;
  String? _userId;
  String? _userName;
  String? _email;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get token => _token;
  String? get userId => _userId;
  String? get userName => _userName;
  String? get email => _email;

  String? get currentToken => _token;
  String? get currentUserId => _userId;

  UserData? get currentUser {
    if (_userId != null && _userName != null && _email != null) {
      return UserData(
        id: _userId!,
        userName: _userName!,
        email: _email!,
      );
    }
    return null;
  }

  Future<void> login(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _authService.login(email, password);
      
      // Validate required fields
      if (response['token'] == null || response['id'] == null || response['userName'] == null) {
        throw Exception('Invalid login response data');
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', response['token']);
      await prefs.setString('userId', response['id']);
      await prefs.setString('userName', response['userName']);
      await prefs.setString('email', response['email']);
      await prefs.setBool('isLoggedIn', true);

      _token = response['token'];
      _userId = response['id'];
      _userName = response['userName'];
      _email = response['email'];
      _isAuthenticated = true;

    } catch (e) {
      _isAuthenticated = false;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _authService.register(name, email, password);
      final userId = response['userId'];
      
      if (userId == null) {
        throw Exception('Registration failed - no user ID received');
      }
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', userId);
      _userId = userId;

    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear(); // Clear all stored data
      
      // Reset all auth state
      _isAuthenticated = false;
      _token = null;
      _userId = null;
      _userName = null;
      _email = null;
      notifyListeners();
    } catch (e) {
      throw Exception('Failed to logout: $e');
    }
  }

  Future<bool> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userId = prefs.getString('userId');
    final userName = prefs.getString('userName');
    final email = prefs.getString('email');
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;

    if (token != null && userId != null && isLoggedIn) {
      _token = token;
      _userId = userId;
      _userName = userName;
      _email = email;
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }

    _isAuthenticated = false;
    notifyListeners();
    return false;
  }

  Future<bool> verifyOTP(String email, String otp) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.verifyOTP(email, otp);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> resendOTP(String email) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.resendOTP(email);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> requestPasswordReset(String email) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.requestPasswordReset(email);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> checkLoginStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userId = prefs.getString('userId');
    
    if (token != null && userId != null) {
      _token = token;
      _userId = userId;
      _userName = prefs.getString('userName');
      _email = prefs.getString('email');
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    return false;
  }
}

class UserData {
  final String id;
  final String userName;
  final String email;

  UserData({
    required this.id,
    required this.userName,
    required this.email,
  });
}
