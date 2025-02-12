class Exercise {
  final String id;
  final String title;
  final String description;
  final String videoUrl;
  final int duration; // in seconds
  final int calories;
  final List<String> targetMuscles;
  final String category;
  final String level;

  Exercise({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.duration,
    required this.calories,
    required this.targetMuscles,
    required this.category,
    required this.level,
  });
}

final List<Map<String, String>> muscleGroups = [
  {'id': 'chest', 'name': 'Chest'},
  {'id': 'shoulders', 'name': 'Shoulders'},
  {'id': 'biceps', 'name': 'Biceps'},
  {'id': 'triceps', 'name': 'Triceps'},
  {'id': 'back', 'name': 'Back'},
  {'id': 'abs', 'name': 'Abs'},
  {'id': 'quads', 'name': 'Quadriceps'},
  {'id': 'hamstrings', 'name': 'Hamstrings'},
  {'id': 'calves', 'name': 'Calves'},
  {'id': 'glutes', 'name': 'Glutes'},
];

String getYouTubeUrl(String videoId) {
  return 'https://www.youtube.com/watch?v=$videoId';
}

final workoutData = {
  'beginner': {
    'warmup': [
      Exercise(
        id: 'w1',
        title: 'Dynamic Stretching',
        description: 'Full body dynamic stretches to prepare for workout',
        duration: 300, // 5 mins
        videoUrl: getYouTubeUrl('uW3-Ue07H0M'),
        calories: 25,
        targetMuscles: ['Full Body'],
        category: 'warmup',
        level: 'beginner',
      ),
    ],
    'cardio': [
      Exercise(
        id: 'c1',
        title: 'Light Jogging',
        description: 'Easy-paced jogging to build endurance',
        duration: 600, // 10 mins
        videoUrl: getYouTubeUrl('3XbfW90grUk'),
        calories: 100,
        targetMuscles: ['Legs', 'Core'],
        category: 'cardio',
        level: 'beginner',
      ),
    ],
    'strength': [
      Exercise(
        id: 's1',
        title: 'Basic Strength Training',
        description: 'Beginner-friendly strength training routine',
        duration: 1020, // 17 mins
        videoUrl: getYouTubeUrl('WIHy-ZnSndA'),
        calories: 150,
        targetMuscles: ['Full Body'],
        category: 'strength',
        level: 'beginner',
      ),
    ],
    'hiit': [
      Exercise(
        id: 'h1',
        title: 'Basic HIIT Circuit',
        description: 'High-intensity interval training for beginners',
        duration: 1200, // 20 mins
        videoUrl: getYouTubeUrl('M0uO8X3_tEA'),
        calories: 200,
        targetMuscles: ['Full Body'],
        category: 'hiit',
        level: 'beginner',
      ),
    ],
    'cooldown': [
      Exercise(
        id: 'cd1',
        title: 'Cool Down Stretches',
        description: 'Essential post-workout stretching routine',
        duration: 300, // 5 mins
        videoUrl: getYouTubeUrl('3w1szPuqY8I'),
        calories: 20,
        targetMuscles: ['Full Body'],
        category: 'cooldown',
        level: 'beginner',
      ),
    ],
  },
  'intermediate': {
    'warmup': [
      Exercise(
        id: 'w1',
        title: 'Intermediate Dynamic Stretching',
        description: 'Full body dynamic stretches to prepare for workout',
        duration: 1020, // 17 mins
        videoUrl: getYouTubeUrl('h1AxL1Qp9eA'),
        calories: 50,
        targetMuscles: ['Full Body'],
        category: 'warmup',
        level: 'intermediate',
      ),
    ],
    'cardio': [
      Exercise(
        id: 'c1',
        title: 'Intermediate Light Jogging',
        description: 'Medium-paced jogging to build endurance',
        duration: 1800, // 30 mins
        videoUrl: getYouTubeUrl('c1mBu4tK90k'),
        calories: 120,
        targetMuscles: ['Legs', 'Core'],
        category: 'cardio',
        level: 'intermediate',
      ),
    ],
    'strength': [
      Exercise(
        id: 's1',
        title: 'Intermediate Strength Training',
        description: 'Intermediate strength training routine',
        duration: 1020, // 17 mins
        videoUrl: getYouTubeUrl('uM9iFSHUIgU'),
        calories: 150,
        targetMuscles: ['Full Body'],
        category: 'strength',
        level: 'intermediate',
      ),
    ],
    'hiit': [
      Exercise(
        id: 'h1',
        title: 'Intermediate HIIT Circuit',
        description: 'High-intensity interval training for intermediates',
        duration: 1800, // 30 mins
        videoUrl: getYouTubeUrl('uearF2Iorng'),
        calories: 250,
        targetMuscles: ['Full Body'],
        category: 'hiit',
        level: 'intermediate',
      ),
    ],
    'cooldown': [
      Exercise(
        id: 'cd1',
        title: 'Intermediate Cool Down Stretches',
        description: 'Essential post-workout stretching routine',
        duration: 1800, // 30 mins
        videoUrl: getYouTubeUrl('3w1szPuqY8I'),
        calories: 20,
        targetMuscles: ['Full Body'],
        category: 'cooldown',
        level: 'intermediate',
      ),
    ],
  },
  'advanced': {
    'warmup': [
      Exercise(
        id: 'w1',
        title: 'Advanced Dynamic Stretching',
        description: 'Intensive full body dynamic stretches',
        duration: 900, // 15 mins
        videoUrl: getYouTubeUrl('HDfvWrGUkC8'),
        calories: 75,
        targetMuscles: ['Full Body'],
        category: 'warmup',
        level: 'advanced',
      ),
    ],
    'cardio': [
      Exercise(
        id: 'c1',
        title: 'Advanced Cardio Training',
        description: 'High-intensity cardio workout',
        duration: 2400, // 40 mins
        videoUrl: getYouTubeUrl('ml6cT4AZdqI'),
        calories: 400,
        targetMuscles: ['Full Body', 'Core'],
        category: 'cardio',
        level: 'advanced',
      ),
    ],
    'strength': [
      Exercise(
        id: 's1',
        title: 'Advanced Strength Training',
        description: 'Challenging strength training routine',
        duration: 2700, // 45 mins
        videoUrl: getYouTubeUrl('oWu9TFJjHaM'),
        calories: 350,
        targetMuscles: ['Full Body'],
        category: 'strength',
        level: 'advanced',
      ),
    ],
    'hiit': [
      Exercise(
        id: 'h1',
        title: 'Advanced HIIT Circuit',
        description: 'Intense interval training for advanced fitness levels',
        duration: 1800, // 30 mins
        videoUrl: getYouTubeUrl('Mvo2snJGhtM'),
        calories: 450,
        targetMuscles: ['Full Body'],
        category: 'hiit',
        level: 'advanced',
      ),
    ],
    'cooldown': [
      Exercise(
        id: 'cd1',
        title: 'Advanced Cool Down Routine',
        description: 'Comprehensive post-workout recovery routine',
        duration: 1200, // 20 mins
        videoUrl: getYouTubeUrl('qULTwquOuT4'),
        calories: 50,
        targetMuscles: ['Full Body'],
        category: 'cooldown',
        level: 'advanced',
      ),
    ],
  },
};
