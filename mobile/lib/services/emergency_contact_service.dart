import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EmergencyContactService {
  static final String baseUrl = dotenv.env['NODE_API_URL'] ?? 'https://lifeguard-node.onrender.com';

  Future<List<Map<String, dynamic>>> getContacts(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/emergency-contacts'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      } else {
        throw Exception('Failed to load contacts');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<Map<String, dynamic>> createContact(String token, Map<String, dynamic> contact) async {
    try {
      int priorityNumber;
      switch (contact['priority'].toLowerCase()) {
        case 'high':
          priorityNumber = 1;
          break;
        case 'low':
          priorityNumber = 3;
          break;
        case 'medium':
        default:
          priorityNumber = 2;
          break;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/emergency-contacts'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'name': contact['name'],
          'email': contact['email'],
          'phone': contact['phone'],
          'relationship': contact['relationship'],
          'role': contact['role'],
          'priority': priorityNumber,
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);

        return {
          'name': data['name'] ?? data['Name'],
          'email': data['email'] ?? data['Email'],
          'phone': data['phone'] ?? data['Phone'],
          'relationship': data['relationship'] ?? data['Relationship'],
          'role': data['role'] ?? data['Role'],
          'priority': data['priority'] ?? data['Priority'],
        };
      } else {
        final error = json.decode(response.body);
        throw Exception(error['message'] ?? 'Failed to create contact');
      }
    } catch (e) {
      throw Exception('Failed to create contact: $e');
    }
  }

  Future<bool> deleteContact(String token, String id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/emergency-contacts/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to delete contact: $e');
    }
  }

  Future<bool> sendEmergencyAlert(String token, {bool isTest = false, String? contactId}) async {
    try {
      final endpoint = isTest 
          ? '$baseUrl/api/emergency-contacts/test-alert/${contactId}'
          : '$baseUrl/api/emergency-contacts/alert';

      final response = await http.post(
        Uri.parse(endpoint),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return true;
      }
      
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to send alert');
    } catch (e) {
      throw Exception('Failed to send emergency alert: $e');
    }
  }
}
