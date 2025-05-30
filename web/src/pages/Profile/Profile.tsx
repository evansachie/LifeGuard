import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useProfileState } from '../../hooks/useProfileState';
import { useEmergencyContacts } from '../../hooks/useEmergencyContacts';
import { useProfileImage } from '../../hooks/useProfileImage';
import { updateUserProfile, deleteUserAccount } from '../../services/profileService';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import { ProfileData, EmergencyContact } from '../../types/profile.types';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformationForm from '../../components/Profile/PersonalInformationForm';
import PhysicalInformationSection from '../../components/Profile/PhysicalInformationSection';
import EmergencyContactsSection from '../../components/Profile/EmergencyContactsSection';
import DeleteAccountSection from '../../components/Profile/DeleteAccountSection';

import './Profile.css';

interface ProfileProps {
  isDarkMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { profileData, setProfileData, profileLoading, fetchUserProfileData } = useProfileState();
  const { contacts: emergencyContacts, contactsLoading } = useEmergencyContacts();
  const { handleImageChange: handleImageUpdate, handleDeletePhoto } = useProfileImage(
    localStorage.getItem('userId') || ''
  );

  const typedEmergencyContacts: EmergencyContact[] = emergencyContacts.map((contact) => ({
    ...contact,
    Id: typeof contact.Id === 'string' ? parseInt(contact.Id) : contact.Id,
    Name: contact.Name,
    Phone: contact.Phone,
    Email: contact.Email || '',
    Relationship: contact.Relationship || '',
  }));

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('email') || localStorage.getItem('userName');

    setProfileData((prev) => ({
      ...prev,
      fullName: storedName || 'User',
      email: storedEmail || 'user@example.com',
    }));

    fetchUserProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await handleImageUpdate(file);
      if (result) {
        setProfileData((prev) => ({
          ...prev,
          imageUrl: result.previewUrl,
          profileImage: result.cloudinaryUrl,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileDataWithId = {
        ...profileData,
        id: localStorage.getItem('userId') || '',
      };
      
      await updateUserProfile(profileDataWithId as ProfileData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      setTimeout(fetchUserProfileData, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      await deleteUserAccount(userId);
      localStorage.clear();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const typedProfileData: ProfileData = {
    ...profileData,
    id: localStorage.getItem('userId') || '',
  } as ProfileData;

  return (
    <div className={`profile-page ${isDarkMode ? 'dark' : ''}`}>
      <div className={`profile-container ${editMode ? 'edit-mode' : ''}`}>
        <ProfileHeader
          profileData={typedProfileData}
          profileLoading={profileLoading}
          isLoading={isLoading}
          editMode={editMode}
          handleImageChange={handleImageChange}
          handleDeletePhoto={handleDeletePhoto}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="profile-content"
        >
          <form onSubmit={handleSubmit}>
            <PersonalInformationForm
              profileData={typedProfileData}
              profileLoading={profileLoading}
              editMode={editMode}
              setEditMode={setEditMode}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isDarkMode={isDarkMode}
            />

            {!profileLoading && (
              <PhysicalInformationSection
                profileData={typedProfileData}
                handleInputChange={handleInputChange}
                editMode={editMode}
                isDarkMode={isDarkMode}
              />
            )}

            {editMode && (
              <div className="form-actions">
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                  disabled={isLoading}
                >
                  <FaTimesCircle /> Cancel
                </button>
              </div>
            )}
          </form>
        </motion.div>

        <EmergencyContactsSection
          contactsLoading={contactsLoading}
          emergencyContacts={typedEmergencyContacts}
          isDarkMode={isDarkMode}
        />

        <DeleteAccountSection
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default Profile;
