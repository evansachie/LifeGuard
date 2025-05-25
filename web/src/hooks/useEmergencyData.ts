import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchApi, API_ENDPOINTS } from '../utils/api';

interface MedicalInfo {
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  bio: string;
}

interface Medication {
  id: number | string;
  name: string;
  dosage?: string;
  frequency?: string;
  [key: string]: any;
}

interface EmergencyUserData {
  name: string;
  location: string;
  phone: string;
  email: string;
  medicalInfo: MedicalInfo;
  timestamp: string;
  mapUrl: string | null;
  medications: Medication[];
}

interface EmergencyDataReturn {
  userData: EmergencyUserData;
  isLoading: boolean;
}

export function useEmergencyData(userId: string): EmergencyDataReturn {
  const [userData, setUserData] = useState<EmergencyUserData>({
    name: 'LifeGuard User',
    location: 'Last known location',
    phone: 'Not available',
    email: 'Not available',
    medicalInfo: {
      age: 'N/A',
      gender: 'N/A',
      weight: 'N/A',
      height: 'N/A',
      bio: 'No additional information provided',
    },
    timestamp: new Date().toLocaleString(),
    mapUrl: null,
    medications: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        toast.error('Invalid tracking link: missing user ID');
        setIsLoading(false);
        return;
      }

      try {
        const userResponse = await fetchApi(API_ENDPOINTS.GET_USER(userId));
        const profileResponse = await fetchApi(API_ENDPOINTS.GET_PROFILE(userId));
        // Add this new request to fetch medications
        let medications: Medication[] = [];
        try {
          const medicationsResponse = await fetchApi(API_ENDPOINTS.MEDICATIONS.EMERGENCY(userId));
          if (medicationsResponse && medicationsResponse.success) {
            medications = medicationsResponse.data || [];
          }
        } catch (medError) {
          console.error('Error fetching medications:', medError);
        }

        const profileData = profileResponse?.data || {};

        if (userResponse) {
          setUserData({
            name: userResponse.userName || 'LifeGuard User',
            email: userResponse.email || 'Not available',
            phone: profileData.phoneNumber || 'Not available',
            location: profileData.location || 'Ghana, Accra',
            medicalInfo: {
              age: profileData.age || 'N/A',
              gender: profileData.gender || 'N/A',
              weight: profileData.weight || 'N/A',
              height: profileData.height || 'N/A',
              bio: profileData.bio || 'No additional information provided',
            },
            timestamp: new Date().toLocaleString(),
            mapUrl: null,
            medications: medications,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return { userData, isLoading };
}
