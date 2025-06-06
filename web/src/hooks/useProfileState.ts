import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchUserProfile } from '../services/profileService';

interface ProfileDataState {
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  bio: string;
  birthDate: string;
  weight: string;
  height: string;
  profileImage: string;
  age: string;
}

interface ProfileStateReturn {
  profileData: ProfileDataState;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataState>>;
  profileLoading: boolean;
  fetchUserProfileData: () => Promise<void>;
}

export const useProfileState = (): ProfileStateReturn => {
  const [profileData, setProfileData] = useState<ProfileDataState>({
    fullName: '',
    email: '',
    gender: '',
    phone: '',
    bio: '',
    birthDate: '',
    weight: '',
    height: '',
    profileImage: '',
    age: '',
  });
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const fetchUserProfileData = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous calls
    if (profileLoading === false) {
      setProfileLoading(true);
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setProfileLoading(false);
        return;
      }

      const { userData, profileData: fetchedProfile, photoUrl } = await fetchUserProfile(userId);

      setProfileData((prev) => ({
        ...prev,
        fullName: userData?.userName || prev.fullName,
        email: userData?.email || prev.email,
        gender: fetchedProfile?.gender || '',
        phone: fetchedProfile?.phone || '',
        bio: fetchedProfile?.bio || '',
        birthDate: '',
        age: fetchedProfile?.age?.toString() || '',
        weight: fetchedProfile?.weight?.toString() || '',
        height: fetchedProfile?.height?.toString() || '',
        profileImage: photoUrl || prev.profileImage,
      }));

      if (userData?.userName) {
        localStorage.setItem('userName', userData.userName);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  }, []); // Empty dependency array - function only needs to be created once

  return {
    profileData,
    setProfileData,
    profileLoading,
    fetchUserProfileData,
  };
};
