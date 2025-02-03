import 'package:flutter/material.dart';

class HealthReport extends StatelessWidget {
  const HealthReport({super.key});

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
                'Health Report',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF4285F4),
                    ),
              ),
              const SizedBox(height: 16),
              const Text('Health reporting features coming soon...'),
            ],
          ),
        ),
      ),
    );
  }
}
