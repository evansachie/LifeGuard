import React from 'react';
import { FaUser, FaPhone, FaPlus, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';

function EmergencyContactsSection({ contactsLoading, emergencyContacts, isDarkMode }) {
  return (
    <div className="emergency-contacts-section">
      <div className="section-header">
        <h2 className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Emergency Contacts</h2>
        <Link to="/emergency-contacts" className="add-contacts-button">
          <FaPlus /> Add Contacts
        </Link>
      </div>
      <div className="contacts-card">
        {contactsLoading ? (
          <div className="contacts-loading-container">
            <Spinner size="large" />
            <p>Loading emergency contacts...</p>
          </div>
        ) : emergencyContacts.length > 0 ? (
          emergencyContacts.map((contact) => (
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
  );
}

export default EmergencyContactsSection;
