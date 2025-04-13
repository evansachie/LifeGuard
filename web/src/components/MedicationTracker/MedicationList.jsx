import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import NoMedsIcon from '../../assets/no-meds.svg';
import MedicationCard from './MedicationCard';

const MedicationList = ({ medications, loading, onTrackDose, onEdit, onDelete, isDarkMode }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!medications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img src={NoMedsIcon} alt="No medications" className="w-64 h-64 mb-6" />
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          No Medications Added
        </h3>
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Start by adding your medications using the form on the right
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {medications.map((medication, index) => (
          <MedicationCard
            key={medication.Id}
            medication={medication}
            onTrackDose={onTrackDose}
            onEdit={onEdit}
            onDelete={onDelete}
            isDarkMode={isDarkMode}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MedicationList;
