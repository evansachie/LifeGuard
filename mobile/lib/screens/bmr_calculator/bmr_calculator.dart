import 'package:flutter/material.dart';

class BMRCalculator extends StatefulWidget {
  const BMRCalculator({super.key});

  @override
  State<BMRCalculator> createState() => _BMRCalculatorState();
}

class _BMRCalculatorState extends State<BMRCalculator> {
  final _formKey = GlobalKey<FormState>();
  String _gender = 'male';
  final _ageController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  double _bmr = 0;

  void _calculateBMR() {
    if (_formKey.currentState!.validate()) {
      final age = int.parse(_ageController.text);
      final weight =
          double.parse(_weightController.text) * 0.453592; // lbs to kg
      final height = double.parse(_heightController.text) * 2.54; // in to cm

      setState(() {
        if (_gender == 'male') {
          _bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          _bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'BMR Calculator',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF4285F4),
              ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Gender Selection
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Gender',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SegmentedButton<String>(
                        segments: const [
                          ButtonSegment(
                            value: 'male',
                            label: Text('Male'),
                            icon: Icon(Icons.male),
                          ),
                          ButtonSegment(
                            value: 'female',
                            label: Text('Female'),
                            icon: Icon(Icons.female),
                          ),
                        ],
                        selected: {_gender},
                        onSelectionChanged: (Set<String> newSelection) {
                          setState(() => _gender = newSelection.first);
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Input Fields
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _ageController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Age',
                          suffixText: 'years',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your age';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _weightController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Weight',
                          suffixText: 'lbs',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your weight';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _heightController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Height',
                          suffixText: 'inches',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your height';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Calculate Button
              FilledButton(
                onPressed: _calculateBMR,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                ),
                child: const Text('Calculate BMR'),
              ),
              const SizedBox(height: 24),

              // Results
              if (_bmr > 0)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Text(
                          'Your Basal Metabolic Rate (BMR)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${_bmr.round()} calories/day',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF4285F4),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
