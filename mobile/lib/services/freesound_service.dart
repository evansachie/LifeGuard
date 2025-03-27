import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class FreesoundService {
  static final String baseUrl = dotenv.env['NODE_API_URL'] ?? 'https://lifeguard-node.onrender.com';

  Future<List<Map<String, dynamic>>> searchSounds(String token, {
    String query = '',
    String category = 'all',
    int page = 1
  }) async {
    try {
      // The web implementation uses the search-proxy endpoint
      final response = await http.get(
        Uri.parse('$baseUrl/api/freesound/search-proxy').replace(
          queryParameters: {
            'query': query,
            'category': category,
            'page': page.toString(),
          },
        ),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        // The web implementation returns results in responseData.results
        final List<dynamic> results = responseData['results'] ?? [];
        return List<Map<String, dynamic>>.from(results);
      } else {
        throw Exception('Failed to load sounds: ${response.statusCode}');
      }
    } catch (e) {
      print('Freesound service error: $e');
      throw Exception('Failed to fetch sounds: $e');
    }
  }

  Future<Map<String, dynamic>> getSoundDetails(String token, String soundId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/freesound/sound-proxy/$soundId'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to get sound details');
      }
    } catch (e) {
      throw Exception('Failed to get sound details: $e');
    }
  }

  Future<String> getAudioUrl(String token, String soundId) async {
    try {
      // The web implementation uses audio-proxy endpoint
      final response = await http.get(
        Uri.parse('$baseUrl/api/freesound/audio-proxy/$soundId'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['url'];
      } else {
        throw Exception('Failed to get audio URL');
      }
    } catch (e) {
      throw Exception('Failed to get audio URL: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getFavorites(String token, String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/favorite-sounds/$userId'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      } else {
        throw Exception('Failed to get favorites');
      }
    } catch (e) {
      throw Exception('Failed to get favorites: $e');
    }
  }

  Future<void> toggleFavorite(String token, String userId, String soundId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/favorite-sounds/toggle'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId': userId,
          'soundId': soundId,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to toggle favorite');
      }
    } catch (e) {
      throw Exception('Failed to toggle favorite: $e');
    }
  }
}
