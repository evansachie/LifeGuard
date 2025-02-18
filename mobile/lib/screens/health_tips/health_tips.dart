import 'package:flutter/material.dart';
import 'package:lifeguard/services/health_tips_service.dart';
import 'package:url_launcher/url_launcher.dart';

class HealthTips extends StatefulWidget {
  const HealthTips({super.key});

  @override
  State<HealthTips> createState() => _HealthTipsState();
}

class _HealthTipsState extends State<HealthTips> {
  String selectedCategory = 'all';
  String searchQuery = '';
  bool isLoading = true;
  final HealthTipsService _healthTipsService = HealthTipsService();
  List<HealthTip> tips = [];
  Map<String, dynamic>? featuredTip;

  final categories = [
    {
      'id': 'emergency',
      'icon': Icons.local_hospital,
      'label': 'Emergency Care'
    },
    {'id': 'fitness', 'icon': Icons.directions_run, 'label': 'Fitness'},
    {'id': 'nutrition', 'icon': Icons.apple, 'label': 'Nutrition'},
    {'id': 'mental', 'icon': Icons.psychology, 'label': 'Mental Health'},
    {
      'id': 'prevention',
      'icon': Icons.health_and_safety,
      'label': 'Prevention'
    },
    {
      'id': 'resources',
      'icon': Icons.medical_information,
      'label': 'Resources'
    },
  ];

  // Mock data for initial loading state
  final mockTips = [
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
      title: 'Quick 10-Minute Workouts',
      description:
          'Effective exercises you can do anywhere to maintain your fitness levels.',
      type: 'article',
    ),
    // Add a few more mock tips...
  ];

  @override
  void initState() {
    super.initState();
    // Show mock data immediately
    tips = mockTips;
    featuredTip = {
      'title': "Today's Health Highlight",
      'description': "Learn about health and wellness tips for better living",
      'image': 'assets/images/med.png',
      'category': "prevention"
    };
    // Then load real data
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final data = await _healthTipsService.fetchHealthTips();
      if (mounted) {
        setState(() {
          featuredTip = data['featured'];
          tips = (data['tips'] as List).cast<HealthTip>();
          isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading health tips: $e');
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  List<HealthTip> get filteredTips {
    return tips.where((tip) {
      final matchesCategory =
          selectedCategory == 'all' || tip.category == selectedCategory;
      final matchesSearch = searchQuery.isEmpty ||
          tip.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          tip.description.toLowerCase().contains(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF4285F4),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Health Tips',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF4285F4),
              ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Featured Section
          SliverToBoxAdapter(
            child: Container(
              height: 200,
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF007AFF), Color(0xFF00C6FF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: 0,
                    bottom: 0,
                    top: 0,
                    width: MediaQuery.of(context).size.width * 0.4,
                    child: const ClipRRect(
                      borderRadius: BorderRadius.horizontal(
                        right: Radius.circular(20),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          featuredTip?['title'] ?? '',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          featuredTip?['description'] ?? '',
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                        const Spacer(),
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF007AFF),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: const Text('Learn More'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                onChanged: (value) => setState(() => searchQuery = value),
                decoration: InputDecoration(
                  hintText: 'Search health tips...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
              ),
            ),
          ),

          // Categories
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('All'),
                    selected: selectedCategory == 'all',
                    onSelected: (selected) {
                      setState(() => selectedCategory = 'all');
                    },
                  ),
                  const SizedBox(width: 8),
                  ...categories.map((category) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(category['label'] as String),
                          selected: selectedCategory == category['id'],
                          onSelected: (selected) {
                            setState(() =>
                                selectedCategory = category['id'] as String);
                          },
                          avatar: Icon(category['icon'] as IconData),
                        ),
                      )),
                ],
              ),
            ),
          ),

          // Tips Grid
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio:
                    MediaQuery.of(context).size.width > 600 ? 1.0 : 0.85,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final tip = filteredTips[index];
                  return _buildTipCard(tip, isDark);
                },
                childCount: filteredTips.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTipCard(HealthTip tip, bool isDark) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        height: 250,
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (tip.imageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: SizedBox(
                  height: 90,
                  width: double.infinity,
                  child: Image.network(
                    tip.imageUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 90,
                        color: Colors.grey[300],
                        child: const Icon(Icons.image_not_supported),
                      );
                    },
                  ),
                ),
              ),
            const SizedBox(height: 4),
            Text(
              tip.title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Expanded(
              child: Text(
                tip.description,
                style: TextStyle(
                  color: isDark ? Colors.white70 : Colors.black54,
                  fontSize: 11,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Chip(
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    padding: const EdgeInsets.all(2),
                    label: Text(
                      categories.firstWhere(
                              (cat) => cat['id'] == tip.category)['label']
                          as String,
                      style: const TextStyle(fontSize: 9),
                    ),
                    backgroundColor: _getCategoryColor(tip.category),
                  ),
                ),
                if (tip.url != null)
                  TextButton(
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    onPressed: () => launchUrl(Uri.parse(tip.url!)),
                    child: const Text(
                      'Read More',
                      style: TextStyle(fontSize: 11),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'emergency':
        return Colors.red.withOpacity(0.2);
      case 'fitness':
        return Colors.green.withOpacity(0.2);
      case 'nutrition':
        return Colors.purple.withOpacity(0.2);
      case 'mental':
        return Colors.blue.withOpacity(0.2);
      case 'prevention':
        return Colors.orange.withOpacity(0.2);
      case 'resources':
        return Colors.teal.withOpacity(0.2);
      default:
        return Colors.grey.withOpacity(0.2);
    }
  }
}
