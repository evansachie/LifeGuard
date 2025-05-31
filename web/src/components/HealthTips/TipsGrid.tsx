import React from 'react';
import { motion } from 'framer-motion';
import HealthTipCard from './HealthTipCard';
import { HealthTip } from '../../types/healthTips.types';

interface TipsGridProps {
  tips: HealthTip[];
  onReadMore: (tip: HealthTip) => void;
  isDarkMode: boolean;
  containerVariants: {
    hidden: object;
    visible: object;
  };
  itemVariants: {
    hidden: object;
    visible: object;
  };
}

const TipsGrid: React.FC<TipsGridProps> = ({
  tips,
  onReadMore,
  isDarkMode,
  containerVariants,
  itemVariants,
}) => {
  return (
    <motion.section
      className="tips-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tips.length > 0 ? (
        tips.map((tip) => (
          <motion.div key={tip.id} variants={itemVariants}>
            <HealthTipCard tip={tip} onReadMore={onReadMore} isDarkMode={isDarkMode} />
          </motion.div>
        ))
      ) : (
        <div className="no-results">
          <p>No health tips found matching your criteria. Try adjusting your search or filters.</p>
        </div>
      )}
    </motion.section>
  );
};

export default TipsGrid;
