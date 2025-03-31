import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/memo_provider.dart';

class MemoFilters extends StatelessWidget {
  const MemoFilters({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final memoProvider = context.watch<MemoProvider>();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.black12 : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: isDark ? Colors.white10 : Colors.grey.shade200,
          ),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(value: 'all', label: Text('All')),
                    ButtonSegment(value: 'active', label: Text('Active')),
                    ButtonSegment(value: 'completed', label: Text('Completed')),
                  ],
                  selected: {memoProvider.filter},
                  onSelectionChanged: (Set<String> selection) {
                    memoProvider.setFilter(selection.first);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.sort),
              const SizedBox(width: 8),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: memoProvider.sortBy,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(horizontal: 12),
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'newest', child: Text('Newest First')),
                    DropdownMenuItem(value: 'oldest', child: Text('Oldest First')),
                    DropdownMenuItem(value: 'alphabetical', child: Text('Alphabetical')),
                  ],
                  onChanged: (value) {
                    if (value != null) memoProvider.setSortBy(value);
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
