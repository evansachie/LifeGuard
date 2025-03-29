import 'package:flutter/material.dart';
import '../../../../models/sound.dart';

class SoundFilters extends StatelessWidget {
  final SoundCategory selectedCategory;
  final Function(SoundCategory) onCategoryChanged;
  final Function(String) onSearchChanged;

  const SoundFilters({
    super.key,
    required this.selectedCategory,
    required this.onCategoryChanged,
    required this.onSearchChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        // Search Bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: TextField(
            onChanged: onSearchChanged,
            decoration: InputDecoration(
              hintText: 'Search sounds...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30),
              ),
              filled: true,
              fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
            ),
          ),
        ),
        const SizedBox(height: 16),
        
        // Category Filters
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: SoundCategory.values.map((category) {
              final isSelected = category == selectedCategory;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  selected: isSelected,
                  label: Text(_getCategoryLabel(category)),
                  avatar: Icon(_getCategoryIcon(category)),
                  onSelected: (_) => onCategoryChanged(category),
                  backgroundColor: isDark ? Colors.grey[900] : Colors.grey[100],
                  selectedColor: Colors.blue,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : null,
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  String _getCategoryLabel(SoundCategory category) {
    switch (category) {
      case SoundCategory.nature:
        return 'Nature';
      case SoundCategory.ambient:
        return 'Ambient';
      case SoundCategory.meditation:
        return 'Meditation';
      case SoundCategory.binaural:
        return 'Binaural';
      case SoundCategory.all:
        return 'All';
    }
  }

  IconData _getCategoryIcon(SoundCategory category) {
    switch (category) {
      case SoundCategory.nature:
        return Icons.forest;
      case SoundCategory.ambient:
        return Icons.waves;
      case SoundCategory.meditation:
        return Icons.self_improvement;
      case SoundCategory.binaural:
        return Icons.headphones;
      case SoundCategory.all:
        return Icons.apps;
    }
  }
}
