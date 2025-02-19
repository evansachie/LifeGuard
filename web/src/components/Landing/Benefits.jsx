import React from 'react';
import { motion } from 'framer-motion';
import ProactiveHealth from '../../assets/health-monitor.svg'
import Environmental from '../../assets/nature.svg'
import Emergency from '../../assets/emergency.svg'
import './Benefits.css';

const benefits = [
    {
        title: 'Proactive Health Monitoring',
        description: 'Stay ahead of health issues with real-time monitoring and early warning systems.',
        image: ProactiveHealth
    },
    {
        title: 'Environmental Awareness',
        description: 'Understand your surroundings with detailed environmental quality metrics.',
        image: Environmental
    },
    {
        title: 'Emergency Response',
        description: 'Quick access to emergency services and automated alerts to emergency contacts.',
        image: Emergency
    }
];

const Benefits = () => {
    return (
        <section className="benefits-section" id="benefits">
            <div className="benefits-container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2>
                        Why Choose
                        <span className="gradient-text"> LifeGuard</span>
                    </h2>
                    <p>Experience the advantages of comprehensive health monitoring</p>
                </motion.div>

                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="benefit-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ 
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="benefit-image-container">
                                <motion.img 
                                    src={benefit.image} 
                                    alt={benefit.title}
                                    initial={{ scale: 0.8 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                />
                                <div className="image-backdrop" />
                            </div>
                            <div className="benefit-content">
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits; 