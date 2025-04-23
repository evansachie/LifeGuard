import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({
  icon: Icon,
  title,
  value,
  color = 'from-blue-500 to-blue-400',
  onClick,
  clickable,
}) => {
  return (
    <motion.div
      className={`rounded-xl p-4 bg-gradient-to-r ${color} text-white shadow-md relative overflow-hidden ${
        clickable ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
      onClick={clickable ? onClick : undefined}
      whileHover={clickable ? { scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
          <Icon className="text-2xl" />
        </div>
        <div>
          <h2 className="text-md opacity-90 text-white">{title}</h2>
          <motion.p
            className="text-xl font-bold mt-1 text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {value}
          </motion.p>
        </div>
      </div>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
    </motion.div>
  );
};

export default StatsCard;
