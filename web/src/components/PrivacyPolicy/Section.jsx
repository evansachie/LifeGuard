import { motion } from 'framer-motion';

export const Section = ({ icon, title, children, isDarkMode }) => (
    <motion.section
        whileHover={{ x: 5 }}
        className={`p-6 rounded-lg ${
            isDarkMode 
                ? 'bg-[#3C3C3C]/50 hover:bg-[#3C3C3C]/70' 
                : 'bg-gray-50 hover:bg-gray-100/80'
        } transition-all duration-200`}
    >
        <div className="flex items-center gap-3 mb-4">
            <span className={`text-2xl ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`}>
                {icon}
            </span>
            <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className={`ml-9 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
            {children}
        </div>
    </motion.section>
);
