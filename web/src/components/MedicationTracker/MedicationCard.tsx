import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { MedicationCardProps } from '../../types/medicationTracker.types';

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onTrackDose,
  onEdit,
  onDelete,
  isDarkMode,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-lg border ${
        isDarkMode
          ? 'border-gray-700 hover:border-gray-600 bg-dark-card'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } transition-all shadow-lg hover:shadow-xl`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div>
            <h3
              className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
            >
              {medication.Name}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {medication.Dosage}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {medication.Time.map((time, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-black text-gray-300' : 'bg-blue-100 text-blue-800'
                }`}
              >
                <FaClock className="mr-1" />
                {time}
              </span>
            ))}
          </div>

          {medication.Notes && (
            <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {medication.Notes}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTrackDose(medication.Id, true)}
              disabled={!medication.Active}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                medication.Active
                  ? isDarkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaCheck />
              Taken
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTrackDose(medication.Id, false)}
              disabled={!medication.Active}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                medication.Active
                  ? isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaTimes />
              Missed
            </motion.button>
          </div>

          <div className="flex gap-4 mb-2 py-2 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(medication)}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <FaEdit />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(medication)}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'bg-red-900/50 hover:bg-red-900 text-red-200'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              <FaTrash />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationCard;
