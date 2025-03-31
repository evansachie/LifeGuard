import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaTrash } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';

function ProfileHeader({ 
    profileData, 
    profileLoading, 
    isLoading, 
    editMode, 
    handleImageChange, 
    handleDeletePhoto, 
    isDarkMode 
}) {
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
                            src={profileData.imageUrl || profileData.profileImage || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=random`} 
                            alt="Profile" 
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
                        {(profileData.imageUrl || profileData.profileImage) && (
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
            <h1>{profileLoading ? "Loading..." : profileData.fullName}</h1>
            <p>{profileLoading ? "..." : profileData.email}</p>
        </motion.div>
    );
}

export default ProfileHeader;