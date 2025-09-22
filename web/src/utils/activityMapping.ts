/**
 * Activity mapping utilities for Arduino Nicla Sense ME activity recognition
 * Maps the raw activity strings from Arduino to user-friendly activity types
 */

export type ActivityType = 'still' | 'walking' | 'running' | 'cycling' | 'stationary' | 'unknown';

export interface ActivityInfo {
  type: ActivityType;
  displayName: string;
  emoji: string;
  description: string;
}

/**
 * Map Arduino activity strings to activity types
 * Based on SensorActivity.getActivity() output from Arduino_BHY2 library
 * Handles string descriptions from getActivity() method
 */
export const mapArduinoActivity = (activityString: string): ActivityInfo => {
  const normalizedActivity = activityString.toLowerCase().trim();

  // Handle string activity descriptions from getActivity()
  // Check for "started" activities first (more current/active)
  if (normalizedActivity.includes('walking') && normalizedActivity.includes('started')) {
    return {
      type: 'walking',
      displayName: 'Walking',
      emoji: '🚶‍♀️',
      description: 'Currently walking',
    };
  }

  if (normalizedActivity.includes('running') && normalizedActivity.includes('started')) {
    return {
      type: 'running',
      displayName: 'Running',
      emoji: '🏃‍♀️',
      description: 'Currently running',
    };
  }

  if (
    (normalizedActivity.includes('bicycle') || normalizedActivity.includes('cycling')) &&
    normalizedActivity.includes('started')
  ) {
    return {
      type: 'cycling',
      displayName: 'Cycling',
      emoji: '🚴‍♀️',
      description: 'Currently cycling',
    };
  }

  if (normalizedActivity.includes('still') && normalizedActivity.includes('started')) {
    return {
      type: 'still',
      displayName: 'Still',
      emoji: '🧘‍♀️',
      description: 'No movement - staying still',
    };
  }

  // Check for "ended" activities (less current but still relevant)
  if (normalizedActivity.includes('walking') && normalizedActivity.includes('ended')) {
    return {
      type: 'walking',
      displayName: 'Walking (Ended)',
      emoji: '🚶‍♂️',
      description: 'Walking activity has ended',
    };
  }

  if (normalizedActivity.includes('running') && normalizedActivity.includes('ended')) {
    return {
      type: 'running',
      displayName: 'Running (Ended)',
      emoji: '🏃‍♂️',
      description: 'Running activity has ended',
    };
  }

  if (
    (normalizedActivity.includes('bicycle') || normalizedActivity.includes('cycling')) &&
    normalizedActivity.includes('ended')
  ) {
    return {
      type: 'cycling',
      displayName: 'Cycling (Ended)',
      emoji: '🚴‍♂️',
      description: 'Cycling activity has ended',
    };
  }

  if (normalizedActivity.includes('still') && normalizedActivity.includes('ended')) {
    return {
      type: 'still',
      displayName: 'Still (Ended)',
      emoji: '🧘',
      description: 'No movement - activity ended',
    };
  }

  // Fallback for general activity detection (without started/ended)
  if (normalizedActivity.includes('walking')) {
    return {
      type: 'walking',
      displayName: 'Walking',
      emoji: '🚶‍♀️',
      description: 'Currently walking',
    };
  }

  if (normalizedActivity.includes('running')) {
    return {
      type: 'running',
      displayName: 'Running',
      emoji: '🏃‍♀️',
      description: 'Currently running',
    };
  }

  if (normalizedActivity.includes('bicycle') || normalizedActivity.includes('cycling')) {
    return {
      type: 'cycling',
      displayName: 'Cycling',
      emoji: '🚴‍♀️',
      description: 'Currently cycling',
    };
  }

  if (normalizedActivity.includes('still')) {
    return {
      type: 'still',
      displayName: 'Still',
      emoji: '🧘‍♀️',
      description: 'No movement - staying still',
    };
  }

  // Handle vehicle activities
  if (normalizedActivity.includes('vehicle')) {
    return {
      type: 'unknown',
      displayName: 'In Vehicle',
      emoji: '🚗',
      description: 'Currently in vehicle',
    };
  }

  // Handle tilting activities
  if (normalizedActivity.includes('tilting')) {
    return {
      type: 'unknown',
      displayName: 'Tilting',
      emoji: '📱',
      description: 'Device tilting detected',
    };
  }

  // Legacy support for ended/started states
  if (normalizedActivity.includes('still') && normalizedActivity.includes('ended')) {
    return {
      type: 'still',
      displayName: 'Still (Ended)',
      emoji: '🧘',
      description: 'No movement detected - activity ended',
    };
  }

  if (normalizedActivity.includes('walking') && normalizedActivity.includes('ended')) {
    return {
      type: 'walking',
      displayName: 'Walking (Ended)',
      emoji: '🚶‍♂️',
      description: 'Walking activity has ended',
    };
  }

  if (normalizedActivity.includes('running') && normalizedActivity.includes('ended')) {
    return {
      type: 'running',
      displayName: 'Running (Ended)',
      emoji: '🏃‍♂️',
      description: 'Running activity has ended',
    };
  }

  if (normalizedActivity.includes('bicycle') && normalizedActivity.includes('ended')) {
    return {
      type: 'cycling',
      displayName: 'Cycling (Ended)',
      emoji: '🚴‍♂️',
      description: 'Cycling activity has ended',
    };
  }

  // Activity started states (8-15)
  if (normalizedActivity.includes('still') && normalizedActivity.includes('started')) {
    return {
      type: 'still',
      displayName: 'Still',
      emoji: '🧘‍♀️',
      description: 'No movement - staying still',
    };
  }

  if (normalizedActivity.includes('walking') && normalizedActivity.includes('started')) {
    return {
      type: 'walking',
      displayName: 'Walking',
      emoji: '🚶‍♀️',
      description: 'Currently walking',
    };
  }

  if (normalizedActivity.includes('running') && normalizedActivity.includes('started')) {
    return {
      type: 'running',
      displayName: 'Running',
      emoji: '🏃‍♀️',
      description: 'Currently running',
    };
  }

  if (normalizedActivity.includes('bicycle') && normalizedActivity.includes('started')) {
    return {
      type: 'cycling',
      displayName: 'Cycling',
      emoji: '🚴‍♀️',
      description: 'Currently cycling',
    };
  }

  // Fallback for other activities
  if (normalizedActivity.includes('vehicle')) {
    return {
      type: 'unknown',
      displayName: 'In Vehicle',
      emoji: '🚗',
      description: 'Transportation detected',
    };
  }

  if (normalizedActivity.includes('tilting')) {
    return {
      type: 'unknown',
      displayName: 'Tilting',
      emoji: '📱',
      description: 'Device tilting detected',
    };
  }

  // Default unknown activity
  return {
    type: 'unknown',
    displayName: 'Unknown Activity',
    emoji: '❓',
    description: 'Activity detection in progress',
  };
};

