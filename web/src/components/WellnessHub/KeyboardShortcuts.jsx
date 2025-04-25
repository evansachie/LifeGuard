import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaKeyboard, FaTimes } from 'react-icons/fa';

const KeyboardShortcuts = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaKeyboard /> Keyboard Shortcuts
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span>Space</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Play/Pause</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Left/Right Arrow</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                Change Category
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Up/Down Arrow</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Volume</span>
            </div>
            <div className="flex justify-between items-center">
              <span>M</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Mute/Unmute</span>
            </div>
            <div className="flex justify-between items-center">
              <span>F</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                Toggle Fullscreen
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>K</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Show Shortcuts</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default KeyboardShortcuts;
