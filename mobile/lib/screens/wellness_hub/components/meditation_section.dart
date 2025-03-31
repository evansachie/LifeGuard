import 'package:flutter/material.dart';
import 'dart:async';

class MeditationSection extends StatefulWidget {
  final bool isDark;

  const MeditationSection({super.key, required this.isDark});

  @override
  State<MeditationSection> createState() => _MeditationSectionState();
}

class _MeditationSectionState extends State<MeditationSection> {
  bool _isActive = false;
  int _selectedDuration = 300;
  late Timer _timer;
  int _remainingTime = 0;

  final List<Map<String, dynamic>> _presets = [
    {'label': '5 min', 'duration': 300},
    {'label': '10 min', 'duration': 600},
    {'label': '15 min', 'duration': 900},
    {'label': '20 min', 'duration': 1200},
  ];

  void _startTimer() {
    setState(() {
      _isActive = true;
      _remainingTime = _selectedDuration;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingTime > 0) {
        setState(() => _remainingTime--);
      } else {
        _stopTimer();
      }
    });
  }

  void _stopTimer() {
    _timer.cancel();
    setState(() {
      _isActive = false;
      _remainingTime = 0;
    });
  }

  void _pauseTimer() {
    _timer.cancel();
    setState(() => _isActive = false);
  }

  String _formatTime(int seconds) {
    final minutes = (seconds / 60).floor();
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  @override
  void dispose() {
    if (_isActive) {
      _timer.cancel();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Meditation Timer',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: widget.isDark ? Colors.white : Colors.black,
          ),
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: widget.isDark ? Colors.black12 : Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Text(
                _formatTime(_isActive ? _remainingTime : _selectedDuration),
                style: const TextStyle(
                  fontSize: 64,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF4285F4),
                ),
              ),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton.filled(
                    onPressed: _isActive ? _pauseTimer : _startTimer,
                    icon: Icon(_isActive ? Icons.pause : Icons.play_arrow),
                    iconSize: 32,
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFF4285F4),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                  if (_isActive || _remainingTime > 0) ...[
                    const SizedBox(width: 16),
                    IconButton.filled(
                      onPressed: _stopTimer,
                      icon: const Icon(Icons.stop),
                      iconSize: 32,
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        if (!_isActive)
          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: _presets.map((preset) {
              final isSelected = preset['duration'] == _selectedDuration;
              return ChoiceChip(
                label: Text(preset['label']),
                selected: isSelected,
                onSelected: (selected) {
                  if (selected) {
                    setState(() => _selectedDuration = preset['duration']);
                  }
                },
                backgroundColor: widget.isDark ? Colors.black12 : Colors.grey[100],
                selectedColor: const Color(0xFF4285F4),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : null,
                ),
              );
            }).toList(),
          ),
      ],
    );
  }
}
