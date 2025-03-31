import 'dart:async';

import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../models/sound.dart';
import 'sounds_section/sound_card.dart';
import 'sounds_section/sound_filters.dart';
import 'sounds_section/player_controls.dart';
import '../../../providers/sound_provider.dart';
import '../../../providers/audio_provider.dart';

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
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _initAudio();
    _scrollController.addListener(_onScroll);
    _checkAuthAndLoadSounds();
  }

  Future<void> _initAudio() async {
    try {
      final audioProvider = Provider.of<AudioProvider>(context, listen: false);
      await audioProvider.initializeAudio();
    } catch (e) {
      print('Error initializing audio: $e');
    }
  }

  Future<void> _checkAuthAndLoadSounds() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    if (token == null) {
      // Handle unauthenticated state
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please log in to access sounds'),
          duration: Duration(seconds: 3),
        ),
      );
      return;
    }

    // Use Future.microtask to avoid calling setState during build
    Future.microtask(() {
      final provider = Provider.of<SoundProvider>(context, listen: false);
      provider.searchSounds(refresh: true);
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      final provider = Provider.of<SoundProvider>(context, listen: false);
      if (!provider.isLoading && provider.hasMore) {
        provider.searchSounds();
      }
    }
  }

  Future<void> _playSound(Map<String, dynamic> soundData) async {
    if (!mounted) return;
    
    try {
      final audioProvider = Provider.of<AudioProvider>(context, listen: false);
      if (!audioProvider.isInitialized) {
        await audioProvider.initializeAudio();
      }

      final sound = Sound(
        id: soundData['id'].toString(),
        title: soundData['name'] ?? '',
        location: soundData['username'] ?? 'Unknown',
        category: soundData['category'] ?? 'unknown',
        audioURL: soundData['previews']['preview-hq-mp3'] ?? '',
        imageName: soundData['images']['waveform_m'] ?? '',
        duration: soundData['duration']?.toDouble(),
      );

      if (audioProvider.currentSound == sound.title) {
        if (audioProvider.isPlaying) {
          await audioProvider.player?.pause();
          audioProvider.setIsPlaying(false);
        } else {
          await audioProvider.player?.play();
          audioProvider.setIsPlaying(true);
        }
        return;
      }

      await audioProvider.playSound(
        sound.audioURL,
        sound.title,
        sound.location
      );
      
    } catch (e) {
      print('Playback error: $e');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to play sound')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<SoundProvider>(
      builder: (context, provider, child) {
        final sounds = provider.sounds;

        return SizedBox(
          height: MediaQuery.of(context).size.height - 100, // Adjust this value as needed
          child: Column(
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
                selectedCategory: _parseCategory(provider.category),
                onCategoryChanged: (category) => 
                    provider.setCategory(category.toString().split('.').last),
                onSearchChanged: provider.setSearchQuery,
              ),
              const SizedBox(height: 24),
              if (provider.isLoading && sounds.isEmpty)
                const Center(child: CircularProgressIndicator())
              else if (sounds.isEmpty)
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
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
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: sounds.length + (provider.hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == sounds.length) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: CircularProgressIndicator(),
                          ),
                        );
                      }

                      final soundData = sounds[index];
                      final sound = Sound(
                        id: soundData['id'].toString(),
                        title: soundData['name'] ?? '',
                        location: soundData['username'] ?? 'Unknown',
                        category: soundData['category'] ?? 'unknown',
                        audioURL: soundData['previews']['preview-hq-mp3'] ?? '',
                        imageName: soundData['images']['waveform_m'] ?? '',
                        duration: soundData['duration']?.toDouble(),
                      );
                      return SoundCard(
                        sound: sound,
                        isPlaying: widget.currentSound == sound.title && widget.isPlaying,
                        onPlay: () => _playSound(soundData),
                        onToggleFavorite: () {
                          // TODO: Implement favorite toggle
                        },
                      );
                    },
                  ),
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
          ),
        );
      },
    );
  }

  SoundCategory _parseCategory(String category) {
    switch (category.toLowerCase()) {
      case 'nature':
        return SoundCategory.nature;
      case 'ambient':
        return SoundCategory.ambient;
      case 'meditation':
        return SoundCategory.meditation;
      case 'binaural':
        return SoundCategory.binaural;
      default:
        return SoundCategory.all;
    }
  }

  @override 
  void dispose() {
    if (widget.isPlaying) {
      widget.audioRef.pause().then((_) {
        widget.setIsPlaying(false);
      });
    }
    widget.audioRef.stop().then((_) {
      widget.audioRef.dispose();
    });
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }
}
