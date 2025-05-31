import { motion } from 'framer-motion';
import { presetGoals } from '../../data/presetGoals';
import Modal from '../Modal/Modal';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoal: (goal: string) => void;
  isDarkMode: boolean;
}

const GoalsModal = ({ isOpen, onClose, onSelectGoal, isDarkMode }: GoalsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      isDarkMode={isDarkMode}
      showCloseButton={true}
    >
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Set Workout Goal
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {presetGoals.map((goal) => (
            <motion.button
              key={goal.id}
              className={`flex items-center p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              } transition-all`}
              onClick={() => {
                onSelectGoal(goal.label);
                onClose();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <goal.icon className={`text-2xl ${goal.color.replace('bg-', 'text-')}`} />
              <span className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {goal.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default GoalsModal;
