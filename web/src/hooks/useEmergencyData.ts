import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchApi, API_ENDPOINTS } from '../utils/api';
import { EmergencyUserData, Medication } from '../types/emergency.types';

// Default emergency user data that matches the expected structure
const defaultUserData: EmergencyUserData = {
  name: 'User',
  location: 'Unknown location',
  phone: '+233000000000',
  email: 'user@example.com',
  timestamp: new Date().toLocaleString(),
  medicalInfo: {
    age: 30,
    gender: 'Not specified',
    weight: 70,
    height: 175,
    bio: 'No additional information available',
  },
  mapUrl: null,
  medications: [],
};

export function useEmergencyData(userId: string) {
  const [userData, setUserData] = useState<EmergencyUserData>(defaultUserData);
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
