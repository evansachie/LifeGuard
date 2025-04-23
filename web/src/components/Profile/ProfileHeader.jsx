import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaTrash } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import { generateAvatarUrl } from '../../utils/profileUtils';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';

function ProfileHeader({
  profileData,
  profileLoading,
  isLoading,
  editMode,
  handleImageChange,
  handleDeletePhoto,
}) {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId));

        if (response?.isSuccess && response?.data?.url) {
          setProfilePhotoUrl(response.data.url);
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, []);

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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = generateAvatarUrl(profileData.fullName);
              }}
            />
          )}
        </div>
        {editMode && (
          <div className="avatar-actions">
            <button
              className="edit-image-button"
              onClick={() => document.getElementById('profilePhotoInput').click()}
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
                className="delete-image-button"
                onClick={handleDeletePhoto}
                disabled={isLoading}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>
      <h1>{profileLoading ? 'Loading...' : profileData.fullName}</h1>
      <p>{profileLoading ? '...' : profileData.email}</p>
    </motion.div>
  );
}

export default ProfileHeader;
