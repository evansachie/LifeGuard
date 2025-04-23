import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

import { useEmergencyContacts } from '../../hooks/useEmergencyContacts';

import PageHeader from '../../components/EmergencyContacts/PageHeader';
import ContactList from '../../components/EmergencyContacts/ContactList';
import ContactForm from '../../components/EmergencyContacts/ContactForm';

function EmergencyContacts({ isDarkMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);

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

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleDelete = (contact) => {
    setDeletingContact(contact);
    setDeleteModalOpen(true);
  };

  const handleSubmitContact = async (formData) => {
    const success = await saveContact(formData, editingContact?.Id);
    if (success) {
      handleCloseModal();
    }
  };

  const confirmDelete = async () => {
    if (!deletingContact?.Id) return;

    const success = await deleteContact(deletingContact.Id);
    if (success) {
      setDeleteModalOpen(false);
      setDeletingContact(null);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      <PageHeader onAddClick={handleOpenAddModal} onEmergencyAlert={sendEmergencyAlert} />

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
}

export default EmergencyContacts;
