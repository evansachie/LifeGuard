import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useEmergencyContacts } from '../../hooks/useEmergencyContacts';
import PageHeader from '../../components/EmergencyContacts/PageHeader';
import ContactList from '../../components/EmergencyContacts/ContactList';
import ContactForm from '../../components/EmergencyContacts/ContactForm';
import { Contact, ContactFormData } from '../../types/contact.types';

interface EmergencyContactsProps {
  isDarkMode: boolean;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const {
    contacts,
    isLoading,
    isSaving,
    isDeleting,
    saveContact,
    deleteContact,
    sendEmergencyAlert,
    sendTestAlert,
  } = useEmergencyContacts();

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
    setDeleteModalOpen(true);
  };

  const handleSubmitContact = async (formData: ContactFormData): Promise<void> => {
    const success = await saveContact(formData, editingContact?.Id);
    if (success) {
      handleCloseModal();
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deletingContact?.Id) return;

    const success = await deleteContact(deletingContact.Id);
    if (success) {
      setDeleteModalOpen(false);
      setDeletingContact(null);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      <PageHeader
        onAddClick={handleOpenAddModal}
        onEmergencyAlert={sendEmergencyAlert}
        isDarkMode={isDarkMode}
      />

      <ContactList
        contacts={contacts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSendTestAlert={sendTestAlert}
        isDarkMode={isDarkMode}
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <ContactForm
              contact={editingContact}
              onSubmit={handleSubmitContact}
              onCancel={handleCloseModal}
              isSaving={isSaving}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact?"
        itemName={deletingContact?.Name}
        isLoading={isDeleting}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default EmergencyContacts;
