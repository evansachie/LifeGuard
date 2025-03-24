import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import '../../../models/sound.dart';
import 'sounds_section/sound_card.dart';
import 'sounds_section/sound_filters.dart';
import 'sounds_section/player_controls.dart';

class SoundsSection extends StatefulWidget {
  final bool isDark;
  final String? currentSound;
  final Function(String?) setCurrentSound;
  final bool isPlaying;
  final Function(bool) setIsPlaying;
  final double volume;
  final Function(double) setVolume;
  final AudioPlayer audioRef;

  const SoundsSection({
    super.key,
    required this.isDark,
    required this.currentSound,
    required this.setCurrentSound,
    required this.isPlaying,
    required this.setIsPlaying,
    required this.volume,
    required this.setVolume,
    required this.audioRef,
  });

  @override
  State<SoundsSection> createState() => _SoundsSectionState();
}

class _SoundsSectionState extends State<SoundsSection> {
  SoundCategory _selectedCategory = SoundCategory.all;
  String _searchQuery = '';
  List<Sound> _sounds = [
    Sound(
      id: '1',
      title: 'Forest Rain',
      location: 'Amazon Rainforest',
      category: 'nature',
      audioURL: 'assets/sounds/forest-rain.mp3',
      imageName: 'forest-rain.jpg',
    ),
    Sound(
      id: '2',
      title: 'Ocean Waves',
      location: 'Pacific Coast',
      category: 'nature',
      audioURL: 'assets/sounds/ocean-waves.mp3',
      imageName: 'ocean-waves.jpg',
    ),
    // Add more sounds as needed
  ];

  List<Sound> get _filteredSounds {
    return _sounds.where((sound) {
      if (_selectedCategory != SoundCategory.all && 
          sound.category != _selectedCategory.toString().split('.').last) {
        return false;
      }
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        return sound.title.toLowerCase().contains(query) ||
               sound.location.toLowerCase().contains(query);
      }
      return true;
    }).toList();
  }

  Future<void> _playSound(Sound sound) async {
    try {
      if (widget.currentSound == sound.title && widget.isPlaying) {
        widget.audioRef.pause();
        widget.setIsPlaying(false);
      } else if (widget.currentSound == sound.title) {
        await widget.audioRef.play();
        widget.setIsPlaying(true);
      } else {
        widget.setCurrentSound(sound.title);
        await widget.audioRef.setAsset(sound.audioURL);
        await widget.audioRef.setVolume(widget.volume);
        await widget.audioRef.play();
        widget.setIsPlaying(true);
      }
    } catch (e) {
      print('Error playing sound: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Relaxation Sounds',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: widget.isDark ? Colors.white : Colors.black,
          ),
        ),
        const SizedBox(height: 24),
        SoundFilters(
          selectedCategory: _selectedCategory,
          onCategoryChanged: (category) => setState(() => _selectedCategory = category),
          onSearchChanged: (query) => setState(() => _searchQuery = query),
        ),
        const SizedBox(height: 24),
        if (_filteredSounds.isEmpty)
          Center(
            child: Column(
              children: [
                Icon(
                  Icons.music_off,
                  size: 64,
                  color: widget.isDark ? Colors.white38 : Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No sounds found',
                  style: TextStyle(
                    color: widget.isDark ? Colors.white38 : Colors.grey[600],
                  ),
                ),
              ],
            ),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: _filteredSounds.length,
            itemBuilder: (context, index) {
              final sound = _filteredSounds[index];
              return SoundCard(
                sound: sound,
                isPlaying: widget.currentSound == sound.title && widget.isPlaying,
                onPlay: () => _playSound(sound),
                onToggleFavorite: () {
                  // TODO: Implement favorite toggle
                },
              );
            },
          ),

        if (widget.currentSound != null)
          PlayerControls(
            player: widget.audioRef,
            currentSoundTitle: widget.currentSound!,
            volume: widget.volume,
            onVolumeChanged: widget.setVolume,
            onClose: () {
              widget.audioRef.stop();
              widget.setCurrentSound(null);
              widget.setIsPlaying(false);
            },
          ),
      ],
    );
  }
}
