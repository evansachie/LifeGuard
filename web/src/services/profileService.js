import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

export const fetchUserProfile = async (userId) => {
  // First fetch basic user data
  const userData = await fetchWithAuth(API_ENDPOINTS.GET_USER(userId));

  // Then fetch detailed profile data
  const profileResponse = await fetchWithAuth(API_ENDPOINTS.GET_PROFILE(userId));
  const profileData = profileResponse && profileResponse.data ? profileResponse.data : {};

  // Try to get the profile photo URL
  let photoUrl = profileData?.profileImage;

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

export const updateUserProfile = async (profileData) => {
  try {
    const completeProfileData = {
      Email: profileData.email,
      Age: profileData.age ? parseInt(profileData.age) : null,
      Gender: profileData.gender || '',
      Weight: profileData.weight ? parseInt(profileData.weight) : null,
      Height: profileData.height ? parseInt(profileData.height) : null,
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

export const deleteUserAccount = async (userId) => {
  return await fetchWithAuth(API_ENDPOINTS.DELETE_USER(userId), {
    method: 'DELETE',
  });
};
