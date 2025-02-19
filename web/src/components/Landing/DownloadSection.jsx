import React from 'react';
import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import MobileApp from '../../assets/mobile-app.svg';
import './DownloadSection.css';

const DownloadSection = () => {
    return (
        <section className="download-section" id="download">
            <div className="download-container">
                <motion.div
                    className="download-content"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2>
                        Get the
                        <span className="gradient-text"> LifeGuard App</span>
                    </h2>
                    <p>Download our mobile app to stay connected with your health monitoring device</p>
                    
                    <div className="store-buttons">
                        <motion.a 
                            href="#" 
                            className="store-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaApple className="store-icon" />
                            <div className="button-text">
                                <span>Download on the</span>
                                <strong>App Store</strong>
                            </div>
                        </motion.a>
                        <motion.a 
                            href="#" 
                            className="store-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaGooglePlay className="store-icon" />
                            <div className="button-text">
                                <span>Get it on</span>
                                <strong>Google Play</strong>
                            </div>
                        </motion.a>
                    </div>
                </motion.div>
                
                <motion.div
                    className="app-preview"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="preview-container">
                        <motion.img 
                            src={MobileApp} 
                            alt="LifeGuard Mobile App"
                            animate={{ 
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className="preview-backdrop" />
                    </div>
                </motion.div>
            </div>

            <div className="background-gradient" />
        </section>
    );
};

export default DownloadSection;