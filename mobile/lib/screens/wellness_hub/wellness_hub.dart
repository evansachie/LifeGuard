import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:lifeguard/data/sound_data.dart';
import 'dart:async';
import 'package:lifeguard/data/breathing_data.dart';

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
  late AudioPlayer audioPlayer;
  Sound? currentSound;
  double volume = 0.5;
  BreathingPattern? activePattern;
  String selectedCategory = 'all';

  final meditationPresets = [
    {'time': 300, 'label': '5 minutes'},
    {'time': 600, 'label': '10 minutes'},
    {'time': 900, 'label': '15 minutes'},
    {'time': 1200, 'label': '20 minutes'},
  ];

  @override
  void initState() {
    super.initState();
    audioPlayer = AudioPlayer();

    // Set up looping
    audioPlayer.setLoopMode(LoopMode.one);

    // Handle completion
    audioPlayer.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
        audioPlayer.seek(Duration.zero);
        audioPlayer.play();
      }
    });
  }

  @override
  void dispose() {
    audioPlayer.stop();
    audioPlayer.dispose();
    breathingTimer?.cancel();
    meditationTimer?.cancel();
    super.dispose();
  }

  void startBreathing() {
    setState(() {
      isBreathing = true;
      breathingPhase = 'inhale';
    });

    breathingTimer =
        Timer.periodic(const Duration(milliseconds: 4000), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        breathingPhase = breathingPhase == 'inhale' ? 'exhale' : 'inhale';
      });
    });
  }

  void stopBreathing() {
    breathingTimer?.cancel();
    setState(() {
      isBreathing = false;
      breathingPhase = 'inhale';
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

  Future<void> _playSound(Sound sound) async {
    try {
      // Stop any currently playing audio first
      await audioPlayer.stop();

      // Create the audio source
      final audioSource = AudioSource.uri(
        Uri.parse(sound.audioURL),
        tag: MediaItem(
          id: sound.title, // Use a unique identifier
          title: sound.title,
          artist: sound.location,
          artUri: Uri.parse(sound.imageName), // If you have artwork URL
        ),
      );

      // Set the audio source and play
      await audioPlayer.setAudioSource(audioSource);
      await audioPlayer.play();
      setState(() => currentSound = sound);
    } catch (e) {
      debugPrint('Error playing sound: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error playing sound: ${e.toString()}')),
        );
      }
    }
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
              onSelectionChanged: (selection) {
                setState(() => activeSection = selection.first);
                if (activeSection != 'breathing') {
                  stopBreathing();
                }
                if (activeSection != 'sounds') {
                  audioPlayer.stop();
                  setState(() => currentSound = null);
                }
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
        return _buildSoundSection();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildBreathingSection() {
    if (isBreathing && activePattern != null) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            activePattern!.name,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),
          AnimatedContainer(
            duration: const Duration(milliseconds: 4000),
            curve: Curves.easeInOut,
            width: breathingPhase == 'inhale' ? 250 : 150,
            height: breathingPhase == 'inhale' ? 250 : 150,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: activePattern!.color.withOpacity(0.2),
            ),
            child: Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 4000),
                curve: Curves.easeInOut,
                width: breathingPhase == 'inhale' ? 200 : 100,
                height: breathingPhase == 'inhale' ? 200 : 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: activePattern!.color.withOpacity(0.3),
                ),
                child: Center(
                  child: Text(
                    breathingPhase.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: stopBreathing,
            icon: const Icon(Icons.stop),
            label: const Text('Stop'),
            style: FilledButton.styleFrom(
              backgroundColor: activePattern!.color,
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: breathingPatterns.length,
      itemBuilder: (context, index) {
        final pattern = breathingPatterns[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: pattern.color,
              child: Icon(pattern.icon, color: Colors.white),
            ),
            title: Text(pattern.name),
            subtitle: Text(pattern.description),
            trailing: FilledButton(
              onPressed: () {
                setState(() => activePattern = pattern);
                startBreathing();
              },
              style: FilledButton.styleFrom(
                backgroundColor: pattern.color,
              ),
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

  Widget _buildSoundSection() {
    return Column(
      children: [
        // Category Filter
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
              ...SoundCategory.values.map((category) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(category.name.toUpperCase()),
                    selected: selectedCategory == category.name,
                    onSelected: (selected) {
                      setState(() => selectedCategory = category.name);
                    },
                  ),
                );
              }),
            ],
          ),
        ),

        // Now Playing Bar
        if (currentSound != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Text(
                  currentSound!.title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Slider(
                    value: volume,
                    onChanged: (value) {
                      setState(() => volume = value);
                      audioPlayer.setVolume(value);
                    },
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () {
                    audioPlayer.stop();
                    setState(() => currentSound = null);
                  },
                ),
              ],
            ),
          ),

        // Sound Grid
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: soundData
                .where((sound) =>
                    selectedCategory == 'all' ||
                    sound.category.name == selectedCategory)
                .length,
            itemBuilder: (context, index) {
              final filteredSounds = soundData
                  .where((sound) =>
                      selectedCategory == 'all' ||
                      sound.category.name == selectedCategory)
                  .toList();
              final sound = filteredSounds[index];
              final isPlaying = currentSound?.title == sound.title;

              return Card(
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: () async {
                    if (isPlaying) {
                      await audioPlayer.pause();
                      setState(() => currentSound = null);
                    } else {
                      await _playSound(sound);
                    }
                  },
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.asset(
                        'assets/sounds/${sound.imageName}.jpg',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.music_note, size: 48),
                          );
                        },
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withOpacity(0.7),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 16,
                        left: 16,
                        right: 16,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              sound.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              sound.location,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isPlaying)
                        const Center(
                          child: Icon(
                            Icons.pause_circle_filled,
                            color: Colors.white,
                            size: 48,
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
