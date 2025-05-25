import React from 'react';

interface AccessibleDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({ isOpen, onToggle, ariaLabel, className, children }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle();
      e.preventDefault();
    }
  };

  return (
    <button
      className={className}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

export default AccessibleDropdown;
