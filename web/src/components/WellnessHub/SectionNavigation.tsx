import { motion } from 'framer-motion';
import { GiMeditation } from 'react-icons/gi';
import { FaVolumeUp } from 'react-icons/fa';
import { WellnessSection } from '../../types/wellnessHub.types';

interface SectionNavigationProps {
  activeSection: WellnessSection;
  handleSectionChange: (section: WellnessSection) => void;
}

const SectionNavigation = ({ activeSection, handleSectionChange }: SectionNavigationProps) => (
  <div className="section-navigation">
    <motion.div className="nav-buttons">
      {(['breathing', 'meditation', 'sounds'] as WellnessSection[]).map((section) => (
        <motion.button
          key={section}
          onClick={() => handleSectionChange(section)}
          className={`nav-button ${activeSection === section ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Switch to ${section} section`}
          aria-pressed={activeSection === section}
        >
          {section === 'breathing' && <GiMeditation />}
          {section === 'meditation' && <GiMeditation />}
          {section === 'sounds' && <FaVolumeUp />}
          <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
        </motion.button>
      ))}
    </motion.div>
  </div>
);

export default SectionNavigation;
