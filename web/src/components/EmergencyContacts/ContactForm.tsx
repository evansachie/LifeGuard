import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from '../Spinner/Spinner';
import { Contact } from '../../types/contact.types';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  relationship: string;
  priority: number;
  role: string;
}

interface ContactFormProps {
  contact?: Contact | null;
  onSubmit: (formData: ContactFormData) => void;
  onCancel: () => void;
  isSaving?: boolean;
  isDarkMode?: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  relationship?: string;
}

const ContactForm = ({
  contact = null,
  onSubmit,
  onCancel,
  isSaving = false,
  isDarkMode = false,
}: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    priority: 1,
    role: 'General',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.Name,
        phone: contact.Phone,
        email: contact.Email,
        relationship: contact.Relationship,
        priority: contact.Priority,
        role: contact.Role,
      });
    }
  }, [contact]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`w-full max-w-md p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2 className="text-xl font-bold mb-4">{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block mb-1" id="name-label">
            Full Name
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="name-label"
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <div className="block mb-1" id="phone-label">
            Phone Number
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="phone-label"
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <div className="block mb-1" id="email-label">
            Email
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="email-label"
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="block mb-1" id="relationship-label">
            Relationship
          </div>
          <input
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="relationship-label"
            placeholder="e.g., Spouse, Parent, Friend"
          />
          {errors.relationship && (
            <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
          )}
        </div>

        <div>
          <div className="block mb-1" id="priority-label">
            Priority
          </div>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="priority-label"
          >
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
        </div>

        <div>
          <div className="block mb-1" id="role-label">
            Role
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            aria-labelledby="role-label"
          >
            <option value="General">General</option>
            <option value="Medical">Medical</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            disabled={isSaving}
          >
            {isSaving ? <Spinner size="small" color="white" /> : contact ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
