import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <button className="logout-button" onClick={onLogout}>
      <FaSignOutAlt />
      <span>Log Out</span>
    </button>
  );
};

export default LogoutButton;
