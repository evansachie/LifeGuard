import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Contact, ContactFormData } from '../types/contact.types';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

export interface EmergencyContactsHookReturn {
  contacts: Contact[];
  contactsLoading: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
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
      
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Relationship: formData.relationship,
        Priority: formData.priority,
        Role: formData.role,
      };

      const endpoint = contactId 
        ? `${API_ENDPOINTS.EMERGENCY_CONTACTS}/${contactId}` 
        : API_ENDPOINTS.EMERGENCY_CONTACTS;
      
      const method = contactId ? 'PUT' : 'POST';
      
      const response = await fetchWithAuth(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
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
        method: 'DELETE'
      });
      
      setContacts(contacts.filter(c => c.Id !== contactId));
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
    try {
      await fetchWithAuth(API_ENDPOINTS.SEND_EMERGENCY_ALERT, {
        method: 'POST'
      });
      toast.success('Emergency alert sent to all contacts');
    } catch (error) {
      console.error('Failed to send emergency alert', error);
      toast.error('Failed to send emergency alert');
    }
  };

  const sendTestAlert = async (contactId: string): Promise<void> => {
    try {
      await fetchWithAuth(API_ENDPOINTS.SEND_TEST_ALERT(contactId), {
        method: 'POST'
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
    saveContact,
    deleteContact,
    sendEmergencyAlert,
    sendTestAlert
  };
};
