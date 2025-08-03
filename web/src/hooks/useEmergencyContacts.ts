import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Contact, ContactFormData } from '../types/contact.types';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { useEmergencyPreference } from '../contexts/EmergencyPreferenceContext';

export interface EmergencyContactsHookReturn {
  contacts: Contact[];
  contactsLoading: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isEmergencyAlertSending: boolean;
  saveContact: (formData: ContactFormData, contactId?: string) => Promise<boolean>;
  deleteContact: (contactId: string) => Promise<boolean>;
  sendEmergencyAlert: () => Promise<void>;
  sendTestAlert: (contactId: string) => Promise<void>;
}

export const useEmergencyContacts = (): EmergencyContactsHookReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEmergencyAlertSending, setIsEmergencyAlertSending] = useState<boolean>(false);
  const { preferences } = useEmergencyPreference();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.EMERGENCY_CONTACTS);

      if (response && Array.isArray(response)) {
        setContacts(response);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Failed to fetch emergency contacts', error);
      toast.error('Failed to load emergency contacts');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContact = async (formData: ContactFormData, contactId?: string): Promise<boolean> => {
    try {
      setIsSaving(true);

      await fetchContacts();

      toast.success(contactId ? 'Contact updated successfully' : 'Contact added successfully');
      return true;
    } catch (error) {
      console.error('Failed to save contact', error);
      toast.error('Failed to save contact');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContact = async (contactId: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await fetchWithAuth(`${API_ENDPOINTS.EMERGENCY_CONTACTS}/${contactId}`, {
        method: 'DELETE',
      });

      setContacts(contacts.filter((c) => c.Id !== contactId));
      toast.success('Contact deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete contact', error);
      toast.error('Failed to delete contact');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const sendEmergencyAlert = async (): Promise<void> => {
    setIsEmergencyAlertSending(true);
    try {
      // Create a list of recipients based on preferences
      const recipients: string[] = [];
      const emailAddresses: string[] = [];

      // Add emergency contacts if selected
      if (preferences.sendToEmergencyContacts && contacts.length > 0) {
        contacts.forEach((contact) => {
          recipients.push(contact.Name);
          emailAddresses.push(contact.Email);
        });
      }

      // Add ambulance service if selected
      if (preferences.sendToAmbulanceService) {
        recipients.push('Ambulance Service');
        emailAddresses.push('navarahq@gmail.com'); // Ambulance service email
      }

      // Check if we have any recipients
      if (emailAddresses.length === 0) {
        toast.warning('No emergency recipients configured. Please update your preferences.');
        return;
      }

      // Get current location for emergency alert
      let location = 'Location not available';
      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (error) => reject(error),
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              }
            );
          });

          const { latitude, longitude } = position.coords;
          location = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
          console.log('📍 Real location obtained for emergency:', { latitude, longitude });
        }
      } catch (geoError) {
        console.warn('⚠️ Could not get current location for emergency alert:', geoError);
        // Continue with default location message
      }

      // Send the emergency alert with recipients and location
      await fetchWithAuth(API_ENDPOINTS.SEND_EMERGENCY_ALERT, {
        method: 'POST',
        body: JSON.stringify({
          emailAddresses,
          location,
          message: 'Emergency alert triggered - immediate assistance needed',
        }),
      });

      toast.success(`Emergency alert sent to: ${recipients.join(', ')}`);
    } catch (error) {
      console.error('Failed to send emergency alert', error);
      toast.error('Failed to send emergency alert');
    } finally {
      setIsEmergencyAlertSending(false);
    }
  };
  const sendTestAlert = async (contactId: string): Promise<void> => {
    try {
      await fetchWithAuth(API_ENDPOINTS.SEND_TEST_ALERT(contactId), {
        method: 'POST',
      });
      toast.success('Test alert sent successfully');
    } catch (error) {
      console.error('Failed to send test alert', error);
      toast.error('Failed to send test alert');
    }
  };

  return {
    contacts,
    contactsLoading: isLoading,
    isLoading,
    isSaving,
    isDeleting,
    isEmergencyAlertSending,
    saveContact,
    deleteContact,
    sendEmergencyAlert,
    sendTestAlert,
  };
};
