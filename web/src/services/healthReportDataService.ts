import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { fetchUserProfile } from './profileService';
import exerciseService from './exerciseService';
import { getFavorites } from './favoriteSoundsService';
import { EnhancedHealthReportData } from '../utils/pdfGenerator';

// Define proper types for the data structures
interface UserData {
  userName?: string;
  email?: string;
  [key: string]: any;
}

interface ProfileData {
  fullName?: string;
  age?: number | string;
  gender?: string;
  weight?: number | string;
  height?: number | string;
  phone?: string;
  phoneNumber?: string;
  bio?: string;
  email?: string;
  [key: string]: any;
}

interface HealthMetrics {
  BMR?: number;
  TDEE?: number;
  Weight?: number;
  Height?: number;
  ActivityLevel?: string;
  Goal?: string;
  [key: string]: any;
}

interface Medication {
  Name?: string;
  name?: string;
  Dosage?: string;
  dosage?: string;
  Frequency?: string;
  frequency?: string;
  Active?: boolean;
  [key: string]: any;
}

interface EmergencyContact {
  Name?: string;
  name?: string;
  Relationship?: string;
  relationship?: string;
  Phone?: string;
  phone?: string;
  [key: string]: any;
}

interface Memo {
  Content?: string;
  content?: string;
  text?: string;
  CreatedAt?: string;
  createdAt?: string;
  IsCompleted?: boolean;
  isCompleted?: boolean;
  [key: string]: any;
}

interface FavoriteSound {
  name?: string;
  sound_name?: string;
  category?: string;
  [key: string]: any;
}

// Generate realistic mock data based on user profile
const generatePersonalizedMockData = (userProfile: ProfileData) => {
  const age = userProfile?.age ? parseInt(userProfile.age.toString()) : 30;
  const gender = userProfile?.gender || 'male';

  // Generate realistic vitals based on age and gender
  const baseHeartRate = age > 60 ? 75 : gender === 'male' ? 70 : 75;
  const baseSystolic = age > 50 ? 130 : 120;
  const baseDiastolic = age > 50 ? 85 : 80;

  return {
    heartRate: {
      average: `${baseHeartRate + Math.floor(Math.random() * 10 - 5)} BPM`,
      min: `${baseHeartRate - 10} BPM`,
      max: `${baseHeartRate + 15} BPM`,
      status: 'Normal',
    },
    bloodPressure: {
      average: `${baseSystolic}/${baseDiastolic} mmHg`,
      min: `${baseSystolic - 10}/${baseDiastolic - 5} mmHg`,
      max: `${baseSystolic + 10}/${baseDiastolic + 5} mmHg`,
      status: baseSystolic > 140 ? 'High' : 'Normal',
    },
    bodyTemperature: {
      average: '36.8°C',
      min: '36.5°C',
      max: '37.1°C',
      status: 'Normal',
    },
    oxygenSaturation: {
      average: '98%',
      min: '96%',
      max: '99%',
      status: 'Normal',
    },
  };
};

const generateEnvironmentalMockData = () => ({
  airQuality: {
    average: 'Good (45 AQI)',
    status: 'Good',
    pollutants: {
      pm25: '12 μg/m³',
      pm10: '18 μg/m³',
      no2: '25 μg/m³',
    },
  },
  temperature: {
    average: '24°C',
    status: 'Optimal',
  },
  humidity: {
    average: '55%',
    status: 'Comfortable',
  },
  pressure: {
    average: '1013 hPa',
    status: 'Normal',
  },
});

