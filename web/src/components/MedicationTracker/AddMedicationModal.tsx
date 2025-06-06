import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMedicationForm from './AddMedicationForm';
import { Medication, MedicationData } from '../../types/medicationTracker.types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationData) => Promise<void>;
  editingMedication?: Medication | null;
  isDarkMode: boolean;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMedication,
  isDarkMode,
}) => {
  const isEditing = !!editingMedication;
  const title = isEditing ? `Edit ${editingMedication.Name}` : 'Add New Medication';

  const handleSubmit = async (data: MedicationData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className={`w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl 
                ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`sticky top-0 px-6 py-4 border-b ${
                  isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
                } bg-opacity-80 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className={`rounded-full p-2 hover:bg-opacity-10 
                      ${isDarkMode ? 'hover:bg-white' : 'hover:bg-black'}`}
                    type="button"
                    aria-label={`Close ${isEditing ? 'edit' : 'add'} medication modal`}
                    title="Close"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                <div className="p-6">
                  <AddMedicationForm
                    initialData={editingMedication}
                    onSubmit={handleSubmit}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddMedicationModal;
