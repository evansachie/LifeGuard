import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { getErrorMessage } from '../utils/errorHandler';
import { UserData } from '../types/common.types';

interface UseUserDataReturn {
  userData: UserData | null;
  profilePhotoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  getDisplayName: () => string;
}

/**
 * Custom hook to fetch and manage user data
 * @returns User data, profile photo URL, loading status, and utility functions
 */
const useUserData = (): UseUserDataReturn => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfilePhoto = async (): Promise<string | null> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return null;

      const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId));

      // Check if we have a valid photo URL in the response
      if (response?.isSuccess && response?.data?.url) {
        return response.data.url;
      }
      return null;
    } catch (error: unknown) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  };

  const loadUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('No user ID found');
        setIsLoading(false);
        return;
      }

      // Fetch both user data and photo in parallel
      const [userDataResponse, photoUrl] = await Promise.all([
        fetchWithAuth(API_ENDPOINTS.GET_USER(userId)),
        fetchUserProfilePhoto(),
      ]);

      if (userDataResponse && (userDataResponse.userName || userDataResponse.email)) {
        setUserData({
          id: userId,
          userName: userDataResponse.userName,
          email: userDataResponse.email,
        });

        if (userDataResponse.userName) {
          localStorage.setItem('userName', userDataResponse.userName);
        }

        setProfilePhotoUrl(photoUrl || profilePhotoUrl);
      } else {
        throw new Error('Invalid user data response');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to load user data');
      console.error('Error loading user data:', error);
      setError(errorMessage);
      toast.error('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const getDisplayName = (): string => {
    if (!userData?.userName) return 'User';
    return userData.userName.split(' ')[0];
  };

  return {
    userData,
    profilePhotoUrl,
    isLoading,
    error,
    getDisplayName,
  };
};

export default useUserData;
