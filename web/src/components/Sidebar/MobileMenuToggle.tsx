import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';

interface MobileMenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, toggleMenu }) => {
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
