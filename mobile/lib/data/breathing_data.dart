import 'package:flutter/material.dart';

class BreathingPattern {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color color;
  final Map<String, int> pattern;

  BreathingPattern({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    required this.pattern,
  });
}

final List<BreathingPattern> breathingPatterns = [
  BreathingPattern(
    id: 'relaxation',
    name: '4-7-8 Relaxation',
    description: 'Calming breath for stress and anxiety relief',
    icon: Icons.self_improvement,
    color: const Color(0xFF4CAF50),
    pattern: {'inhale': 4, 'hold': 7, 'exhale': 8},
  ),
  BreathingPattern(
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal breathing for focus and concentration',
    icon: Icons.square_outlined,
    color: const Color(0xFF2196F3),
    pattern: {'inhale': 4, 'hold': 4, 'exhale': 4, 'holdAfterExhale': 4},
  ),
  BreathingPattern(
    id: 'deep',
    name: 'Deep Belly',
    description: 'Deep breathing for relaxation and stress relief',
    icon: Icons.waves,
    color: const Color(0xFF9C27B0),
    pattern: {'inhale': 5, 'hold': 2, 'exhale': 5},
  ),
];
