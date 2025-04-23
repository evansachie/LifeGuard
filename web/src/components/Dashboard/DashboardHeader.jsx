import React from 'react';

const DashboardHeader = ({ userData, dataLoading }) => {
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    // If it's an email, show just the first part
    if (fullName.includes('@')) {
      return (
        fullName.split('@')[0].charAt(0).toUpperCase() +
        fullName.split('@')[0].slice(1).toLowerCase()
      );
    }
    // If it's a full name, show just the first name
    return (
      fullName.split(' ')[0].charAt(0).toUpperCase() + fullName.split(' ')[0].slice(1).toLowerCase()
    );
  };

  const handleCommandPaletteOpen = () => {
    // Create and dispatch a custom event to open the command palette
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="dashboard-header flex justify-between items-center">
      <div>
        <h1>Hello, {dataLoading ? '...' : getFirstName(userData?.userName)}!</h1>
        <p className="date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <p className="command-hint">
        ⌘ + K or click{' '}
        <span
          onClick={handleCommandPaletteOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCommandPaletteOpen();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Open command menu"
        >
          here
        </span>{' '}
        to open command menu
      </p>
    </header>
  );
};

export default DashboardHeader;
