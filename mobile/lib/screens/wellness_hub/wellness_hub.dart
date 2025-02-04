import 'package:flutter/material.dart';
import 'dart:async';

class WellnessHub extends StatefulWidget {
  const WellnessHub({super.key});

  @override
  State<WellnessHub> createState() => _WellnessHubState();
}

class _WellnessHubState extends State<WellnessHub> {
  String activeSection = 'breathing';
  bool isBreathing = false;
  String breathingPhase = 'inhale';
  Timer? breathingTimer;
  Timer? meditationTimer;
  int currentTime = 600; // 10 minutes default
  bool isTimerRunning = false;
  String? currentSound;
  double volume = 0.5;

  final breathingPatterns = [
    {
      'name': 'Box Breathing',
      'description': 'Equal duration for inhale, hold, exhale, and hold',
      'inhale': 4,
      'hold': 4,
      'exhale': 4,
      'holdAfterExhale': 4,
    },
    {
      'name': '4-7-8 Breathing',
      'description': 'Inhale for 4, hold for 7, exhale for 8',
      'inhale': 4,
      'hold': 10,
      'exhale': 8,
      'holdAfterExhale': 0,
    },
    {
      'name': 'Deep Breathing',
      'description': 'Deep breathing for relaxation and stress relief',
      'inhale': 4,
      'hold': 7,
      'exhale': 12,
      'holdAfterExhale': 0,
    },
  ];

  final meditationPresets = [
    {'time': 300, 'label': '5 minutes'},
    {'time': 600, 'label': '10 minutes'},
    {'time': 900, 'label': '15 minutes'},
    {'time': 1200, 'label': '20 minutes'},
  ];

  @override
  void dispose() {
    breathingTimer?.cancel();
    meditationTimer?.cancel();
    super.dispose();
  }

  void startBreathing(Map<String, dynamic> pattern) {
    setState(() {
      isBreathing = true;
      breathingPhase = 'inhale';
    });

    breathingTimer?.cancel();
    breathingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      // Implement breathing cycle logic
    });
  }

  void startMeditation() {
    setState(() {
      isTimerRunning = true;
    });

    meditationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (currentTime > 0) {
          currentTime--;
        } else {
          stopMeditation();
        }
      });
    });
  }

  void stopMeditation() {
    meditationTimer?.cancel();
    setState(() {
      isTimerRunning = false;
    });
  }

  String formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Wellness Hub',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF4285F4),
              ),
        ),
      ),
      body: Column(
        children: [
          // Section Navigation
          Padding(
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
              onSelectionChanged: (Set<String> newSelection) {
                setState(() => activeSection = newSelection.first);
              },
            ),
          ),

          // Content Area
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _buildSection(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection() {
    switch (activeSection) {
      case 'breathing':
        return _buildBreathingSection();
      case 'meditation':
        return _buildMeditationSection();
      case 'sounds':
        return _buildSoundsSection();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildBreathingSection() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: breathingPatterns.length,
      itemBuilder: (context, index) {
        final pattern = breathingPatterns[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: ListTile(
            title: Text(pattern['name'] as String),
            subtitle: Text(pattern['description'] as String),
            trailing: FilledButton(
              onPressed: () => startBreathing(pattern),
              child: const Text('Start'),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMeditationSection() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          formatTime(currentTime),
          style: const TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton.icon(
              onPressed: isTimerRunning ? stopMeditation : startMeditation,
              icon: Icon(isTimerRunning ? Icons.pause : Icons.play_arrow),
              label: Text(isTimerRunning ? 'Pause' : 'Start'),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 8,
          children: meditationPresets.map((preset) {
            return ActionChip(
              label: Text(preset['label'] as String),
              onPressed: () {
                setState(() => currentTime = preset['time'] as int);
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSoundsSection() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 1,
      ),
      itemCount: 8, // Number of sound options
      itemBuilder: (context, index) {
        return Card(
          child: InkWell(
            onTap: () {
              // Handle sound selection
            },
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.music_note,
                  size: 48,
                  color: Theme.of(context).primaryColor,
                ),
                const SizedBox(height: 8),
                Text('Sound ${index + 1}'),
              ],
            ),
          ),
        );
      },
    );
  }
}
