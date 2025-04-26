import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';

const MobileMenuToggle = ({ isOpen, toggleMenu }) => {
  return (
    <AccessibleDropdown
      isOpen={isOpen}
      onToggle={toggleMenu}
      ariaLabel={isOpen ? 'Close menu' : 'Open menu'}
      className="mobile-menu-toggle"
    >
      {isOpen ? <FaTimes /> : <FaBars />}
    </AccessibleDropdown>
  );
};

export default MobileMenuToggle;
