import 'package:flutter/material.dart';

class PollutionTracker extends StatelessWidget {
  const PollutionTracker({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Pollution Tracker',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF4285F4),
                    ),
              ),
              const SizedBox(height: 16),
              const Text('Pollution tracking features coming soon...'),
            ],
          ),
        ),
      ),
    );
  }
}
