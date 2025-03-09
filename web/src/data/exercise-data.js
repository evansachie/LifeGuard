export const muscleGroups = [
    { id: 'chest', name: 'Chest' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'biceps', name: 'Biceps' },
    { id: 'triceps', name: 'Triceps' },
    { id: 'back', name: 'Back' },
    { id: 'abs', name: 'Abs' },
    { id: 'quads', name: 'Quadriceps' },
    { id: 'hamstrings', name: 'Hamstrings' },
    { id: 'calves', name: 'Calves' },
    { id: 'glutes', name: 'Glutes' }
];

export const fitnessLevels = [
  { id: 'beginner', label: 'Beginner', color: '#4CAF50' },
  { id: 'intermediate', label: 'Intermediate', color: '#FF9800' },
  { id: 'advanced', label: 'Advanced', color: '#f44336' }
];

export const workoutData = {
    beginner: {
      warmup: [
        {
          id: 'w1',
          title: 'Dynamic Stretching',
          description: 'Full body dynamic stretches to prepare for workout',
          duration: '5 mins',
          videoUrl: 'https://www.youtube.com/embed/uW3-Ue07H0M',
          calories: 25,
          targetMuscles: ['Full Body']
        }
      ],
      cardio: [
        {
          id: 'c1',
          title: 'Light Jogging',
          description: 'Easy-paced jogging to build endurance',
          duration: '10 mins',
          videoUrl: 'https://www.youtube.com/embed/3XbfW90grUk',
          calories: 100,
          targetMuscles: ['Legs', 'Core']
        }
      ],
      strength: [
        {
          id: 's1',
          title: 'Basic Strength Training',
          description: 'Beginner-friendly strength training routine',
          duration: '17 mins',
          videoUrl: 'https://www.youtube.com/embed/WIHy-ZnSndA',
          calories: 150,
          targetMuscles: ['Full Body']
        }
      ],
      hiit: [
        {
          id: 'h1',
          title: 'Basic HIIT Circuit',
          description: 'High-intensity interval training for beginners',
          duration: '20 mins',
          videoUrl: 'https://www.youtube.com/embed/M0uO8X3_tEA',
          calories: 200,
          targetMuscles: ['Full Body']
        }
      ],
      cooldown: [
        {
          id: 'cd1',
          title: 'Cool Down Stretches',
          description: 'Essential post-workout stretching routine',
          duration: '5 mins',
          videoUrl: 'https://www.youtube.com/embed/3w1szPuqY8I',
          calories: 20,
          targetMuscles: ['Full Body']
        }
      ]
    },
    intermediate: {
      warmup: [
        {
          id: 'w1',
          title: 'Intermediate Dynamic Stretching',
          description: 'Full body dynamic stretches to prepare for workout',
          duration: '17 mins',
          videoUrl: 'https://www.youtube.com/embed/h1AxL1Qp9eA',
          calories: 50,
          targetMuscles: ['Full Body']
        }
      ],
      cardio: [
        {
          id: 'c1',
          title: 'Intermediate Light Jogging',
          description: 'medium-paced jogging to build endurance',
          duration: '30 mins',
          videoUrl: 'https://www.youtube.com/embed/c1mBu4tK90k',
          calories: 120,
          targetMuscles: ['Legs', 'Core']
        }
      ],
      strength: [
        {
          id: 's1',
          title: 'Intermediate Strength Training',
          description: 'Beginner-friendly strength training routine',
          duration: '17 mins',
          videoUrl: 'https://www.youtube.com/embed/uM9iFSHUIgU',
          calories: 150,
          targetMuscles: ['Full Body']
        }
      ],
      hiit: [
        {
          id: 'h1',
          title: 'Intermediate HIIT Circuit',
          description: 'High-intensity interval training for beginners',
          duration: '30 mins',
          videoUrl: 'https://www.youtube.com/embed/uearF2Iorng',
          calories: 250,
          targetMuscles: ['Full Body']
        }
      ],
      cooldown: [
        {
          id: 'cd1',
          title: 'Intermediate Cool Down Stretches',
          description: 'Essential post-workout stretching routine',
          duration: '30 mins',
          videoUrl: 'https://www.youtube.com/embed/3w1szPuqY8I',
          calories: 20,
          targetMuscles: ['Full Body']
        }
      ]
    },
    advanced: {
      warmup: [
        {
          id: 'w1',
          title: 'Intermediate Dynamic Stretching',
          description: 'Full body dynamic stretches to prepare for workout',
          duration: '5 mins',
          videoUrl: 'https://www.youtube.com/embed/uW3-Ue07H0M',
          calories: 25,
          targetMuscles: ['Full Body']
        }
      ],
      cardio: [
        {
          id: 'c1',
          title: 'Light Jogging',
          description: 'Easy-paced jogging to build endurance',
          duration: '10 mins',
          videoUrl: 'https://www.youtube.com/embed/3XbfW90grUk',
          calories: 100,
          targetMuscles: ['Legs', 'Core']
        }
      ],
      strength: [
        {
          id: 's1',
          title: 'Basic Strength Training',
          description: 'Beginner-friendly strength training routine',
          duration: '17 mins',
          videoUrl: 'https://www.youtube.com/embed/WIHy-ZnSndA',
          calories: 150,
          targetMuscles: ['Full Body']
        }
      ],
      hiit: [
        {
          id: 'h1',
          title: 'Basic HIIT Circuit',
          description: 'High-intensity interval training for beginners',
          duration: '20 mins',
          videoUrl: 'https://www.youtube.com/embed/M0uO8X3_tEA',
          calories: 200,
          targetMuscles: ['Full Body']
        }
      ],
      cooldown: [
        {
          id: 'cd1',
          title: 'Cool Down Stretches',
          description: 'Essential post-workout stretching routine',
          duration: '5 mins',
          videoUrl: 'https://www.youtube.com/embed/3w1szPuqY8I',
          calories: 20,
          targetMuscles: ['Full Body']
        }
      ]
    }
  };