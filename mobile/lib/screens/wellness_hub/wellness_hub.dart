import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'components/breathing_section.dart';
import 'components/meditation_section.dart';
import 'components/sounds_section.dart';
import 'components/section_navigation.dart';

class WellnessHub extends StatefulWidget {
  const WellnessHub({super.key});

  @override
  State<WellnessHub> createState() => _WellnessHubState();
}

class _WellnessHubState extends State<WellnessHub> {
  String _activeSection = 'breathing';
  String? _currentSound;
  bool _isPlaying = false;
  double _volume = 0.5;
  final AudioPlayer _audioPlayer = AudioPlayer();

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        title: const Text('Wellness Hub'),
        centerTitle: false,
      ),
      body: Column(
        children: [
          SectionNavigation(
            activeSection: _activeSection,
            onSectionChange: (section) {
              setState(() => _activeSection = section);
            },
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                child: _buildActiveSection(isDark),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveSection(bool isDark) {
    switch (_activeSection) {
      case 'breathing':
        return BreathingSection(isDark: isDark);
      case 'meditation':
        return MeditationSection(isDark: isDark);
      case 'sounds':
        return SoundsSection(
          isDark: isDark,
          currentSound: _currentSound,
          setCurrentSound: (sound) => setState(() => _currentSound = sound),
          isPlaying: _isPlaying,
          setIsPlaying: (playing) => setState(() => _isPlaying = playing),
          volume: _volume,
          setVolume: (volume) => setState(() => _volume = volume),
          audioRef: _audioPlayer,
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
