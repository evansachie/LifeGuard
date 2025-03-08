import React from 'react';
import { generateAvatarUrl } from '../../utils/profileUtils';

const UserProfileSection = ({ profilePhotoUrl, displayName, toggleProfileMenu }) => {
  return (
    <div className="user-info" onClick={toggleProfileMenu}>
      <div className="profile-picture-container">
        <img 
          src={profilePhotoUrl || generateAvatarUrl(displayName)}
          alt="Profile" 
          className="profile-picture" 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = generateAvatarUrl(displayName);
          }}
        />
      </div>
      <span className="username">{displayName}</span>
    </div>
  );
};

export default UserProfileSection;
