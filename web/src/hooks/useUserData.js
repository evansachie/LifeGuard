import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { generateAvatarUrl } from '../utils/profileUtils';

/**
 * Custom hook to fetch and manage user data
 * @returns {Object} User data, profile photo URL, loading status, and utility functions
 */
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfilePhoto = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId));

      // Check if we have a valid photo URL in the response
      if (response?.isSuccess && response?.data?.url) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  };

  const loadUserData = async () => {
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
        fetchUserProfilePhoto()
      ]);

      if (userDataResponse && (userDataResponse.userName || userDataResponse.email)) {
        setUserData({
          userName: userDataResponse.userName,
          email: userDataResponse.email
        });

        if (userDataResponse.userName) {
          localStorage.setItem('userName', userDataResponse.userName);
        }

        setProfilePhotoUrl(photoUrl || profilePhotoUrl);
      } else {
        throw new Error('Invalid user data response');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message || 'Failed to load user data');
      toast.error('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const getDisplayName = () => {
    if (!userData?.userName) return 'User';
    return userData.userName.split(' ')[0];
  };

  return {
    userData,
    profilePhotoUrl,
    isLoading,
    error,
    getDisplayName
  };
};

export default useUserData;
