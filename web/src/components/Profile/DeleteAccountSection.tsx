import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

interface DeleteAccountSectionProps {
  isLoading: boolean;
  isDarkMode: boolean;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  handleConfirmDelete: () => void;
}

const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({
  isLoading,
  isDarkMode,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleConfirmDelete,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="delete-account-section"
      >
        <div className="section-header">
          <h2 className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Delete Account</h2>
        </div>
        <div className="delete-account-card">
          <div className="delete-account-content">
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button
              className="delete-account-button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isLoading}
            >
              <FaTrash /> {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default DeleteAccountSection;
