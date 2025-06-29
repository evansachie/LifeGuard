import { motion } from 'framer-motion';
import { FeaturedTip } from '../../types/healthTips.types';

interface FeaturedHealthTipProps {
  featuredTip: FeaturedTip | null;
  onLearnMore: () => void;
}

const FeaturedHealthTip = ({ featuredTip, onLearnMore }: FeaturedHealthTipProps) => {
  if (!featuredTip) return null;

  return (
    <motion.section
      className="featured-tip"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="featured-content">
        <h1>{featuredTip.title}</h1>
        <p>{featuredTip.description}</p>
        <button className="learn-more-btn" onClick={onLearnMore}>
          Learn More
        </button>
      </div>
      <div className="featured-image" style={{ backgroundImage: `url(${featuredTip.image})` }} />
    </motion.section>
  );
};

export default FeaturedHealthTip;
