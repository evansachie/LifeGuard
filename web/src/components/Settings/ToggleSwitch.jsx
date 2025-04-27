import React from 'react';

const ToggleSwitch = ({ enabled, onChange, isDarkMode }) => (
  <button
    onClick={() => onChange(!enabled)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onChange(!enabled);
      }
    }}
    role="switch"
    aria-checked={enabled}
    className={`relative inline-flex h-7 w-14 items-center rounded-full cursor-pointer transition-all duration-300 ${
      enabled
        ? 'bg-blue-500 shadow-inner shadow-blue-600/50'
        : isDarkMode
          ? 'bg-gray-600'
          : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
        enabled ? 'translate-x-8' : 'translate-x-1'
      }`}
    />
  </button>
);

export default ToggleSwitch;
