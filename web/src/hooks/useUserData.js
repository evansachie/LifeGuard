import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { fetchProfilePhoto } from '../utils/profileUtils';

/**
 * Custom hook to fetch and manage user data
 * @returns {Object} User data, profile photo URL, loading status, and utility functions
 */
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const data = await fetchWithAuth(`${API_ENDPOINTS.GET_USER(userId)}`);
        
        if (data) {
          setUserData(data);
          localStorage.setItem('userName', data.userName);
          
          await fetchUserProfilePhoto(userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const fetchUserProfilePhoto = async (userId) => {
    try {
      const photoUrl = await fetchProfilePhoto(userId);
      
      if (photoUrl) {
        setProfilePhotoUrl(photoUrl);
      } else {
        try {
          const profileResponse = await fetchWithAuth(API_ENDPOINTS.GET_PROFILE(userId));
          if (profileResponse?.data?.profileImage) {
            setProfilePhotoUrl(profileResponse.data.profileImage);
          }
        } catch (profileError) {
          console.log('Could not fetch profile data for photo');
        }
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

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
