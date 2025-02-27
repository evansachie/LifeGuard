import React from 'react';
import { motion } from 'framer-motion';
import {steps} from '../../data/steps';
import './HowItWorks.css';

const HowItWorks = () => {
    return (
        <section className="how-it-works-section" id="how-it-works">
            <div className="how-it-works-container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2>
                        How It
                        <span className="gradient-text"> Works</span>
                    </h2>
                    <p>Get started with LifeGuard in four simple steps</p>
                </motion.div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="step-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="step-content">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <div className="connector-line" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;