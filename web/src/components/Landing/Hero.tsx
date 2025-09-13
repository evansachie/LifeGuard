import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight } from 'react-icons/fa';
import HeroImg from '../../assets/hero-section.svg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1>
            Your Personal
            <span className="gradient-text"> Health Guardian</span>
          </h1>
          <p>
            Monitor your health, track environmental conditions, and stay connected with emergency
            services - all in one integrated platform.
          </p>
          <div className="hero-buttons">
            <Link to="/sign-up" className="cta-button">
              Get Started <FaArrowRight className="arrow-icon" />
            </Link>
            <a
              href="https://github.com/evansachie/LifeGuard"
              target="_blank"
              rel="noopener noreferrer"
              className="github-button"
            >
              <FaGithub /> Star on GitHub
            </a>
          </div>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src={HeroImg} alt="LifeGuard Platform" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
