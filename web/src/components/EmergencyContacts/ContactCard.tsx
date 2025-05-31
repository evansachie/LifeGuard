import { FaEdit, FaTrash, FaPhone, FaEnvelope, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Contact } from '../../types/contact.types';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onSendTestAlert: (contactId: string) => void;
  isDarkMode?: boolean;
}

const ContactCard = ({
  contact,
  onEdit,
  onDelete,
  onSendTestAlert,
  isDarkMode = false,
}: ContactCardProps) => {
  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const getPriorityClass = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRoleClass = (role: string): string => {
    switch (role) {
      case 'Medical':
        return 'bg-red-100 text-red-800';
      case 'Emergency':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {contact.Name}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {contact.Relationship}
          </p>
          {contact.IsVerified ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              Pending Verification
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSendTestAlert(contact.Id)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Send Test Alert"
            aria-label="Send test alert to contact"
          >
            <FaBell className="text-blue-500" />
          </button>
          <button
            onClick={() => onEdit(contact)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Edit Contact"
            aria-label="Edit contact information"
          >
            <FaEdit className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Delete Contact"
            aria-label="Delete contact"
          >
            <FaTrash className="text-red-500" />
          </button>
        </div>
      </div>
      <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center gap-2">
          <FaPhone className="text-green-500" aria-hidden="true" />
          <span>{contact.Phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-blue-500" aria-hidden="true" />
          <span>{contact.Email}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <span
              className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Role:
            </span>
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${getRoleClass(contact.Role)}`}>
              {contact.Role}
            </span>
          </div>
          <div className="flex items-center ml-3">
            <span
              className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Priority:
            </span>
            <span
              className={`ml-1 px-2 py-0.5 text-xs rounded-full ${getPriorityClass(contact.Priority)}`}
            >
              {getPriorityLabel(contact.Priority)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
