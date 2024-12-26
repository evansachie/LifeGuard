import * as React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Profile.css';
import { FaUserEdit, FaUpload, FaTimesCircle, FaSave } from 'react-icons/fa';

function Profile() {
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    const [error, setError] = useState('');

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { username, email, profilePictureUrl } = response.data;
            setUserDetails({ username, email, profilePictureUrl });
            setFormData({ username, email });
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Failed to fetch user details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleChangePasswordClick = () => {
        setIsPasswordChange(true);
        setEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (isPasswordChange) {
                const { currentPassword, newPassword } = formData;
                const response = await axios.put(
                    'https://lighthouse-portal.onrender.com/api/users/change-password',
                    { currentPassword, newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert(response.data.message || 'Password changed successfully');
                setFormData({ username: userDetails.username, email: userDetails.email });
                setIsPasswordChange(false);
                setEditMode(false);
            } else {
                const { username, email } = formData;
                const formDataObj = new FormData();
                formDataObj.append('username', username);
                formDataObj.append('email', email);
                if (profilePicture) {
                    setImageUploadLoading(true);
                    formDataObj.append('profilePicture', profilePicture);
                }

                const response = await axios.put('https://lighthouse-portal.onrender.com/api/users/details', formDataObj, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data) {
                    setUserDetails((prevUserDetails) => ({
                        ...prevUserDetails,
                        ...response.data,
                        profilePictureUrl: response.data.profilepic,
                    }));
                    setEditMode(false);
                    setShowUploadModal(false);
                    setProfilePicture(null);
                } else {
                    throw new Error('Failed to update user details');
                }
                setImageUploadLoading(false);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            setError(error.response?.data?.error || 'An error occurred. Please try again.');
            setImageUploadLoading(false) // In case of an error
        }
    };

    const handleCancelPasswordChange = () => {
        setIsPasswordChange(false);
        setEditMode(false);
    };

    const handleUploadPictureClick = () => {
        setShowUploadModal(true);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
        setProfilePicture(null);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>Your Profile</h1>
                </div>
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading app...</p>
                    </div>
                ) : (
                    <div className="profile-content">
                        <div className="profile-info">
                            <h2>Personal Information</h2>
                            {error && <p className="error-message">{error}</p>}
                            {editMode ? (
                                <form onSubmit={handleSubmit} className="profile-form">
                                    {isPasswordChange ? (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="currentPassword">Current Password:</label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    value={formData.currentPassword || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="newPassword">New Password:</label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={formData.newPassword || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="username">Username:</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={formData.username || userDetails.username}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="profilePicture">Profile Picture:</label>
                                                <input
                                                    type="file"
                                                    id="profilePicture"
                                                    name="profilePicture"
                                                    accept="image/*"
                                                    onChange={handleProfilePictureChange}
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="form-actions">
                                        <button type="submit" className="save-button" disabled={imageUploadLoading}>
                                            {imageUploadLoading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    Saving..
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave/> Save
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={handleCancelPasswordChange}
                                            disabled={imageUploadLoading}
                                        >
                                            <FaTimesCircle/> Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p>Username: {userDetails.username}</p>
                                    <p>Email: {userDetails.email}</p>
                                    <button className="edit-button" onClick={() => setEditMode(true)}>
                                        <FaUserEdit/> Edit
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="profile-settings">
                            <h2>Account Settings</h2>
                            <button onClick={handleChangePasswordClick} className="change-password-button">
                                Change Password
                            </button>
                            <button onClick={handleUploadPictureClick} className="upload-picture-button">
                                <FaUpload/> Update Profile Picture
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                isOpen={showUploadModal}
                onRequestClose={handleCloseModal}
                contentLabel="Upload Profile Picture"
                className="upload-modal"
                overlayClassName="upload-modal-overlay"
            >
                <h2>Upload Profile Picture</h2>
                {imageUploadLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Uploading image...</p>
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSubmit} className="upload-picture-button">
                                <FaUpload/> Upload Picture
                            </button>
                            <button onClick={handleCloseModal} className="cancel-button">
                                <FaTimesCircle/> Cancel
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default Profile;