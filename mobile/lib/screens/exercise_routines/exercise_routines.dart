import 'dart:async';

import 'package:flutter/material.dart';
import 'package:lifeguard/data/exercise_data.dart';

class ExerciseRoutines extends StatefulWidget {
  const ExerciseRoutines({super.key});

  @override
  State<ExerciseRoutines> createState() => _ExerciseRoutinesState();
}

class _ExerciseRoutinesState extends State<ExerciseRoutines> {
  String selectedLevel = 'beginner';
  String selectedCategory = 'warmup';
  bool isLoading = true;
  int workoutTimer = 0;
  bool isTimerRunning = false;
  Exercise? activeExercise;

  final fitnessLevels = [
    {'id': 'beginner', 'label': 'Beginner', 'color': Colors.green},
    {'id': 'intermediate', 'label': 'Intermediate', 'color': Colors.orange},
    {'id': 'advanced', 'label': 'Advanced', 'color': Colors.red},
  ];

  final workoutCategories = [
    {'id': 'warmup', 'icon': Icons.favorite, 'label': 'Warm-Up'},
    {'id': 'cardio', 'icon': Icons.local_fire_department, 'label': 'Cardio'},
    {'id': 'strength', 'icon': Icons.fitness_center, 'label': 'Strength'},
    {'id': 'hiit', 'icon': Icons.timer, 'label': 'HIIT'},
    {'id': 'cooldown', 'icon': Icons.ac_unit, 'label': 'Cool Down'},
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _loadData() async {
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => isLoading = false);
    }
  }

  String formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  void startWorkout(Exercise exercise) {
    setState(() {
      activeExercise = exercise;
      workoutTimer = exercise.duration;
      isTimerRunning = true;
    });

    startTimer();
  }

  Timer? _timer;

  void startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        if (workoutTimer > 0 && isTimerRunning) {
          workoutTimer--;
        } else if (workoutTimer <= 0) {
          timer.cancel();
          isTimerRunning = false;
          activeExercise = null;
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final exercises = workoutData[selectedLevel]?[selectedCategory] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Exercise Routines',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF4285F4),
              ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Progress Overview
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 24),
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount:
                            MediaQuery.of(context).size.width > 600 ? 3 : 2,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 1.5,
                        children: [
                          _buildStatsCard(
                            icon: Icons.local_fire_department,
                            title: 'Calories Burned',
                            value: '350 kcal',
                            color: Colors.orange,
                            isDark: isDark,
                          ),
                          _buildStatsCard(
                            icon: Icons.timer,
                            title: 'Workout Time',
                            value: '45 mins',
                            color: Colors.brown,
                            isDark: isDark,
                          ),
                          _buildStatsCard(
                            icon: Icons.fitness_center,
                            title: 'Current Goal',
                            value: 'Build Strength',
                            color: Colors.pinkAccent,
                            isDark: isDark,
                          ),
                          _buildStatsCard(
                            icon: Icons.trending_up,
                            title: 'Progress',
                            value: '75%',
                            color: Colors.green,
                            isDark: isDark,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Fitness Level Selection
              SliverToBoxAdapter(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: fitnessLevels
                        .map((level) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(level['label'] as String),
                                selected: selectedLevel == level['id'],
                                onSelected: (selected) {
                                  setState(() =>
                                      selectedLevel = level['id'] as String);
                                },
                                selectedColor: level['color'] as Color,
                              ),
                            ))
                        .toList(),
                  ),
                ),
              ),

              // Workout Categories
              SliverToBoxAdapter(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: workoutCategories
                        .map((category) => Padding(
                              padding: const EdgeInsets.only(right: 16),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  InkWell(
                                    onTap: () {
                                      setState(() => selectedCategory =
                                          category['id'] as String);
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color:
                                            selectedCategory == category['id']
                                                ? Theme.of(context).primaryColor
                                                : isDark
                                                    ? Colors.grey[800]
                                                    : Colors.grey[200],
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Icon(
                                        category['icon'] as IconData,
                                        color:
                                            selectedCategory == category['id']
                                                ? Colors.white
                                                : isDark
                                                    ? Colors.white
                                                    : Colors.black,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    category['label'] as String,
                                    style: TextStyle(
                                      color: isDark
                                          ? Colors.white70
                                          : Colors.black87,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ))
                        .toList(),
                  ),
                ),
              ),

              // Exercise List
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => _buildExerciseCard(
                      exercises[index],
                      isDark,
                    ),
                    childCount: exercises.length,
                  ),
                ),
              ),
            ],
          ),
          _buildWorkoutOverlay(),
        ],
      ),
    );
  }

  Widget _buildStatsCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF007AFF), // #007AFF
            Color(0xFF00C6FF), // #00C6FF
          ],
        ),
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white70 : Colors.black54,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildExerciseCard(Exercise exercise, bool isDark) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exercise.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  exercise.description,
                  style: TextStyle(
                    color: isDark ? Colors.white70 : Colors.black54,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.local_fire_department,
                            color: Colors.orange, size: 20),
                        const SizedBox(width: 4),
                        Text('${exercise.calories} kcal'),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Row(
                      children: [
                        const Icon(Icons.timer, size: 20),
                        const SizedBox(width: 4),
                        Text('${exercise.duration ~/ 60} min'),
                      ],
                    ),
                    const Spacer(),
                    FilledButton.icon(
                      onPressed: () => startWorkout(exercise),
                      icon: const Icon(Icons.play_arrow),
                      label: const Text('Start Workout'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkoutOverlay() {
    if (activeExercise == null) return const SizedBox.shrink();

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activeExercise!.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Time Remaining: ${formatTime(workoutTimer)}',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const Spacer(),
            IconButton(
              icon: Icon(isTimerRunning ? Icons.pause : Icons.play_arrow),
              onPressed: () {
                setState(() {
                  isTimerRunning = !isTimerRunning;
                  if (isTimerRunning) {
                    startTimer();
                  } else {
                    _timer?.cancel();
                  }
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.stop),
              onPressed: () {
                setState(() {
                  isTimerRunning = false;
                  activeExercise = null;
                  _timer?.cancel();
                });
              },
            ),
          ],
        ),
      ),
    );
  }
}
