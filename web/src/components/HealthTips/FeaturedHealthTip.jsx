import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FeaturedHealthTip = ({ featuredTip, onLearnMore }) => {
  return (
    <motion.section
      className="featured-tip"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="featured-content">
        <h1>{featuredTip?.title}</h1>
        <p>{featuredTip?.description}</p>
        <button className="learn-more-btn" onClick={onLearnMore}>
          Learn More
        </button>
      </div>
      <div className="featured-image" style={{ backgroundImage: `url(${featuredTip?.image})` }} />
    </motion.section>
  );
};

FeaturedHealthTip.propTypes = {
  featuredTip: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
  onLearnMore: PropTypes.func.isRequired,
};

export default FeaturedHealthTip;
