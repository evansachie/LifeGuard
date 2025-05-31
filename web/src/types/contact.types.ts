export interface Contact {
  Id: string;
  Name: string;
  Email: string;
  Phone: string;
  Relationship: string;
  Role: string;
  Priority: number;
  IsVerified: boolean;
  UserId?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  priority: number;
  role: string;
}

export interface EmergencyContactsState {
  contacts: Contact[];
  filteredContacts: Contact[];
  selectedContact: Contact | null;
  isModalOpen: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchQuery: string;
  filter: string;
  sortBy: 'name' | 'priority';
}

export interface EmergencyContactsHookReturn {
  contacts: Contact[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  saveContact: (formData: ContactFormData, contactId?: string) => Promise<boolean>;
  deleteContact: (contactId: string) => Promise<boolean>;
  sendEmergencyAlert: () => Promise<void>;
  sendTestAlert: (contactId: string) => Promise<void>;
}
