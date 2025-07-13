import React from 'react';
import { motion } from 'framer-motion';
import { useEmergencyPreference } from '../../contexts/EmergencyPreferenceContext';
import { FormGroup, Checkbox, Button } from '@mui/material';

interface EmergencyPreferenceModalProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const EmergencyPreferenceModal: React.FC<EmergencyPreferenceModalProps> = ({
  onClose,
  isDarkMode,
}) => {
  const { preferences, updatePreferences } = useEmergencyPreference();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    updatePreferences({ [name]: checked });
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`w-full max-w-md p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
    >
      <h2 className="text-xl font-bold mb-4">Emergency Alert Settings</h2>
      <p className="text-sm mb-4">Configure who should receive emergency alerts when triggered.</p>

      <FormGroup>
        <div className="flex items-center mb-3">
          <Checkbox
            checked={preferences.sendToEmergencyContacts}
            onChange={handleCheckboxChange}
            name="sendToEmergencyContacts"
            color="primary"
            className={isDarkMode ? 'text-white' : ''}
          />
          <div className={`ml-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Send to my emergency contacts
          </div>
        </div>

        <div className="flex items-center mb-3">
          <Checkbox
            checked={preferences.sendToAmbulanceService}
            onChange={handleCheckboxChange}
            name="sendToAmbulanceService"
            color="primary"
            className={isDarkMode ? 'text-white' : ''}
          />
          <div className={`ml-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Send to ambulance service
          </div>
        </div>
      </FormGroup>

      <p className="text-sm mt-4 mb-6 text-gray-500">
        These settings determine who receives emergency alerts when your health metrics indicate an
        emergency situation.
      </p>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: isDarkMode ? 'white' : 'inherit',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'inherit',
          }}
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default EmergencyPreferenceModal;