const generatePersonalizedRecommendations = (userData: {
  healthMetrics?: HealthMetrics;
  exerciseData?: any;
  medications?: Medication[];
  profileData?: ProfileData;
}) => {
  const recommendations: string[] = [];

  if (userData.healthMetrics?.Goal === 'lose') {
    recommendations.push(
      'Consider increasing your daily step count by 2,000 steps for effective weight loss.'
    );
    recommendations.push(
      'Focus on lean proteins and reduce processed food intake based on your current goal.'
    );
  } else if (userData.healthMetrics?.Goal === 'gain') {
    recommendations.push(
      'Include more strength training exercises to support your muscle gain goal.'
    );
    recommendations.push('Ensure adequate protein intake of 1.6-2.2g per kg of body weight.');
  }

  if (userData.medications && userData.medications.length > 0) {
    recommendations.push('Continue taking medications as prescribed and track any side effects.');
  }

  if (userData.exerciseData?.currentStreak > 7) {
    recommendations.push(
      'Excellent workout consistency! Consider varying your routine to prevent plateaus.'
    );
  } else {
    recommendations.push(
      'Try to establish a consistent workout routine of at least 3-4 sessions per week.'
    );
  }

  if (userData.profileData?.age && parseInt(userData.profileData.age.toString()) > 50) {
    recommendations.push('Include calcium and vitamin D rich foods for bone health.');
    recommendations.push('Consider regular cardiovascular health screenings.');
  }

  // Default recommendations if no specific data
  if (recommendations.length === 0) {
    recommendations.push(
      'Maintain a balanced diet with plenty of fruits and vegetables.',
      'Aim for at least 7-8 hours of quality sleep each night.',
      'Stay hydrated by drinking 8-10 glasses of water daily.',
      'Include both cardio and strength training in your fitness routine.',
      'Practice stress management through meditation or deep breathing exercises.'
    );
  }

  return recommendations;
};

