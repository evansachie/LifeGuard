import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({
  icon: Icon,
  title,
  value,
  color = 'from-blue-500 to-blue-400',
  onClick,
  clickable,
  suffixIcon: SuffixIcon,
  hoverText,
}) => {
  return (
    <motion.div
      className={`rounded-xl p-4 bg-gradient-to-r ${color} text-white shadow-md relative overflow-hidden ${
        clickable ? 'cursor-pointer hover:shadow-lg group' : ''
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
        <div className="flex-grow">
          <h2 className="text-md opacity-90 text-white">{title}</h2>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <p className="text-xl font-bold mt-1 text-white">{value}</p>
            {SuffixIcon && clickable && (
              <SuffixIcon className="text-white/70 group-hover:text-white transition-colors text-xl" />
            )}
          </motion.div>
        </div>
      </div>
      {hoverText && clickable && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
        >
          {hoverText}
        </motion.div>
      )}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
    </motion.div>
  );
};

export default StatsCard;
