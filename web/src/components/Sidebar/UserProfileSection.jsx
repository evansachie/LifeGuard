import React from 'react';
import { generateAvatarUrl } from '../../utils/profileUtils';
import { Link } from 'react-router-dom';

const UserProfileSection = ({ profilePhotoUrl, displayName }) => {
  return (
    <div className="user-info">
      <div className="profile-picture-container">
        <Link to="/profile">
          <img
            src={profilePhotoUrl || generateAvatarUrl(displayName)}
            alt="Profile"
            className="profile-picture"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = generateAvatarUrl(displayName);
            }}
          />
        </Link>
      </div>
      <Link to="/profile">
        <span className="username">{displayName}</span>
      </Link>
    </div>
  );
};

export default UserProfileSection;
