import { FaUser, FaPhone, FaPlus, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';

interface EmergencyContact {
  Id: number;
  Name: string;
  Phone: string;
}

interface EmergencyContactsSectionProps {
  contactsLoading: boolean;
  emergencyContacts: EmergencyContact[];
  isDarkMode: boolean;
}

const EmergencyContactsSection = ({
  contactsLoading,
  emergencyContacts,
  isDarkMode,
}: EmergencyContactsSectionProps) => {
  return (
    <div className={`emergency-contacts-section ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="section-header">
        <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Contacts</h2>
        <Link
          to="/emergency-contacts"
          className={`add-contacts-button ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
        >
          <FaPlus /> Add Contacts
        </Link>
      </div>
      <div
        className={`contacts-card ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-lg p-4`}
      >
        {contactsLoading ? (
          <div
            className={`contacts-loading-container flex flex-col items-center justify-center py-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Spinner size="large" />
            <p className="mt-4">Loading emergency contacts...</p>
          </div>
        ) : emergencyContacts.length > 0 ? (
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.Id}
                className={`contact-item ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                } border rounded-lg p-4`}
              >
                <div className="contact-info">
                  <div
                    className={`contact-name flex items-center gap-2 mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <FaUser
                      className={`contact-icon ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    />
                    <strong>{contact.Name}</strong>
                  </div>
                  <div
                    className={`contact-phone flex items-center gap-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    <FaPhone
                      className={`contact-icon ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    />
                    <span>{contact.Phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`no-contacts flex flex-col items-center justify-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <FaUserPlus
              className={`no-contacts-icon text-4xl mb-4 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <p className="text-center mb-2">No emergency contacts added.</p>
            <p className="text-center text-sm">Add them in the Emergency Contacts section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContactsSection;
