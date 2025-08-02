import { FaBell } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface EmergencyButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
  isLoading?: boolean;
}

const EmergencyButton = ({
  onClick,
  disabled = false,
  isDarkMode = false,
  isLoading = false,
}: EmergencyButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-4 py-2 ${
        isDisabled ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
      } 
        text-white rounded-lg transition-colors
        ${isDarkMode ? 'shadow-dark' : 'shadow-sm'}`}
      aria-label={isLoading ? 'Sending emergency alert...' : 'Send emergency alert'}
    >
      {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaBell />}
      <span>{isLoading ? 'Sending Alert...' : 'Emergency Alert'}</span>
    </button>
  );
};

export default EmergencyButton;
