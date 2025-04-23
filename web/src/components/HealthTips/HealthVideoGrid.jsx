import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const HealthVideoGrid = ({ videos, containerVariants, itemVariants }) => {
  return (
    <section className="video-section">
      <motion.div
        className="video-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {videos.map((video) => (
          <motion.div key={video.id} className="video-card" variants={itemVariants}>
            <div className="video-thumbnail">
              <iframe
                src={video.videoUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

HealthVideoGrid.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      videoUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
  containerVariants: PropTypes.object.isRequired,
  itemVariants: PropTypes.object.isRequired,
};

export default HealthVideoGrid;
