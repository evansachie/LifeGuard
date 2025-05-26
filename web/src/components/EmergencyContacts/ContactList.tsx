import React from 'react';
import { AnimatePresence } from 'framer-motion';
import EmptyState from '../../assets/empty-state.svg';
import Spinner from '../Spinner/Spinner';
import ContactCard from './ContactCard';
import { Contact } from '../../types/contact.types';

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onSendTestAlert: (contactId: string) => void;
  isDarkMode?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  onEdit,
  onDelete,
  onSendTestAlert,
  isDarkMode = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color={isDarkMode ? '#fff' : '#4285F4'} />
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <img src={EmptyState} alt="No contacts" className="w-64 mb-4" />
        <p className="text-lg text-gray-500">No emergency contacts added yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.Id}
            contact={contact}
            onEdit={onEdit}
            onDelete={onDelete}
            onSendTestAlert={onSendTestAlert}
            isDarkMode={isDarkMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ContactList;