import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import HealthTipCard from './HealthTipCard';

const TipsGrid = ({ tips, onReadMore, isDarkMode, containerVariants, itemVariants }) => {
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

TipsGrid.propTypes = {
  tips: PropTypes.array.isRequired,
  onReadMore: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  containerVariants: PropTypes.object.isRequired,
  itemVariants: PropTypes.object.isRequired,
};

export default TipsGrid;
