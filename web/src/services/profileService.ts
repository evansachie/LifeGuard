import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { UserData } from '../types/common.types';

interface ProfileData {
  email?: string;
  age?: string | number;
  gender?: string;
  weight?: string | number;
  height?: string | number;
  phone?: string;
  bio?: string;
  profileImage?: string | null;
}

interface UserProfileResponse {
  userData: UserData;
  profileData: ProfileData;
  photoUrl: string | null;
}

interface CompleteProfileData {
  Email: string;
  Age: number | null;
  Gender: string;
  Weight: number | null;
  Height: number | null;
  PhoneNumber: string;
  Bio: string;
  ProfileImage: string | null;
}

interface ProfileUpdateResponse {
  isSuccess: boolean;
  message?: string;
  data?: {
    profileId: string;
    userId: string;
    updatedAt: string;
    [key: string]: any;
  };
}

export const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  // First fetch basic user data
  const userData = await fetchWithAuth(API_ENDPOINTS.GET_USER(userId));

  // Then fetch detailed profile data
  const profileResponse = await fetchWithAuth(API_ENDPOINTS.GET_PROFILE(userId));
  const profileData = profileResponse && profileResponse.data ? profileResponse.data : {};

  // Try to get the profile photo URL
  let photoUrl: string | null = profileData?.profileImage;

  if (!photoUrl) {
    try {
      const photoResponse = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId));
      if (photoResponse && typeof photoResponse === 'object') {
        photoUrl = photoResponse.url || photoResponse.imageUrl || photoResponse.profileImage;
      } else if (typeof photoResponse === 'string' && photoResponse.startsWith('http')) {
        photoUrl = photoResponse;
      }
    } catch (photoError) {
      console.log('No profile photo found, using default avatar');
    }
  }

  return { userData, profileData, photoUrl };
};

export const updateUserProfile = async (profileData: ProfileData): Promise<ProfileUpdateResponse> => {
  try {
    const completeProfileData: CompleteProfileData = {
      Email: profileData.email || '',
      Age: profileData.age ? parseInt(profileData.age.toString(), 10) : null,
      Gender: profileData.gender || '',
      Weight: profileData.weight ? parseInt(profileData.weight.toString(), 10) : null,
      Height: profileData.height ? parseInt(profileData.height.toString(), 10) : null,
      PhoneNumber: profileData.phone || '', 
      Bio: profileData.bio || '',
      ProfileImage: profileData.profileImage || null,
    };

    return await fetchWithAuth(API_ENDPOINTS.COMPLETE_PROFILE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeProfileData),
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteUserAccount = async (userId: string): Promise<{ isSuccess: boolean; message?: string }> => {
  return await fetchWithAuth(API_ENDPOINTS.DELETE_USER(userId), {
    method: 'DELETE',
  });
};
