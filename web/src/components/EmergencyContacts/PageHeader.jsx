import React from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { MdOutlineContactEmergency } from 'react-icons/md';
import EmergencyButton from './EmergencyButton';

const PageHeader = ({ onAddClick, onEmergencyAlert }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MdOutlineContactEmergency className="text-3xl" />
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        </div>
        <EmergencyButton onClick={onEmergencyAlert} />
      </div>

      <button
        onClick={onAddClick}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-blue text-white hover:bg-custom-blue-hover"
      >
        <FaUserPlus />
        <span>Add Contact</span>
      </button>
    </>
  );
};

export default PageHeader;
