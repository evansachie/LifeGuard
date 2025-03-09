import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value }) => {
  return (
    <motion.div 
      className="stats-card"
      whileHover={{ scale: 1.05 }}
    >
      <div className="stats-icon">
        <Icon />
      </div>
      <div className="stats-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
