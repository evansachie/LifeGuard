import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUserEdit } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import Spinner from '../../components/Spinner/Spinner';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  [key: string]: string | number | boolean | undefined;
}

interface PersonalInformationFormProps {
  profileData: ProfileData;
  profileLoading: boolean;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDarkMode: boolean;
}

const PersonalInformationForm = ({
  profileData,
  profileLoading,
  editMode,
  setEditMode,
  handleInputChange,
  handleSubmit,
  isDarkMode,
}: PersonalInformationFormProps) => {
  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Personal Information</h2>
        {!editMode && !profileLoading && (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            <FaUserEdit /> Edit Profile
          </button>
        )}
      </div>

      {profileLoading ? (
        <div className="form-loading-container">
          <Spinner size="large" />
          <p>Loading profile information...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <div
                className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <FaUser />
                <span>Full Name</span>
              </div>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>

            <div className="form-group">
              <div
                className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <FaEnvelope />
                <span>Email</span>
              </div>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>

            <div className="form-group">
              <div
                className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <FaPhone />
                <span>Phone</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <div
              className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              <FaPerson />
              <span>Bio</span>
            </div>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInformationForm;
