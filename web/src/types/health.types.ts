// Medication Types
export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  reminderTimes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  scheduledTime: string;
  takenTime?: string;
  status: 'scheduled' | 'taken' | 'missed' | 'skipped';
  notes?: string;
}

export interface MedicationCompliance {
  medicationId: string;
  medicationName: string;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  complianceRate: number;
  period: string;
}

// Exercise Types
export interface ExerciseSession {
  id: string;
  userId: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
  completedAt: string;
}

export interface ExerciseStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  favoriteActivity: string;
}

export interface ExerciseGoals {
  weeklyWorkouts: number;
  weeklyMinutes: number;
  weeklyCalories: number;
  dailySteps: number;
}

// Emergency Contact Types
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  type: 'fall_detected' | 'panic_button' | 'health_emergency' | 'environmental_danger';
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  sentAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  contactsNotified: string[];
}
