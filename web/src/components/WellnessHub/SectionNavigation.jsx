import React from 'react';
import { motion } from 'framer-motion';
import { GiMeditation } from 'react-icons/gi';
import { FaVolumeUp } from 'react-icons/fa';

const SectionNavigation = ({ activeSection, handleSectionChange }) => (
    <div className="section-navigation">
        <motion.div className="nav-buttons">
            {['breathing', 'meditation', 'sounds'].map((section) => (
                <motion.button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`nav-button ${activeSection === section ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
