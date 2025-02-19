import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaLeaf, FaRunning, FaBell, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import './Features.css';

const features = [
    {
        icon: <FaHeartbeat />,
        title: 'Health Monitoring',
        description: 'Real-time tracking of vital signs and health metrics for proactive wellness management.'
    },
    {
        icon: <FaLeaf />,
        title: 'Environmental Tracking',
        description: 'Monitor air quality and environmental conditions to stay informed about your surroundings.'
    },
    {
        icon: <FaRunning />,
        title: 'Fitness Tracking',
        description: 'Comprehensive exercise routines and activity monitoring for optimal fitness.'
    },
    {
        icon: <FaBell />,
        title: 'Emergency Alerts',
        description: 'Instant notifications and emergency contact system for rapid response when needed.'
    },
    {
        icon: <FaMobileAlt />,
        title: 'Mobile App',
        description: 'Access your health data and features on-the-go with our mobile application.'
    },
    {
        icon: <FaShieldAlt />,
        title: 'Data Security',
        description: 'Enterprise-grade security to protect your personal health information.'
    }
];

const Features = () => {
    return (
        <section className="features-section" id="features">
            <div className="features-container">
                <motion.div
                    className="features-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2>
                        Comprehensive
                        <span className="gradient-text"> Health Features</span>
                    </h2>
                    <p>Everything you need to monitor and maintain your health in one place</p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ 
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
