import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/profile_model.dart';
import '../config/api_config.dart';

class ProfileService {
  static const String _baseUrl = ApiConfig.baseUrl;
  static const String _nodeBaseUrl = ApiConfig.nodeBaseUrl;

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<String?> _getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  static Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  static Future<ProfileData> fetchUserProfile() async {
    try {
      final userId = await _getUserId();
      if (userId == null) throw Exception('User ID not found');

      final headers = await _getHeaders();

      // Fetch user data
      final userResponse = await http.get(
        Uri.parse('$_baseUrl/api/Account/$userId'),
        headers: headers,
      );

      // Fetch profile data
      final profileResponse = await http.get(
        Uri.parse('$_baseUrl/api/Account/GetProfile/$userId'),
        headers: headers,
      );

      Map<String, dynamic> userData = {};
      Map<String, dynamic> profileData = {};

      if (userResponse.statusCode == 200) {
        userData = json.decode(userResponse.body);
      }

      if (profileResponse.statusCode == 200) {
        final profileResponseData = json.decode(profileResponse.body);
        
        if (profileResponseData['data'] != null) {
          profileData = profileResponseData['data'];
        } else if (profileResponseData['isSuccess'] == true && profileResponseData['data'] != null) {
          profileData = profileResponseData['data'];
        } else {
          // Sometimes the profile data is in the root
          profileData = profileResponseData;
        }
      }

      // Try to get profile photo
      String? photoUrl;
      try {
        final photoResponse = await http.get(
          Uri.parse('$_baseUrl/$userId/photo'),
          headers: headers,
        );

        if (photoResponse.statusCode == 200) {
          final photoData = json.decode(photoResponse.body);
          if (photoData['isSuccess'] == true && photoData['data'] != null) {
            photoUrl = photoData['data']['url'];
          }
        }
      } catch (e) {
        if (kDebugMode) {
          print('Failed to fetch profile photo: $e');
        }
      }

      // Combine user and profile data with proper null handling
      final combinedData = {
        'id': userId,
        'fullName': userData['userName'] ?? userData['name'] ?? '',
        'email': userData['email'] ?? '',
        'phone': profileData['phoneNumber'] ?? profileData['phone'] ?? '',
        'bio': profileData['bio'] ?? '',
        'age': profileData['age'],
        'gender': profileData['gender'] ?? '',
        'weight': profileData['weight']?.toDouble(),
        'height': profileData['height']?.toDouble(),
        'profileImage': photoUrl,
      };

      return ProfileData.fromJson(combinedData);
    } catch (e) {
      throw Exception('Failed to fetch profile: $e');
    }
  }

  static Future<void> updateProfile(ProfileData profileData) async {
    try {
      final headers = await _getHeaders();

      final response = await http.post(
        Uri.parse('$_baseUrl/api/Account/CompleteProfile'),
        headers: headers,
        body: json.encode(profileData.toJson()),
      );

      if (response.statusCode != 200) {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to update profile');
      }
    } catch (e) {
      throw Exception('Failed to update profile: $e');
    }
  }

  static Future<String?> uploadProfilePhoto(File imageFile) async {
    try {
      final userId = await _getUserId();
      if (userId == null) throw Exception('User ID not found');

      final token = await _getToken();
      if (token == null) throw Exception('Authentication token not found');

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$_baseUrl/$userId/photo'),
      );

      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(
        await http.MultipartFile.fromPath('file', imageFile.path),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        if (responseData['isSuccess'] == true && responseData['data'] != null) {
          return responseData['data']['url'];
        }
      }

      throw Exception('Failed to upload photo');
    } catch (e) {
      throw Exception('Failed to upload photo: $e');
    }
  }

  static Future<void> deleteProfilePhoto() async {
    try {
      final userId = await _getUserId();
      if (userId == null) throw Exception('User ID not found');

      final headers = await _getHeaders();

      final response = await http.delete(
        Uri.parse('$_baseUrl/$userId/photo'),
        headers: headers,
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to delete photo');
      }
    } catch (e) {
      throw Exception('Failed to delete photo: $e');
    }
  }

  static Future<List<EmergencyContact>> fetchEmergencyContacts() async {
    try {
      final headers = await _getHeaders();

      final response = await http.get(
        Uri.parse('$_nodeBaseUrl/api/emergency-contacts'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> contactsJson = json.decode(response.body);
        return contactsJson.map((json) => EmergencyContact.fromJson(json)).toList();
      }

      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<void> deleteAccount() async {
    try {
      final userId = await _getUserId();
      if (userId == null) throw Exception('User ID not found');

      final headers = await _getHeaders();

      final response = await http.delete(
        Uri.parse('$_baseUrl/api/Account/$userId'),
        headers: headers,
      );

      if (response.statusCode != 200) {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to delete account');
      }
    } catch (e) {
      throw Exception('Failed to delete account: $e');
    }
  }
}
