import 'package:flutter/material.dart';
import 'dart:async';

class BreathingSection extends StatefulWidget {
  final bool isDark;
  const BreathingSection({super.key, required this.isDark});

  @override
  State<BreathingSection> createState() => _BreathingSectionState();
}

class _BreathingSectionState extends State<BreathingSection> with SingleTickerProviderStateMixin {
  bool _isBreathing = false;
  String _selectedPattern = '';
  String _phase = 'inhale';
  Timer? _timer;
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  final List<Map<String, dynamic>> breathingPatterns = [
    {
      'name': 'Box Breathing',
      'description': 'Equal duration for inhale, hold, exhale, and hold',
      'color': Colors.blue,
      'icon': Icons.crop_square_outlined,
      'pattern': {
        'inhale': 4,
        'hold1': 4,
        'exhale': 4,
        'hold2': 4,
      },
    },
    {
      'name': 'Deep Breathing',
      'description': 'Deep inhale followed by longer exhale',
      'color': Colors.green,
      'icon': Icons.waves,
      'pattern': {
        'inhale': 4,
        'hold1': 0,
        'exhale': 6,
        'hold2': 0,
      },
    },
    {
      'name': '4-7-8 Breathing',
      'description': 'Inhale for 4, hold for 7, exhale for 8',
      'color': Colors.purple,
      'icon': Icons.air,
      'pattern': {
        'inhale': 4,
        'hold1': 7,
        'exhale': 8,
        'hold2': 0,
      },
    },
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 0.3,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void startBreathing(Map<String, dynamic> pattern) {
    if (_isBreathing) return;
    setState(() {
      _isBreathing = true;
      _selectedPattern = pattern['name'];
      _phase = 'inhale';
    });
    _startPhase(pattern['pattern']);
  }

  void _startPhase(Map<String, int> pattern) {
    final duration = pattern[_phase] ?? 4;
    _controller.duration = Duration(seconds: duration);
    
    if (_phase == 'inhale' || _phase == 'exhale') {
      if (_phase == 'inhale') {
        _controller.forward(from: 0);
      } else {
        _controller.reverse(from: 1);
      }
    }

    _timer?.cancel();
    _timer = Timer(Duration(seconds: duration), () {
      if (!mounted) return;
      setState(() {
        switch (_phase) {
          case 'inhale':
            _phase = pattern['hold1']! > 0 ? 'hold1' : 'exhale';
            break;
          case 'hold1':
            _phase = 'exhale';
            break;
          case 'exhale':
            _phase = pattern['hold2']! > 0 ? 'hold2' : 'inhale';
            break;
          case 'hold2':
            _phase = 'inhale';
            break;
        }
      });
      _startPhase(pattern);
    });
  }

  void stopBreathing() {
    _timer?.cancel();
    _controller.reset();
    setState(() {
      _isBreathing = false;
      _selectedPattern = '';
      _phase = 'inhale';
    });
  }

  @override
  Widget build(BuildContext context) {
    final selectedPatternData = _isBreathing 
        ? breathingPatterns.firstWhere((p) => p['name'] == _selectedPattern)
        : null;

    return Column(
      children: [
        if (_isBreathing) ...[
          _buildBreathingAnimation(selectedPatternData!),
        ] else ...[
          Text(
            'Choose a Breathing Pattern',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: widget.isDark ? Colors.white : Colors.black,
            ),
          ),
          const SizedBox(height: 24),
          _buildPatternGrid(),
        ],
      ],
    );
  }

  Widget _buildBreathingAnimation(Map<String, dynamic> pattern) {
    final size = MediaQuery.of(context).size;
    final maxRadius = size.width * 0.4;
    final color = pattern['color'] as Color;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          pattern['name'],
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: widget.isDark ? Colors.white : Colors.black,
          ),
        ),
        const SizedBox(height: 40),
        Text(
          _phase.toUpperCase(),
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: color,
          ),
        ),
        const SizedBox(height: 40),
        Center(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Container(
                width: maxRadius * 2 * _scaleAnimation.value,
                height: maxRadius * 2 * _scaleAnimation.value,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: color.withOpacity(_opacityAnimation.value * 0.3),
                  border: Border.all(
                    color: color.withOpacity(_opacityAnimation.value),
                    width: 2,
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 40),
        ElevatedButton.icon(
          onPressed: stopBreathing,
          icon: const Icon(Icons.stop),
          label: const Text('Stop'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPatternGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.85,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: breathingPatterns.length,
      itemBuilder: (context, index) {
        final pattern = breathingPatterns[index];
        return _buildPatternCard(pattern);
      },
    );
  }

  Widget _buildPatternCard(Map<String, dynamic> pattern) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () => startBreathing(pattern),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                pattern['icon'] as IconData,
                size: 48,
                color: pattern['color'] as Color,
              ),
              const SizedBox(height: 16),
              Text(
                pattern['name'],
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                pattern['description'],
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: widget.isDark ? Colors.white70 : Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
