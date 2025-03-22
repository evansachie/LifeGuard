import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class MemoService {
  static final String baseUrl = dotenv.env['NODE_API_URL'] ?? 'https://lifeguard-node.onrender.com';

  Future<List<Map<String, dynamic>>> getMemos(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/memos'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      } else {
        throw Exception('Failed to load memos');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<Map<String, dynamic>> createMemo(String token, String memo) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/memos'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'memo': memo
        }),
      );

      print('Create memo response: ${response.body}'); // Debug log

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        // Match the field names with what the API returns
        return {
          '_id': data['Id'].toString(), // Convert to string and use as _id
          'Text': data['Text'] ?? data['memo'], // Handle both possible field names
          'Done': data['Done'] ?? data['done'] ?? false,
          'CreatedAt': data['CreatedAt'] ?? data['createdAt'] ?? DateTime.now().toIso8601String(),
        };
      } else {
        throw Exception('Failed to create memo');
      }
    } catch (e) {
      print('Create memo error: $e');
      throw Exception('Failed to create memo');
    }
  }

  Future<bool> updateMemo(String token, String id, String memo) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/memos/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'memo': memo
        }),
      );

      if (response.statusCode == 200) {
        return true;
      }
      throw Exception('Failed to update memo');
    } catch (e) {
      print('Update memo error: $e');
      throw Exception('Failed to update memo');
    }
  }

  Future<bool> deleteMemo(String token, String id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/memos/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        return true;
      }
      throw Exception('Failed to delete memo');
    } catch (e) {
      print('Delete memo error: $e');
      throw Exception('Failed to delete memo');
    }
  }

  Future<bool> toggleMemo(String token, String id, bool isDone) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/memos/$id/done'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'done': isDone}),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to toggle memo: $e');
    }
  }
}
