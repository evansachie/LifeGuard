import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface EmergencyPreferences {
  sendToEmergencyContacts: boolean;
  sendToAmbulanceService: boolean;
}

interface EmergencyPreferenceContextType {
  preferences: EmergencyPreferences;
  updatePreferences: (newPreferences: Partial<EmergencyPreferences>) => void;
}

const defaultPreferences: EmergencyPreferences = {
  sendToEmergencyContacts: true,
  sendToAmbulanceService: false,
};

const EmergencyPreferenceContext = createContext<EmergencyPreferenceContextType | undefined>(
  undefined
);

interface EmergencyPreferenceProviderProps {
  children: ReactNode;
}

export const EmergencyPreferenceProvider = ({ children }: EmergencyPreferenceProviderProps) => {
  const [preferences, setPreferences] = useState<EmergencyPreferences>(() => {
    // Try to load from localStorage
    const savedPreferences = localStorage.getItem('emergencyPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('emergencyPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<EmergencyPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <EmergencyPreferenceContext.Provider
      value={{
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </EmergencyPreferenceContext.Provider>
  );
};

export const useEmergencyPreference = (): EmergencyPreferenceContextType => {
  const context = useContext(EmergencyPreferenceContext);
  if (context === undefined) {
    throw new Error('useEmergencyPreference must be used within an EmergencyPreferenceProvider');
  }
  return context;
};

export default EmergencyPreferenceContext;
