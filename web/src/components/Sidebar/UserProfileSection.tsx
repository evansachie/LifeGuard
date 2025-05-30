import React from 'react';
import { generateAvatarUrl } from '../../utils/profileUtils';
import { Link } from 'react-router-dom';

interface UserProfileSectionProps {
  profilePhotoUrl: string | null;
  displayName: string;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ profilePhotoUrl, displayName }) => {
  return (
    <div className="user-info">
      <div className="profile-picture-container">
        <Link to="/profile">
          <img
            src={profilePhotoUrl || generateAvatarUrl(displayName)}
            alt="Profile"
            className="profile-picture"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = generateAvatarUrl(displayName);
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
