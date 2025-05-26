import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import { stripHtmlAndTrim } from '../../utils/htmlUtils';
import Modal from '../Modal/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  itemName,
  isLoading = false,
  isDarkMode = false,
}) => {
  const displayName = itemName ? stripHtmlAndTrim(itemName, 30) : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      maxWidth="max-w-md"
      zIndex="z-[1000]"
    >
      <div className="text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>
        
        {displayName && (
          <p className={`italic text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            &quot;{displayName}&quot;
          </p>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            className={`py-3 px-6 rounded-lg font-medium min-w-[100px] flex items-center justify-center transition-colors
              ${isDarkMode 
                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} 
              disabled:opacity-70 disabled:cursor-not-allowed`}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            className="py-3 px-6 rounded-lg bg-red-500 text-white font-medium min-w-[100px] 
              flex items-center justify-center transition-colors hover:bg-red-600
              disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="small" color="white" /> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
