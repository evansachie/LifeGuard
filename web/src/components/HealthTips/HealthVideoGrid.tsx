import { motion } from 'framer-motion';

interface HealthVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

interface HealthVideoGridProps {
  videos: HealthVideo[];
  containerVariants: {
    hidden: object;
    visible: object;
  };
  itemVariants: {
    hidden: object;
    visible: object;
  };
}

const HealthVideoGrid = ({ videos, containerVariants, itemVariants }: HealthVideoGridProps) => {
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

export default HealthVideoGrid;
