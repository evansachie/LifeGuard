import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useProfileState } from '../../hooks/useProfileState';
import { useEmergencyContacts } from '../../hooks/useEmergencyContacts';
import { useProfileImage } from '../../hooks/useProfileImage';
import { updateUserProfile, deleteUserAccount } from '../../services/profileService';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformationForm from '../../components/Profile/PersonalInformationForm';
import PhysicalInformationSection from '../../components/Profile/PhysicalInformationSection';
import EmergencyContactsSection from '../../components/Profile/EmergencyContactsSection';
import DeleteAccountSection from '../../components/Profile/DeleteAccountSection';

import './Profile.css';

function Profile({ isDarkMode }) {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const { profileData, setProfileData, profileLoading, fetchUserProfileData } = useProfileState();
    const { emergencyContacts, contactsLoading } = useEmergencyContacts();
    const { isLoading: imageLoading, handleImageChange: handleImageUpdate, handleDeletePhoto } = useProfileImage(localStorage.getItem('userId'));

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('email') || localStorage.getItem('userName');
        
        setProfileData(prev => ({
            ...prev,
            fullName: storedName || 'User',
            email: storedEmail || 'user@example.com',
        }));

        fetchUserProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await handleImageUpdate(file);
            if (result) {
                setProfileData(prev => ({
                    ...prev,
                    imageUrl: result.previewUrl,
                    profileImage: result.cloudinaryUrl
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateUserProfile(profileData);
            toast.success('Profile updated successfully!');
            setEditMode(false);
            setTimeout(fetchUserProfileData, 1000);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setIsLoading(true);
            const userId = localStorage.getItem('userId');
            await deleteUserAccount(userId);
            localStorage.clear();
            toast.success('Account deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Failed to delete account');
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className={`profile-page ${isDarkMode ? 'dark' : ''}`}>
            <div className={`profile-container ${editMode ? 'edit-mode' : ''}`}>
                <ProfileHeader 
                    profileData={profileData}
                    profileLoading={profileLoading}
                    isLoading={isLoading}
                    editMode={editMode}
                    handleImageChange={handleImageChange}
                    handleDeletePhoto={handleDeletePhoto}
                    isDarkMode={isDarkMode}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="profile-content"
                >
                    <form onSubmit={handleSubmit}>
                        <PersonalInformationForm
                            profileData={profileData}
                            profileLoading={profileLoading}
                            isLoading={isLoading}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            isDarkMode={isDarkMode}
                        />
                        
                        {!profileLoading && (
                            <PhysicalInformationSection
                                profileData={profileData}
                                handleInputChange={handleInputChange}
                                editMode={editMode}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {editMode && (
                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="save-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
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
                    emergencyContacts={emergencyContacts}
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
}

export default Profile;