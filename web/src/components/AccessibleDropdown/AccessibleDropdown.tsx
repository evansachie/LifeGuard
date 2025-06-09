import React from 'react';
import { ariaExpanded } from '../../utils/accessibilityUtils';

interface AccessibleDropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  onToggle: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

const AccessibleDropdown = ({
  isOpen,
  onToggle,
  ariaLabel,
  className,
  children,
  ...restProps
}: AccessibleDropdownProps) => {
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
      {...ariaExpanded(isOpen)}
      aria-haspopup="true"
      aria-label={ariaLabel}
      type="button"
      {...restProps}
    >
      {children}
    </button>
  );
};

export default AccessibleDropdown;
