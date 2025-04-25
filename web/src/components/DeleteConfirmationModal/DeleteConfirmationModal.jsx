import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import { stripHtmlAndTrim } from '../../utils/htmlUtils';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  itemName,
  isLoading,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const displayName = itemName ? stripHtmlAndTrim(itemName, 30) : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="delete-modal-overlay"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`delete-modal ${isDarkMode ? 'dark-mode' : ''}`}
        >
          <div className="delete-modal-content">
            <FaExclamationTriangle className="warning-icon" />
            <h2>{title}</h2>
            <p>{message}</p>
            {displayName && <p className="item-name">&quot;{displayName}&quot;</p>}
            <div className="delete-modal-actions">
              <button className="cancel-button" onClick={onClose} disabled={isLoading}>
                Cancel
              </button>
              <button className="delete-button" onClick={onConfirm} disabled={isLoading}>
                {isLoading ? <Spinner size="small" color="white" /> : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
