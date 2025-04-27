const AccessibleDropdown = ({ isOpen, onToggle, ariaLabel, className, children }) => {
  const handleKeyDown = (e) => {
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
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

export default AccessibleDropdown;
