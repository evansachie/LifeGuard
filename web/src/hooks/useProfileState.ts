import { useState } from 'react';
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

  const fetchUserProfileData = async (): Promise<void> => {
    try {
      setProfileLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) return;

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
      toast.error('Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    profileData,
    setProfileData,
    profileLoading,
    fetchUserProfileData,
  };
};
