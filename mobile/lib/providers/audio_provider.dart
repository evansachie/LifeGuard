import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:audio_service/audio_service.dart';

class AudioProvider extends ChangeNotifier {
  AudioPlayer? _player;
  String? _currentSound;
  bool _isPlaying = false;
  double _volume = 0.5;
  bool _isInitialized = false;

  AudioPlayer? get player => _player;
  String? get currentSound => _currentSound;
  bool get isPlaying => _isPlaying;
  double get volume => _volume;
  bool get isInitialized => _isInitialized;

  Future<void> initializeAudio() async {
    if (_isInitialized) return;

    try {
      _player = AudioPlayer();
      await _player?.setVolume(_volume);

      // Wait for audio service to be ready
      await Future.delayed(const Duration(milliseconds: 100));
      
      // Initialize player without audio handler
      _player?.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          _isPlaying = false;
          notifyListeners();
        }
      }, onError: (error) {
        print('Player state error: $error');
        _isPlaying = false;
        notifyListeners();
      });

      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      print('Audio initialization error: $e');
      _isInitialized = false;
      notifyListeners();
    }
  }

  Future<void> playSound(String url, String title, String artist) async {
    if (!_isInitialized || _player == null) {
      await initializeAudio();
    }

    try {
      // Create audio source with minimal metadata
      final audioSource = AudioSource.uri(
        Uri.parse(url),
        tag: MediaItem(
          id: url,
          title: title,
          artist: artist,
        ),
      );

      // Set source and play
      await _player?.setAudioSource(audioSource);
      await _player?.play();
      
      _isPlaying = true;
      _currentSound = title;
      notifyListeners();
    } catch (e) {
      print('Error playing sound: $e');
      _isPlaying = false;
      notifyListeners();
      rethrow;
    }
  }

  void setCurrentSound(String? sound) {
    _currentSound = sound;
    notifyListeners();
  }

  void setIsPlaying(bool playing) {
    _isPlaying = playing;
    notifyListeners();
  }

  void setVolume(double vol) {
    _volume = vol;
    _player?.setVolume(vol);
    notifyListeners();
  }

  @override
  void dispose() {
    _player?.dispose();
    super.dispose();
  }
}
