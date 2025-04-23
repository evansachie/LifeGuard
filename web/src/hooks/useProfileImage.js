import { useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS, fetchWithAuth, extractPhotoUrl } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export const useProfileImage = (userId) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = async (file) => {
    if (!file) return null;

    try {
      setIsLoading(true);

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await fetchWithAuth(API_ENDPOINTS.UPLOAD_PHOTO(userId), {
        method: 'POST',
        body: formData,
      });

      const cloudinaryUrl = extractPhotoUrl(apiResponse);
      if (!cloudinaryUrl) {
        throw new Error('Failed to get photo URL from response');
      }

      toast.success('Profile photo updated successfully!');
      return { previewUrl, cloudinaryUrl };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile photo');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setIsLoading(true);

      const response = await fetchWithAuth(API_ENDPOINTS.DELETE_PHOTO(userId), {
        method: 'DELETE',
      });

      if (!response) {
        throw new Error('Failed to delete profile photo');
      }

      toast.success('Profile photo deleted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to delete profile photo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleImageChange,
    handleDeletePhoto,
  };
};
