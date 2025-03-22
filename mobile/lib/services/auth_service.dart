import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  static final String baseUrl = dotenv.env['API_URL'] ?? 'https://lifeguard-hiij.onrender.com';

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception(json.decode(response.body)['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception(json.decode(response.body)['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<bool> verifyOTP(String email, String otp) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/VerifyOTP'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'otp': otp,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to verify OTP: $e');
    }
  }

  Future<bool> requestPasswordReset(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to request password reset: $e');
    }
  }

  Future<bool> resendOTP(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/ResendOTP'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to resend OTP: $e');
    }
  }

  Future<bool> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'resetUrl': 'lifeguardapp://reset-password', // Add mobile deep link
          'isMobile': true // Add flag to indicate mobile request
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        final error = json.decode(response.body);
        throw Exception(error['message'] ?? 'Failed to send reset email');
      }
    } catch (e) {
      throw Exception('Failed to send password reset email: $e');
    }
  }

  Future<bool> resetPassword(String email, String token, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/Account/ResetPassword'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'token': token,
          'newPassword': newPassword,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to reset password: $e');
    }
  }
}
