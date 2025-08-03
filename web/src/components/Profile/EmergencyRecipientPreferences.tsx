import React from 'react';
import { useEmergencyPreference } from '../../contexts/EmergencyPreferenceContext';
import { FormGroup, Checkbox } from '@mui/material';

interface EmergencyRecipientPreferencesProps {
  isDarkMode: boolean;
}

const EmergencyRecipientPreferences = ({ isDarkMode }: EmergencyRecipientPreferencesProps) => {
  const { preferences, updatePreferences } = useEmergencyPreference();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    updatePreferences({ [name]: checked });
  };

  return (
    <div className="emergency-preferences-container">
      <h3>Emergency Alert Recipients</h3>
      <FormGroup>
        <div className="flex items-center mb-2">
          <Checkbox
            checked={preferences.sendToEmergencyContacts}
            onChange={handleCheckboxChange}
            name="sendToEmergencyContacts"
            color="primary"
          />
          <div className="ml-2">Send to my emergency contacts</div>
        </div>

        <div className="flex items-center mb-2">
          <Checkbox
            checked={preferences.sendToAmbulanceService}
            onChange={handleCheckboxChange}
            name="sendToAmbulanceService"
            color="primary"
          />
          <div className="ml-2">Send to ambulance service</div>
        </div>
      </FormGroup>
      <p className="preferences-info">
        These settings determine who receives emergency alerts when your health metrics indicate an
        emergency situation.
      </p>
      <div className={isDarkMode ? 'text-gray-300 text-xs mt-2' : 'text-gray-600 text-xs mt-2'}>
        Ambulance service email: navarahq@gmail.com
      </div>
    </div>
  );
};

export default EmergencyRecipientPreferences;
