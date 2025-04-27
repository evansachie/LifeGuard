import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';

const NavigationLinks = ({ navItems, onNavLinkClick }) => {
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const location = useLocation();

  const renderNavLink = (item) => (
    <Link
      to={item.path}
      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
      onClick={() => onNavLinkClick && onNavLinkClick()}
    >
      <span className="nav-icon">{item.icon}</span>
      <span className="nav-label">{item.label}</span>
    </Link>
  );

  const toggleDropdown = () => {
    setIsActivityDropdownOpen(!isActivityDropdownOpen);
  };

  return (
    <nav className="sidebar-nav">
      {navItems.map((item, index) => (
        <div key={index}>
          {item.subItems ? (
            <>
              <AccessibleDropdown
                isOpen={isActivityDropdownOpen}
                onToggle={toggleDropdown}
                ariaLabel={`${item.label} submenu, ${isActivityDropdownOpen ? 'expanded' : 'collapsed'}`}
                className={`nav-link ${isActivityDropdownOpen ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </AccessibleDropdown>
              {isActivityDropdownOpen && (
                <div className="subnav">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                      onClick={() => onNavLinkClick && onNavLinkClick()}
                    >
                      <span className="nav-icon">{subItem.icon}</span>
                      <span className="nav-label">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            renderNavLink(item)
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavigationLinks;
