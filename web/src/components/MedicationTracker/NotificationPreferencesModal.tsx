import { motion, AnimatePresence } from 'framer-motion';
import NotificationPreferences from './NotificationPreferences';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const NotificationPreferencesModal = ({
  isOpen,
  onClose,
  isDarkMode,
}: NotificationPreferencesModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl 
                ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`px-6 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    Notification Settings
                  </h2>
                  <button
                    onClick={onClose}
                    className={`rounded-full p-2 hover:bg-opacity-10 
                      ${isDarkMode ? 'hover:bg-white' : 'hover:bg-black'}`}
                    type="button"
                    aria-label="Close notification settings modal"
                    title="Close"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <NotificationPreferences isDarkMode={isDarkMode} onClose={onClose} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPreferencesModal;
