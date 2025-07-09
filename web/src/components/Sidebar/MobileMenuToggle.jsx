import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const MobileMenuToggle = ({ isOpen, toggleMenu }) => {
  return (
    <div className="mobile-menu-toggle" onClick={toggleMenu}>
      {isOpen ? <FaTimes /> : <FaBars />}
    </div>
  );
};

export default MobileMenuToggle;
