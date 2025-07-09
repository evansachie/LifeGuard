import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <img src="/images/lifeguard-2.svg" alt="LifeGuard" className="footer-logo" />
                        <div className="social-links">
                            <a href="https://github.com/AWESOME04/LifeGuard" target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h3>Product</h3>
                        <button onClick={() => scrollToSection('features')}>Features</button>
                        <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
                        <button onClick={() => scrollToSection('benefits')}>Benefits</button>
                        <button onClick={() => scrollToSection('download')}>Download</button>
                    </div>

                    <div className="footer-links">
                        <h3>Company</h3>
                        <button onClick={() => scrollToSection('about')}>About</button>
                        <button onClick={() => scrollToSection('contact')}>Contact</button>
                        <button onClick={() => scrollToSection('careers')}>Careers</button>
                    </div>

                    <div className="footer-links">
                        <h3>Resources</h3>
                        <button onClick={() => scrollToSection('help')}>Help Center</button>
                        <button onClick={() => scrollToSection('terms-of-use')}>Terms of Use</button>
                        <button onClick={() => scrollToSection('privacy-policy')}>Privacy Policy</button>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} LifeGuard. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;