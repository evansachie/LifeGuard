import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaUserEdit, FaSave, FaTimesCircle, FaCamera, FaPlus, FaUserPlus, FaTrash } from 'react-icons/fa';
import { FaPerson } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Profile.css';
import { API_ENDPOINTS, fetchWithAuth } from '../../utils/api';
import { calculateAge } from '../../utils/calculateAge';
import { uploadToCloudinary } from '../../utils/cloudinary';

function Profile({ isDarkMode }) {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        gender: '',
        phone: '',
        bio: '',
        birthDate: '',
        weight: '',
        height: '',
        profileImage: '',
        emergencyContacts: [],
        age: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        // Load user data from localStorage
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('email') || localStorage.getItem('userName');
        
        // Load emergency contacts (if any)
        const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
        
        setProfileData(prev => ({
            ...prev,
            fullName: storedName || 'User',
            email: storedEmail || 'user@example.com',
            emergencyContacts: contacts
        }));

        // Fetch user profile data if available
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchEmergencyContacts = async () => {
            try {
                const data = await fetchWithAuth(API_ENDPOINTS.EMERGENCY_CONTACTS);
                setProfileData(prev => ({
                    ...prev,
                    emergencyContacts: data
                }));
            } catch (error) {
                console.error('Error fetching emergency contacts:', error);
            }
        };

        fetchEmergencyContacts();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            // First fetch basic user data using the existing method
            const userData = await fetchWithAuth(API_ENDPOINTS.GET_USER(userId));
            
            // Then fetch detailed profile data using the new endpoint
            const profileResponse = await fetchWithAuth(API_ENDPOINTS.GET_PROFILE(userId));
            
            // Extract the actual profile data from the nested 'data' property
            const profileData = profileResponse && profileResponse.data ? profileResponse.data : {};
            
            console.log('User data:', userData);
            console.log('Profile data:', profileData);
            
            // Try to get the profile photo URL directly
            let photoUrl = profileData?.profileImage;
            
            // If no profile image URL in profile data, try to fetch it from the photo endpoint
            if (!photoUrl) {
                try {
                    const photoResponse = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId), {
                        method: 'GET'
                    });
                    
                    // If the response contains a URL or image data
                    if (photoResponse && typeof photoResponse === 'object') {
                        photoUrl = photoResponse.url || photoResponse.imageUrl || photoResponse.profileImage;
                    } else if (typeof photoResponse === 'string' && photoResponse.startsWith('http')) {
                        // If the response is a direct URL string
                        photoUrl = photoResponse;
                    }
                } catch (photoError) {
                    console.log('No profile photo found, using default avatar');
                }
            }
            
            // Update profile data with retrieved information, handling NULL fields
            setProfileData(prev => ({
                ...prev,
                // Use basic user data for essential fields
                fullName: userData?.userName || prev.fullName,
                email: userData?.email || prev.email,
                
                // Use detailed profile data for additional fields with null handling
                gender: profileData?.gender || '',
                phone: profileData?.phoneNumber || '',
                bio: profileData?.bio || '',
                birthDate: profileData?.birthDate || '',
                // Add direct age field
                age: profileData?.age?.toString() || '',
                weight: profileData?.weight?.toString() || '',
                height: profileData?.height?.toString() || '',
                profileImage: photoUrl || prev.profileImage,
            }));
            
            // Store userName in localStorage for other components
            if (userData?.userName) {
                localStorage.setItem('userName', userData.userName);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load profile data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsLoading(true);
                
                // Create preview URL for immediate display
                const previewUrl = URL.createObjectURL(file);
                setProfileData(prev => ({
                    ...prev,
                    imageUrl: previewUrl
                }));

                // First upload to backend
                const formData = new FormData();
                formData.append('file', file);

                console.log('Uploading file:', file.name, 'size:', file.size);
                console.log('FormData entries:', Array.from(formData.entries()));

                const apiResponse = await fetchWithAuth(
                    API_ENDPOINTS.UPLOAD_PHOTO(localStorage.getItem('userId')),
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                if (!apiResponse) {
                    throw new Error('Failed to update profile photo');
                }

                // Then upload to Cloudinary for storage
                const cloudinaryUrl = await uploadToCloudinary(file);
                console.log('Cloudinary URL:', cloudinaryUrl);

                // Update profile data with Cloudinary URL
                setProfileData(prev => ({
                    ...prev,
                    profileImage: cloudinaryUrl
                }));

                toast.success('Profile photo updated successfully!');
            } catch (error) {
                toast.error(error.message || 'Failed to update profile photo');
                console.error('Error updating profile photo:', error);
                
                // Reset image on error
                setProfileData(prev => ({
                    ...prev,
                    imageUrl: prev.profileImage || null
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeletePhoto = async () => {
        try {
            setIsLoading(true);
            
            const response = await fetchWithAuth(
                API_ENDPOINTS.DELETE_PHOTO(localStorage.getItem('userId')),
                { method: 'DELETE' }
            );

            if (!response) {
                throw new Error('Failed to delete profile photo');
            }

            // Reset profile image
            setProfileData(prev => ({
                ...prev,
                profileImage: null,
                imageUrl: null
            }));

            toast.success('Profile photo deleted successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to delete profile photo');
            console.error('Error deleting profile photo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Create a complete profile data object with all required fields
            // Use empty strings or null for any missing values
            const completeProfileData = {
                Email: profileData.email,
                Age: profileData.age ? parseInt(profileData.age) : null,
                Gender: profileData.gender || "", // Required field - send empty string if null
                Weight: profileData.weight ? parseInt(profileData.weight) : null,
                Height: profileData.height ? parseInt(profileData.height) : null,
                PhoneNumber: profileData.phone || "", // Required field - send empty string if null
                Bio: profileData.bio || "", // Required field - send empty string if null
                ProfileImage: profileData.profileImage || null
            };
            
            console.log('Sending complete profile data with all required fields:', completeProfileData);
            
            // Post to Complete Profile endpoint
            const response = await fetchWithAuth(API_ENDPOINTS.COMPLETE_PROFILE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(completeProfileData)
            });
            
            console.log('Profile update response:', response);
            
            toast.success('Profile updated successfully!');
            setEditMode(false);
            
            // Refresh profile data after update
            setTimeout(() => {
                fetchUserProfile();
            }, 1000);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`profile-page ${isDarkMode ? 'dark' : ''}`}>
            <div className={`profile-container ${editMode ? 'edit-mode' : ''}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="profile-header"
                >
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            <img 
                                src={profileData.imageUrl || profileData.profileImage || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=random`} 
                                alt="Profile" 
                            />
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
                    <h1>{profileData.fullName}</h1>
                    <p>{profileData.email}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="profile-content"
                >
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Personal Information</h2>
                            {!editMode && (
                                <button 
                                    className="edit-button"
                                    onClick={() => setEditMode(true)}
                                >
                                    <FaUserEdit /> Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                                    <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                                    <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                                <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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

                            <div className="physical-info-section">
                                <h3>Physical Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Age</div>
                                        <input
                                            type="number"
                                            name="age"
                                            value={profileData.age}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="Enter age"
                                            min="0"
                                            max="120"
                                            step="1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Gender</div>
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Weight (kg)</div>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={profileData.weight}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="Enter weight"
                                            min="0"
                                            step="0.1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Height (cm)</div>
                                        <input
                                            type="number"
                                            name="height"
                                            value={profileData.height}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="Enter height"
                                            min="0"
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                            </div>

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
                    </div>
                </motion.div>

                <div className="emergency-contacts-section">
                    <div className="section-header">
                        <h2 className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Emergency Contacts</h2>
                        <Link to="/emergency-contacts" className="add-contacts-button">
                            <FaPlus /> Add Contacts
                        </Link>
                    </div>
                    <div className="contacts-card">
                        {profileData.emergencyContacts.length > 0 ? (
                            profileData.emergencyContacts.map((contact) => (
                                <div key={contact.Id} className="contact-item">
                                    <div className="contact-info">
                                        <div className="contact-name">
                                            <FaUser className="contact-icon" />
                                            <strong>{contact.Name}</strong>
                                        </div>
                                        <div className="contact-phone">
                                            <FaPhone className="contact-icon" />
                                            <span>{contact.Phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-contacts">
                                <FaUserPlus className="no-contacts-icon" />
                                <p>No emergency contacts added.</p>
                                <p>Add them in the Emergency Contacts section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;