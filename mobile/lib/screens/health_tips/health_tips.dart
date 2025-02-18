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

  // Pagination variables
  static const int itemsPerPage = 6;
  int currentPage = 1;
  bool hasMorePages = true;

  final categories = [
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

  // Initial mock data with article links
  final mockTips = [
    HealthTip(
      id: '1',
      category: 'prevention',
      title: 'Understanding Air Quality',
      description:
          'Learn how air quality affects your health and what you can do to protect yourself.',
      type: 'article',
      imageUrl:
          'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800',
      url:
          'https://www.epa.gov/indoor-air-quality-iaq/introduction-indoor-air-quality',
    ),
    HealthTip(
      id: '2',
      category: 'fitness',
      title: 'Daily Exercise Routine',
      description:
          'Simple exercises you can do at home to stay fit and healthy.',
      type: 'article',
      imageUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      url: 'https://www.cdc.gov/physicalactivity/basics/index.htm',
    ),
    HealthTip(
      id: '3',
      category: 'mental',
      title: 'Stress Management',
      description:
          'Effective techniques for managing daily stress and anxiety.',
      type: 'article',
      imageUrl:
          'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
      url: 'https://www.nimh.nih.gov/health/publications/stress',
    ),
    HealthTip(
      id: '4',
      category: 'prevention',
      title: 'Recognizing Heart Attack Symptoms',
      description:
          'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
      type: 'article',
      imageUrl:
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
      url:
          'https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack',
    ),
  ];

  @override
  void initState() {
    super.initState();
    // Show mock data immediately
    tips = mockTips;
    featuredTip = {
      'title': "Today's Health Highlight",
      'description': "Learn about health and wellness tips for better living",
      'image':
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
      'category': "prevention"
    };

    // Then load real data in background
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

  List<HealthTip> get paginatedTips {
    final filtered = filteredTips;
    final startIndex = (currentPage - 1) * itemsPerPage;
    final endIndex = startIndex + itemsPerPage;

    if (startIndex >= filtered.length) {
      return [];
    }

    hasMorePages = endIndex < filtered.length;
    return filtered.sublist(startIndex, endIndex.clamp(0, filtered.length));
  }

  void loadNextPage() {
    if (hasMorePages) {
      setState(() {
        currentPage++;
      });
    }
  }

  // Add this getter to check if there's a previous page
  bool get hasPreviousPage => currentPage > 1;

  // Add method to handle previous page
  void loadPreviousPage() {
    if (hasPreviousPage) {
      setState(() {
        currentPage--;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

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
          // Featured Section - Always show with mock data first
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
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blue.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
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

          // Categories - Always show
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  FilterChip(
                    selected: selectedCategory == 'all',
                    label: const Text('All'),
                    onSelected: (_) => setState(() => selectedCategory = 'all'),
                    avatar: const Icon(Icons.all_inclusive),
                  ),
                  const SizedBox(width: 8),
                  ...categories.map((category) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          selected: selectedCategory == category['id'],
                          label: Text(category['label'] as String),
                          onSelected: (_) => setState(() =>
                              selectedCategory = category['id'] as String),
                          avatar: Icon(category['icon'] as IconData),
                        ),
                      )),
                ],
              ),
            ),
          ),

          // Tips Grid with pagination
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
                  final tip = paginatedTips[index];
                  return _buildTipCard(tip, isDark);
                },
                childCount: paginatedTips.length,
              ),
            ),
          ),

          // Loading Indicator
          if (isLoading)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 32.0),
                child: Center(
                  child: Column(
                    children: [
                      const CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Color(0xFF4285F4)),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Loading more health tips...',
                        style: TextStyle(
                          color: isDark ? Colors.white70 : Colors.black54,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // Pagination Controls
          if (!isLoading && (hasMorePages || hasPreviousPage))
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Previous Button
                    if (hasPreviousPage)
                      ElevatedButton.icon(
                        onPressed: loadPreviousPage,
                        icon: const Icon(Icons.arrow_back, size: 16),
                        label: const Text('Previous'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4285F4),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                      ),

                    // Page Indicator
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Page $currentPage',
                        style: TextStyle(
                          color: isDark ? Colors.white70 : Colors.black54,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    // Next Button
                    if (hasMorePages)
                      ElevatedButton.icon(
                        onPressed: loadNextPage,
                        label: const Text('Next'),
                        icon: const Icon(Icons.arrow_forward, size: 16),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4285F4),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                      ),
                  ],
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
                  height: 1.2,
                ),
                maxLines: 1,
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
