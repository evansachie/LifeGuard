import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class FreesoundService {
  static const String baseUrl = 'https://freesound.org/apiv2';
  static final String apiKey = dotenv.env['FREESOUND_API_KEY'] ?? '';

  final Map<String, String> categories = {
    'nature': 'peaceful nature sounds relaxing',
    'meditation': 'tibetan bowls meditation',
    'ambient': 'ambient peaceful',
    'binaural': 'binaural beats meditation',
    'all': ''
  };

  Future<List<Map<String, dynamic>>> searchSounds(String token, {
    String query = '',
    String category = 'all',
    int page = 1
  }) async {
    try {
      final searchQuery = categories[category] ?? '';
      final fullQuery = query.isNotEmpty ? '$searchQuery $query' : searchQuery;

      final response = await http.get(
        Uri.parse('$baseUrl/search/text/')
            .replace(queryParameters: {
          'query': fullQuery,
          'page': page.toString(),
          'page_size': '12',
          'fields': 'id,name,username,previews,images,duration,description,avg_rating,tags',
          'token': apiKey,
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        return List<Map<String, dynamic>>.from(responseData['results'] ?? []);
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
        Uri.parse('$baseUrl/sounds/$soundId/')
            .replace(queryParameters: {
          'fields': 'id,name,username,previews,images,duration,description,avg_rating,tags',
          'token': apiKey,
        }),
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
      final response = await http.get(
        Uri.parse('$baseUrl/sounds/$soundId/')
            .replace(queryParameters: {
          'fields': 'previews',
          'token': apiKey,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['previews']['preview-hq-mp3'];
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
        Uri.parse('$baseUrl/users/$userId/bookmark_categories/')
            .replace(queryParameters: {
          'token': apiKey,
        }),
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
        Uri.parse('$baseUrl/users/$userId/bookmark_categories/')
            .replace(queryParameters: {
          'token': apiKey,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'sound_id': soundId,
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
