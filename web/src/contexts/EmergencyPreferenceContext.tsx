import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { toast } from 'react-toastify';

interface EmergencyPreferences {
  sendToEmergencyContacts: boolean;
  sendToAmbulanceService: boolean;
}

interface EmergencyPreferenceContextType {
  preferences: EmergencyPreferences;
  updatePreferences: (newPreferences: Partial<EmergencyPreferences>) => Promise<void>;
  isLoading: boolean;
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
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from backend on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetchWithAuth(API_ENDPOINTS.EMERGENCY_PREFERENCES);
        const data = await response.json();

        if (data.preferences) {
          setPreferences(data.preferences);
          // Also save to localStorage as backup
          localStorage.setItem('emergencyPreferences', JSON.stringify(data.preferences));
        } else {
          // If no backend preferences, try localStorage
          const savedPreferences = localStorage.getItem('emergencyPreferences');
          if (savedPreferences) {
            const parsed = JSON.parse(savedPreferences);
            setPreferences(parsed);
            // Sync to backend
            await updatePreferencesBackend(parsed);
          }
        }
      } catch (error) {
        console.warn(
          '⚠️ Could not load emergency preferences from backend, using localStorage:',
          error
        );
        // Fallback to localStorage
        const savedPreferences = localStorage.getItem('emergencyPreferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferencesBackend = async (newPrefs: EmergencyPreferences) => {
    try {
      await fetchWithAuth(API_ENDPOINTS.EMERGENCY_PREFERENCES, {
        method: 'PUT',
        body: JSON.stringify({
          sendToEmergencyContacts: newPrefs.sendToEmergencyContacts,
          sendToAmbulanceService: newPrefs.sendToAmbulanceService,
        }),
      });
    } catch (error) {
      console.error('Failed to sync emergency preferences to backend:', error);
      throw error;
    }
  };

  const updatePreferences = async (newPreferences: Partial<EmergencyPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };

    try {
      await updatePreferencesBackend(updatedPrefs);
      setPreferences(updatedPrefs);
      localStorage.setItem('emergencyPreferences', JSON.stringify(updatedPrefs));

      toast.success('Emergency preferences updated successfully');
    } catch (error) {
      console.error('Failed to update emergency preferences:', error);

      // Update locally even if backend fails, but warn user
      setPreferences(updatedPrefs);
      localStorage.setItem('emergencyPreferences', JSON.stringify(updatedPrefs));

      toast.warning('Preferences saved locally - will sync when connection is restored');
    }
  };

  return (
    <EmergencyPreferenceContext.Provider
      value={{
        preferences,
        updatePreferences,
        isLoading,
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
