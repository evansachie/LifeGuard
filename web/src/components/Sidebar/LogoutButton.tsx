import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button className="logout-button" onClick={onLogout}>
      <FaSignOutAlt />
      <span>Log Out</span>
    </button>
  );
};

export default LogoutButton;
