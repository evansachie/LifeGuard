import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

interface InteractiveGuideProps {
  onStartTour: () => void;
  isDarkMode: boolean;
}

const InteractiveGuide = ({ onStartTour, isDarkMode }: InteractiveGuideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 p-6 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-xl font-semibold mb-4">Interactive Guide</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onStartTour}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
            isDarkMode
              ? 'bg-custom-blue hover:bg-custom-blue-hover'
              : 'bg-custom-blue hover:bg-custom-blue-hover'
          } text-white transition-colors transform hover:scale-105 duration-200 shadow-lg`}
        >
          <FaPlay className="text-lg" />
          <span className="font-medium">Start Interactive Tour</span>
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Take a guided tour of the dashboard and its features
      </p>
    </motion.div>
  );
};

export default InteractiveGuide;
