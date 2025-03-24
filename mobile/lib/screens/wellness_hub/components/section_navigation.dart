import 'package:flutter/material.dart';

class SectionNavigation extends StatelessWidget {
  final String activeSection;
  final Function(String) onSectionChange;

  const SectionNavigation({
    super.key,
    required this.activeSection,
    required this.onSectionChange,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: SegmentedButton<String>(
        segments: const [
          ButtonSegment(
            value: 'breathing',
            label: Text('Breathing'),
            icon: Icon(Icons.air),
          ),
          ButtonSegment(
            value: 'meditation',
            label: Text('Meditation'),
            icon: Icon(Icons.self_improvement),
          ),
          ButtonSegment(
            value: 'sounds',
            label: Text('Sounds'),
            icon: Icon(Icons.music_note),
          ),
        ],
        selected: {activeSection},
        onSelectionChanged: (selection) => onSectionChange(selection.first),
        style: ButtonStyle(
          backgroundColor: MaterialStateProperty.resolveWith((states) {
            if (states.contains(MaterialState.selected)) {
              return const Color(0xFF4285F4);
            }
            return null;
          }),
        ),
      ),
    );
  }
}