/**
 * Get activity icon for display
 */
export const getActivityIcon = (activity: ActivityType | string): string => {
  if (typeof activity === 'string') {
    return mapArduinoActivity(activity).emoji;
  }

  switch (activity) {
    case 'still':
    case 'stationary':
      return '🧘‍♀️';
    case 'walking':
      return '🚶‍♀️';
    case 'running':
      return '🏃‍♀️';
    case 'cycling':
      return '🚴‍♀️';
    default:
      return '❓';
  }
};

/**
 * Get step count display with appropriate formatting
 */
export const formatStepCount = (stepCount: number): string => {
  if (stepCount >= 1000000) {
    return `${(stepCount / 1000000).toFixed(1)}M`;
  } else if (stepCount >= 1000) {
    return `${(stepCount / 1000).toFixed(1)}K`;
  } else {
    return stepCount.toString();
  }
};

/**
 * Calculate step goal progress percentage
 */
export const calculateStepProgress = (currentSteps: number, goalSteps: number = 10000): number => {
  return Math.min(100, Math.round((currentSteps / goalSteps) * 100));
};

/**
 * Get activity-based recommendations
 */
export const getActivityRecommendation = (activity: ActivityType, stepCount: number): string => {
  switch (activity) {
    case 'still':
    case 'stationary':
      if (stepCount < 5000) {
        return 'Consider taking a short walk to increase your daily steps!';
      }
      return 'Taking a rest is important for recovery.';

    case 'walking':
      return 'Great! Walking is excellent for cardiovascular health.';

    case 'running':
      return 'Fantastic! Running provides excellent cardio exercise.';

    case 'cycling':
      return 'Excellent! Cycling is great for leg strength and cardio.';

    default:
      return 'Keep up the great work staying active!';
  }
};
