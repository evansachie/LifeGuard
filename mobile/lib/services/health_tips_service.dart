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
  static const String _nodeBaseUrl = 'https://lifeguard-node.onrender.com';

  Future<Map<String, dynamic>> fetchHealthTips() async {
    try {
      final response = await http.get(
        Uri.parse('$_nodeBaseUrl/api/health-tips'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final healthData = json.decode(response.body);

        // Handle the response structure from the Node.js API
        List<dynamic> tips = [];
        Map<String, dynamic>? featured;

        if (healthData is List) {
          tips = healthData;
        } else if (healthData is Map<String, dynamic>) {
          tips = healthData['tips'] ?? healthData['data'] ?? [];
          featured = healthData['featured'];
        }

        // Format tips to match our HealthTip model
        final formattedTips = tips
            .map((tip) {
              if (tip is Map<String, dynamic>) {
                return HealthTip(
                  id: tip['id']?.toString() ??
                      DateTime.now().millisecondsSinceEpoch.toString(),
                  category: tip['category'] ?? 'resources',
                  title: tip['title'] ?? tip['name'] ?? '',
                  description: tip['description'] ?? tip['summary'] ?? '',
                  type: tip['type'] ?? 'article',
                  imageUrl: tip['imageUrl'] ?? tip['image'],
                  url: tip['url'] ?? tip['link'],
                );
              }
              return null;
            })
            .where((tip) => tip != null)
            .cast<HealthTip>()
            .toList();

        return {
          'featured': featured ??
              {
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
        throw Exception('Failed to fetch health tips: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching health tips: $e');
      return getFallbackData();
    }
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
        HealthTip(
          id: '2',
          category: 'fitness',
          title: 'Daily Exercise Routine',
          description:
              'Simple exercises you can do at home to maintain your physical health.',
          type: 'article',
        ),
        HealthTip(
          id: '3',
          category: 'nutrition',
          title: 'Healthy Eating Habits',
          description:
              'Tips for maintaining a balanced diet and proper nutrition.',
          type: 'article',
        ),
        HealthTip(
          id: '4',
          category: 'mental',
          title: 'Stress Management Techniques',
          description:
              'Effective ways to manage stress and maintain mental well-being.',
          type: 'article',
        ),
        HealthTip(
          id: '5',
          category: 'prevention',
          title: 'Regular Health Checkups',
          description:
              'The importance of regular health screenings and preventive care.',
          type: 'article',
        ),
      ],
    };
  }
}
