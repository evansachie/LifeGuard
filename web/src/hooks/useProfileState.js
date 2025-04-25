import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchUserProfile } from '../services/profileService';

export const useProfileState = () => {
  const [profileData, setProfileData] = useState({
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
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchUserProfileData = async () => {
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
        phone: fetchedProfile?.phoneNumber || '',
        bio: fetchedProfile?.bio || '',
        birthDate: fetchedProfile?.birthDate || '',
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
