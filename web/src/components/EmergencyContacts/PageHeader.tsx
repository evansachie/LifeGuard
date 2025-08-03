import { FaUserPlus, FaCog } from 'react-icons/fa';
import { MdOutlineContactEmergency } from 'react-icons/md';
import EmergencyButton from './EmergencyButton';

interface PageHeaderProps {
  onAddClick: () => void;
  onEmergencyAlert: () => void;
  onOpenPreferences: () => void; // Added this prop
  isDarkMode?: boolean;
  isEmergencyAlertSending?: boolean;
}

const PageHeader = ({
  onAddClick,
  onEmergencyAlert,
  onOpenPreferences, // Added this prop
  isDarkMode = false,
  isEmergencyAlertSending = false,
}: PageHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MdOutlineContactEmergency
            className={`text-3xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          />
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Emergency Contacts
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPreferences}
            className={`p-2 rounded-full flex items-center justify-center
              ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title="Emergency Alert Settings"
          >
            <FaCog />
          </button>
          <EmergencyButton
            onClick={onEmergencyAlert}
            isDarkMode={isDarkMode}
            isLoading={isEmergencyAlertSending}
          />
        </div>
      </div>

      <button
        onClick={onAddClick}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg 
          bg-custom-blue text-white hover:bg-custom-blue-hover transition-colors
          ${isDarkMode ? 'shadow-dark' : 'shadow-sm'}`}
        aria-label="Add new contact"
      >
        <FaUserPlus />
        <span>Add Contact</span>
      </button>
    </>
  );
};

export default PageHeader;
