import { FaUserPlus } from 'react-icons/fa';
import { MdOutlineContactEmergency } from 'react-icons/md';
import EmergencyButton from './EmergencyButton';

interface PageHeaderProps {
  onAddClick: () => void;
  onEmergencyAlert: () => void;
  isDarkMode?: boolean;
}

const PageHeader = ({ onAddClick, onEmergencyAlert, isDarkMode = false }: PageHeaderProps) => {
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
        <EmergencyButton onClick={onEmergencyAlert} isDarkMode={isDarkMode} />
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