export const generateEnhancedHealthReport = async (
  userId: string
): Promise<EnhancedHealthReportData> => {
  try {
    // Fetch all user data concurrently
    const [
      profileResult,
      exerciseStatsResult,
      healthMetricsResult,
      medicationsResult,
      emergencyContactsResult,
      memosResult,
      favoriteSoundsResult,
    ] = await Promise.allSettled([
      fetchUserProfile(userId),
      exerciseService.getStats().catch(() => null),
      fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.LATEST).catch(() => null),
      fetchWithAuth(API_ENDPOINTS.MEDICATIONS.LIST).catch(() => null),
      fetchWithAuth(API_ENDPOINTS.EMERGENCY_CONTACTS).catch(() => null),
      fetchWithAuth(API_ENDPOINTS.MEMOS).catch(() => null),
      getFavorites(userId).catch(() => []),
    ]);

    // Extract data with proper typing and fallbacks
    const profileData: ProfileData =
      profileResult.status === 'fulfilled' ? profileResult.value.profileData || {} : {};
    const userData: UserData =
      profileResult.status === 'fulfilled' ? profileResult.value.userData || {} : {};
    const exerciseData =
      exerciseStatsResult.status === 'fulfilled' ? exerciseStatsResult.value : null;
    const healthMetrics: HealthMetrics =
      healthMetricsResult.status === 'fulfilled' ? healthMetricsResult.value?.data || {} : {};
    const medications: Medication[] =
      medicationsResult.status === 'fulfilled'
        ? Array.isArray(medicationsResult.value)
          ? medicationsResult.value
          : medicationsResult.value?.data || []
        : [];
    const emergencyContacts: EmergencyContact[] =
      emergencyContactsResult.status === 'fulfilled'
        ? Array.isArray(emergencyContactsResult.value)
          ? emergencyContactsResult.value
          : emergencyContactsResult.value?.data || []
        : [];
    const memos: Memo[] =
      memosResult.status === 'fulfilled'
        ? Array.isArray(memosResult.value)
          ? memosResult.value
          : memosResult.value?.data || []
        : [];
    const favoriteSounds: FavoriteSound[] =
      favoriteSoundsResult.status === 'fulfilled' ? favoriteSoundsResult.value : [];

    // Generate report ID and date
    const reportId = `LG-${Date.now()}-${userId.substring(0, 6)}`;
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Compile user information with proper fallbacks
    const userInfo = {
      reportId,
      date: reportDate,
      name: userData.userName || profileData.fullName || 'LifeGuard User',
      age: profileData.age ? parseInt(profileData.age.toString()) : undefined,
      gender: profileData.gender,
      email: userData.email || profileData.email,
      phone: profileData.phone || profileData.phoneNumber,
      bio: profileData.bio,
    };

    // Generate mock vitals (since hardware isn't available)
    const vitals = generatePersonalizedMockData(profileData);

    // Process health metrics
    const processedHealthMetrics =
      Object.keys(healthMetrics).length > 0
        ? {
            bmr: healthMetrics.BMR,
            tdee: healthMetrics.TDEE,
            bmi:
              healthMetrics.Weight && healthMetrics.Height
                ? healthMetrics.Weight / Math.pow(healthMetrics.Height / 100, 2)
                : undefined,
            activityLevel: healthMetrics.ActivityLevel,
            goal: healthMetrics.Goal,
            idealWeight:
              healthMetrics.Weight && healthMetrics.Height
                ? {
                    min: Math.round(18.5 * Math.pow(healthMetrics.Height / 100, 2)),
                    max: Math.round(24.9 * Math.pow(healthMetrics.Height / 100, 2)),
                  }
                : undefined,
          }
        : undefined;

    // Process exercise data
    const activityMetrics = exerciseData
      ? {
          totalWorkouts: {
            value: exerciseData.totalWorkouts || 0,
            status: (exerciseData.totalWorkouts || 0) >= 12 ? 'Excellent' : 'Good',
            goal: '12 per month',
          },
          caloriesBurned: {
            value: exerciseData.totalCaloriesBurned || 0,
            status: (exerciseData.totalCaloriesBurned || 0) >= 2000 ? 'On track' : 'Below target',
            goal: '2000 per month',
          },
          currentStreak: {
            value: exerciseData.currentStreak || 0,
            status: (exerciseData.currentStreak || 0) >= 7 ? 'Excellent' : 'Building',
            goal: '7 days',
          },
        }
      : undefined;

    // Process medications
    const processedMedications = medications.map((med: Medication) => ({
      name: med.Name || med.name || 'Unknown',
      dosage: med.Dosage || med.dosage || 'Unknown',
      frequency: med.Frequency || med.frequency || 'Daily',
      active: med.Active !== undefined ? med.Active : true,
    }));

    // Process emergency contacts
    const processedEmergencyContacts = emergencyContacts
      .slice(0, 3)
      .map((contact: EmergencyContact) => ({
        name: contact.Name || contact.name || 'Unknown',
        relationship: contact.Relationship || contact.relationship || 'Contact',
        phone: contact.Phone || contact.phone || 'Unknown',
      }));

    // Process recent notes/memos
    const recentNotes = memos.slice(0, 5).map((memo: Memo) => ({
      content: memo.Content || memo.content || memo.text || 'No content',
      date: new Date(memo.CreatedAt || memo.createdAt || Date.now()).toLocaleDateString(),
      isCompleted: memo.IsCompleted || memo.isCompleted || false,
    }));

    // Process wellness data
    const wellnessData =
      favoriteSounds.length > 0
        ? {
            favoriteSounds: favoriteSounds.slice(0, 5).map((sound: FavoriteSound) => ({
              name: sound.name || sound.sound_name || 'Unknown',
              category: sound.category || 'meditation',
            })),
            preferredCategories: [
              ...new Set(favoriteSounds.map((s: FavoriteSound) => s.category || 'meditation')),
            ],
          }
        : undefined;

    // Generate environmental data (mock)
    const environmentalMetrics = generateEnvironmentalMockData();

    // Generate personalized recommendations
    const recommendations = generatePersonalizedRecommendations({
      profileData,
      healthMetrics: processedHealthMetrics,
      exerciseData,
      medications: processedMedications,
    });

    const enhancedReport: EnhancedHealthReportData = {
      userInfo,
      vitals,
      healthMetrics: processedHealthMetrics,
      activityMetrics,
      medications: processedMedications.length > 0 ? processedMedications : undefined,
      emergencyContacts:
        processedEmergencyContacts.length > 0 ? processedEmergencyContacts : undefined,
      recentNotes: recentNotes.length > 0 ? recentNotes : undefined,
      wellnessData,
      environmentalMetrics,
      recommendations,
    };

    return enhancedReport;
  } catch (error) {
    console.error('Error generating enhanced health report:', error);

    // Fallback to basic report with minimal data
    return {
      userInfo: {
        reportId: `LG-${Date.now()}-ERROR`,
        date: new Date().toLocaleDateString(),
        name: 'LifeGuard User',
      },
      vitals: generatePersonalizedMockData({}),
      environmentalMetrics: generateEnvironmentalMockData(),
      recommendations: [
        'Unable to load personalized data. Please ensure all services are connected.',
        'Maintain a healthy lifestyle with regular exercise and balanced nutrition.',
        'Stay hydrated and get adequate sleep.',
        'Consult healthcare professionals for medical advice.',
      ],
    };
  }
};
