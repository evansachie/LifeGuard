import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserEdit, FaSave, FaTimesCircle, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile({ isDarkMode }) {
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        age: '',
        weight: '',
        height: '',
        gender: '',
        emergencyContacts: []
    });
    const [imageFile, setImageFile] = useState(null);
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
    }, []);

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

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const imageUrl = URL.createObjectURL(file);
            setProfileData(prev => ({
                ...prev,
                imageUrl
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Frontend only - simulate API call
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setEditMode(false);
        }, 1000);
    };

    return (
        <div className={`profile-page ${isDarkMode ? 'dark' : ''}`}>
            <div className="profile-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="profile-header"
                >
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            <img 
                                src={profileData.imageUrl || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=random`} 
                                alt="Profile" 
                            />
                        </div>
                        <button 
                            className="edit-image-button"
                            onClick={handleImageClick}
                        >
                            <FaCamera />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
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
                                    <label>
                                        <FaUser /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FaEnvelope /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FaPhone /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FaMapMarkerAlt /> Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter location"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Bio</label>
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
                                        <label>Age</label>
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={profileData.birthDate}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Gender</label>
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
                                        <label>Weight (kg)</label>
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
                                        <label>Height (cm)</label>
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
                                    <button type="submit" className="save-button">
                                        <FaSave /> Save Changes
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => setEditMode(false)}
                                    >
                                        <FaTimesCircle /> Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>

                <div className="emergency-contacts-section">
                    <h3>Emergency Contacts</h3>
                    <div className="contacts-list">
                        {profileData.emergencyContacts.length > 0 ? (
                            profileData.emergencyContacts.map((contact, index) => (
                                <div key={index} className="contact-item">
                                    <div className="contact-info">
                                        <strong>{contact.name}</strong>
                                        <span>{contact.phone}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-contacts">No emergency contacts added. Add them in the Emergency Contacts section.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;