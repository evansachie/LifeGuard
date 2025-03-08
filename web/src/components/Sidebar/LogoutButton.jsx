import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="logout-button" onClick={onLogout}>
      <FaSignOutAlt />
      <span>Log Out</span>
    </button>
  );
};

export default LogoutButton;
