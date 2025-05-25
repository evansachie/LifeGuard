import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS, fetchWithAuth } from '../utils/api';

interface EmergencyContact {
  Id: number;
  name: string;
  phoneNumber: string;
  relationship: string;
  email?: string;
  priority: number;
  [key: string]: any;
}

interface EmergencyContactFormData {
  name: string;
  phoneNumber: string;
  relationship: string;
  email?: string;
  priority: string | number;
}

interface EmergencyAlertData {
  message: string;
  location: string;
  medicalInfo: string;
}

interface AlertResponse {
  success: boolean;
  alertsSent?: Array<any>;
  message?: string;
}

interface EmergencyContactsReturn {
  contacts: EmergencyContact[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  fetchContacts: () => Promise<void>;
  saveContact: (formData: EmergencyContactFormData, editingContactId?: number | null) => Promise<boolean>;
  deleteContact: (contactId: number) => Promise<boolean>;
  sendEmergencyAlert: () => Promise<boolean>;
  sendTestAlert: (contactId: number) => Promise<boolean>;
  emergencyContacts: EmergencyContact[];
  contactsLoading: boolean;
}

export function useEmergencyContacts(): EmergencyContactsReturn {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchContacts();
    fetchEmergencyContacts();
  }, []);

  const fetchContacts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth<EmergencyContact[]>(API_ENDPOINTS.EMERGENCY_CONTACTS);
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmergencyContacts = async (): Promise<void> => {
    try {
      setContactsLoading(true);
      const data = await fetchWithAuth<EmergencyContact[]>(API_ENDPOINTS.EMERGENCY_CONTACTS);
      setEmergencyContacts(data);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  const saveContact = async (formData: EmergencyContactFormData, editingContactId: number | null = null): Promise<boolean> => {
    setIsSaving(true);
    try {
      const dataToSubmit = {
        ...formData,
        priority: parseInt(formData.priority.toString(), 10),
      };

      if (editingContactId) {
        const updatedContact = await fetchWithAuth<EmergencyContact>(
          `${API_ENDPOINTS.EMERGENCY_CONTACTS}/${editingContactId}`,
          {
            method: 'PUT',
            body: JSON.stringify(dataToSubmit),
          }
        );
        setContacts(
          contacts.map((contact) => (contact.Id === editingContactId ? updatedContact : contact))
        );
        toast.success('Contact updated successfully!');
      } else {
        const newContact = await fetchWithAuth<EmergencyContact>(API_ENDPOINTS.EMERGENCY_CONTACTS, {
          method: 'POST',
          body: JSON.stringify(dataToSubmit),
        });
        setContacts([...contacts, newContact]);
        toast.success('Contact added successfully!');
      }
      return true;
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContact = async (contactId: number): Promise<boolean> => {
    if (!contactId) {
      toast.error('Invalid contact ID');
      return false;
    }

    setIsDeleting(true);
    try {
      await fetchWithAuth(`${API_ENDPOINTS.EMERGENCY_CONTACTS}/${contactId}`, { method: 'DELETE' });
      setContacts((prevContacts) => prevContacts.filter((c) => c.Id !== contactId));
      toast.success('Contact deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const sendEmergencyAlert = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const alertData: EmergencyAlertData = {
        message: 'Emergency alert triggered from LifeGuard app',
        location: 'Unavailable',
        medicalInfo: 'Please contact immediately',
      };

      const response = await fetchWithAuth<AlertResponse>(API_ENDPOINTS.EMERGENCY_ALERTS, {
        method: 'POST',
        body: JSON.stringify(alertData),
      });

      if (response.success) {
        toast.success(`Emergency alerts sent to ${response.alertsSent?.length || 0} contacts!`);
        return true;
      } else {
        toast.error('Failed to send emergency alerts');
        return false;
      }
    } catch (error) {
      console.error('Error sending emergency alerts:', error);
      toast.error('Failed to send emergency alerts');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestAlert = async (contactId: number): Promise<boolean> => {
    try {
      const response = await fetchWithAuth<AlertResponse>(API_ENDPOINTS.EMERGENCY_TEST_ALERT(contactId.toString()), {
        method: 'POST',
      });

      if (response.success) {
        toast.success('Test alert sent successfully!');
        return true;
      } else {
        toast.error('Failed to send test alert');
        return false;
      }
    } catch (error) {
      console.error('Error sending test alert:', error);
      toast.error('Failed to send test alert');
      return false;
    }
  };

  return {
    contacts,
    isLoading,
    isSaving,
    isDeleting,
    fetchContacts,
    saveContact,
    deleteContact,
    sendEmergencyAlert,
    sendTestAlert,
    emergencyContacts,
    contactsLoading,
  };
}
