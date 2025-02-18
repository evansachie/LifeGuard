import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaBell } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { toast } from 'react-toastify';
import { API_ENDPOINTS, fetchWithAuth } from '../../utils/api';
import Spinner from '../../components/Spinner/Spinner';
import EmptyState from '../../assets/empty-state.svg';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

function EmergencyContacts({ isDarkMode }) {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.EMERGENCY_CONTACTS);
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const phoneRegex = /^\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingContact) {
        const updatedContact = await fetchWithAuth(
          `${API_ENDPOINTS.EMERGENCY_CONTACTS}/${editingContact.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(formData)
          }
        );
        setContacts(contacts.map(contact =>
          contact.id === editingContact.id ? updatedContact : contact
        ));
        toast.success('Contact updated successfully!');
      } else {
        const newContact = await fetchWithAuth(
          API_ENDPOINTS.EMERGENCY_CONTACTS,
          {
            method: 'POST',
            body: JSON.stringify(formData)
          }
        );
        setContacts([...contacts, newContact]);
        toast.success('Contact added successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle emergency alert
  const handleEmergencyAlert = () => {
    // Mock API call to send emergency alerts
    contacts.forEach(contact => {
      console.log(`Sending emergency alert to ${contact.name} at ${contact.phone} and ${contact.email}`);
    });
    toast.info('Emergency alerts sent to all contacts!', {
      icon: <IoMdAlert className="text-red-500" />
    });
  };

  // Reset form and close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: ''
    });
    setErrors({});
  };

  // Open edit modal with contact data
  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setIsModalOpen(true);
  };

  // Delete contact with confirmation
  const handleDelete = (contact) => {
    setDeletingContact(contact);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingContact) return;
    
    setIsDeleting(true);
    try {
        await fetchWithAuth(
            `${API_ENDPOINTS.EMERGENCY_CONTACTS}/${deletingContact.id}`,
            { method: 'DELETE' }
        );
        setContacts(contacts.filter(c => c.id !== deletingContact.id));
        toast.success('Contact deleted successfully!');
        setDeleteModalOpen(false);
    } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
    } finally {
        setIsDeleting(false);
        setDeletingContact(null);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold mb-4">Emergency Contacts</h1>
        </div>
        <button
          onClick={handleEmergencyAlert}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaBell />
          <span>Emergency Alert</span>
        </button>
      </div>

      {/* Add Contact Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
          isDarkMode 
            ? 'bg-custom-blue text-white hover:bg-custom-blue-hover' 
            : 'bg-custom-blue text-white hover:bg-custom-blue-hover'
        }`}
      >
        <FaUserPlus />
        <span>Add Contact</span>
      </button>

      {/* Loading and Empty State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" color={isDarkMode ? '#fff' : '#4285F4'} />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <img src={EmptyState} alt="No contacts" className="w-64 mb-4" />
          <p className="text-lg text-gray-500">No emergency contacts added yet</p>
        </div>
      ) : (
        /* Contacts Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map(contact => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-6 rounded-lg shadow-lg ${
                isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{contact.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contact.relationship}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className={`p-2 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(contact)}
                    className={`p-2 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <span>{contact.email}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className="text-xl font-bold mb-4">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <div className={`block mb-1`}>Full Name</div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                <div className={`block mb-1`}>Phone Number</div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                <div className={`block mb-1`}>Email</div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                <div className={`block mb-1`}>Relationship</div>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.relationship && <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`px-4 py-2 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                    disabled={isSaving}
                  >
                    {isSaving ? <Spinner size="small" color="white" /> : (editingContact ? 'Update' : 'Add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact?"
        itemName={deletingContact?.name}
        isLoading={isDeleting}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default EmergencyContacts;
