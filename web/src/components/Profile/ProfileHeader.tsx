import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaTrash } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import { generateAvatarUrl } from '../../utils/profileUtils';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';

interface ProfileData {
  fullName: string;
  email: string;
  profilePhotoUrl?: string;
  profileImage?: string;
}

interface ProfileHeaderProps {
  profileData: ProfileData;
  profileLoading: boolean;
  isLoading: boolean;
  editMode: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: () => Promise<boolean>;
  isDarkMode?: boolean;
}

const ProfileHeader = ({
  profileData,
  profileLoading,
  isLoading,
  editMode,
  handleImageChange,
  handleDeletePhoto,
  isDarkMode = false,
}: ProfileHeaderProps) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePhoto = async (): Promise<void> => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId || ''));

        if (response?.isSuccess && response?.data?.url) {
          setProfilePhotoUrl(response.data.url);
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, []);

  const handleDeletePhotoWithRefresh = async (): Promise<void> => {
    const success = await handleDeletePhoto();
    if (success) {
      setProfilePhotoUrl(null);
    }
  };

  const photoUrl =
    profilePhotoUrl ||
    profileData.profilePhotoUrl ||
    profileData.profileImage ||
    generateAvatarUrl(profileData.fullName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-header"
    >
      <div className="profile-avatar-container">
        <div className="profile-avatar">
          {profileLoading ? (
            <div className="avatar-spinner-container">
              <Spinner size="large" />
            </div>
          ) : (
            <img
              src={photoUrl}
              alt={`${profileData.fullName}'s profile`}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = generateAvatarUrl(profileData.fullName);
              }}
            />
          )}
        </div>
        {editMode && (
          <div className="avatar-actions">
            <button
              className={`edit-image-button ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } p-2 rounded-full transition-colors`}
              onClick={() => document.getElementById('profilePhotoInput')?.click()}
              disabled={isLoading}
            >
              <FaCamera />
            </button>
            <input
              id="profilePhotoInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            {photoUrl !== generateAvatarUrl(profileData.fullName) && (
              <button
                className={`delete-image-button ${
                  isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } p-2 rounded-full transition-colors`}
                onClick={handleDeletePhotoWithRefresh}
                disabled={isLoading}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>
      <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {profileLoading ? 'Loading...' : profileData.fullName}
      </h1>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {profileLoading ? '...' : profileData.email}
      </p>
    </motion.div>
  );
};

export default ProfileHeader;
