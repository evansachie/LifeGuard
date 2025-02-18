import 'dart:convert';
import 'package:http/http.dart' as http;

class HealthTip {
  final String id;
  final String category;
  final String title;
  final String description;
  final String type;
  final String? imageUrl;
  final String? url;

  HealthTip({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.type,
    this.imageUrl,
    this.url,
  });

  factory HealthTip.fromJson(Map<String, dynamic> json) {
    return HealthTip(
      id: json['id']?.toString() ?? '',
      category: json['category'] ?? 'resources',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      type: json['type'] ?? 'article',
      imageUrl: json['imageUrl'],
      url: json['url'],
    );
  }
}

class HealthTipsService {
  static const String _corsProxy = 'https://api.allorigins.win/raw?url=';
  static const String _healthApiBase =
      'https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en';

  Future<Map<String, dynamic>> fetchHealthTips() async {
    try {
      final response = await http.get(
        Uri.parse('$_corsProxy${Uri.encodeComponent(_healthApiBase)}'),
      );

      if (response.statusCode == 200) {
        final healthData = json.decode(response.body);
        final resources = healthData['Result']?['Resources']?['Resource'] ?? [];

        // Format and sort tips by date/relevance
        final formattedTips = _formatHealthTips(resources);

        return {
          'featured': {
            'title': "Today's Health Highlight",
            'description':
                "Learn about health and wellness tips for better living",
            'image':
                'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
            'category': "prevention"
          },
          'tips': formattedTips,
        };
      } else {
        throw Exception('Failed to fetch health tips');
      }
    } catch (e) {
      print('Error fetching health tips: $e');
      return getFallbackData();
    }
  }

  List<HealthTip> _formatHealthTips(List<dynamic> resources) {
    return resources.map((resource) {
      final title = resource['Title'] ?? '';
      final description = resource['Categories'] ?? '';

      return HealthTip(
        id: resource['Id']?.toString() ??
            DateTime.now().millisecondsSinceEpoch.toString(),
        category: _getCategoryFromTitle(title, description),
        title: title,
        description: description,
        type: 'article',
        imageUrl: resource['ImageUrl'] ??
            'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
        url: resource['AccessibleVersion'],
      );
    }).toList();
  }

  String _getCategoryFromTitle(String title, String description) {
    final lowerTitle = title.toLowerCase();
    final lowerDescription = description.toLowerCase();

    final categoryRules = {
      'emergency': ['emergency', 'urgent', 'critical', 'immediate', 'crisis'],
      'fitness': ['exercise', 'fitness', 'workout', 'physical activity'],
      'nutrition': ['diet', 'nutrition', 'food', 'eating', 'meal'],
      'mental': ['mental', 'stress', 'anxiety', 'depression'],
      'prevention': ['prevent', 'avoid', 'protect', 'risk', 'safety'],
    };

    for (var entry in categoryRules.entries) {
      if (entry.value.any((keyword) =>
          lowerTitle.contains(keyword) || lowerDescription.contains(keyword))) {
        return entry.key;
      }
    }

    return 'resources';
  }

  Map<String, dynamic> getFallbackData() {
    return {
      'featured': {
        'title': "Today's Health Highlight",
        'description':
            "Learn about air quality monitoring and its impact on your health",
        'image': 'assets/images/med.png',
        'category': "prevention"
      },
      'tips': [
        HealthTip(
          id: '1',
          category: 'emergency',
          title: 'Recognizing Heart Attack Symptoms',
          description:
              'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
          type: 'article',
        ),
      ],
    };
  }
}
