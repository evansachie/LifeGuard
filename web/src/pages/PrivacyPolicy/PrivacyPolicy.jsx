import * as React from "react";
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';
import {ArrowLeft} from "lucide-react";

const PrivacyPolicy = ({ isDarkMode }) => {
    return (
        <div className={`privacy-policy-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="privacy-policy-header">
                <Link to="/settings" className="back-link">
                    <ArrowLeft size={20} className="back-icon" />
                    <i className="fas fa-arrow-left"></i> Back to Settings
                </Link>
                <h1>Privacy Policy</h1>
            </div>

            <div className="privacy-policy-content">
                <h2><strong>Our Commitment to Privacy</strong></h2>
                <p>
                    At our fitness app, we take your privacy very seriously. We are committed to protecting your personal information and ensuring that your data is handled with the utmost care and confidentiality.
                </p>

                <h2><strong>Information We Collect</strong></h2>
                <p>
                    We collect the following types of information from our users:
                </p>
                <ul>
                    <li>Personal information (name, email address, etc.) provided during account registration</li>
                    <li>Fitness and health data (activity levels, calorie intake, hydration levels, etc.) tracked through the app</li>
                    <li>Device information (device model, operating system, etc.) for analytical purposes</li>
                </ul>

                <h2><strong>How We Use Your Information</strong></h2>
                <p>
                    The information we collect is used for the following purposes:
                </p>
                <ul>
                    <li>To provide and improve our fitness app and services</li>
                    <li>To personalize your experience and offer tailored recommendations</li>
                    <li>To communicate with you about updates, promotions, and other relevant information</li>
                    <li>To analyze usage data and optimize our app's performance</li>
                </ul>

                <h2><strong>Data Security</strong></h2>
                <p>
                    We implement industry-standard security measures to protect your personal information from unauthorized access, use, or disclosure. However, please note that no method of data transmission or storage is completely secure, and we cannot guarantee absolute security.
                </p>

                <h2><strong>Third-Party Services</strong></h2>
                <p>
                    Our app may integrate with third-party services (e.g., fitness trackers, social media platforms) to enhance your experience. When using these services, their privacy policies and terms of service will apply. We encourage you to review them carefully.
                </p>

                <h2><strong>Changes to This Privacy Policy</strong></h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review this policy periodically.
                </p>

                <h2><strong>Contact Us</strong></h2>
                <p>
                    If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:SUPPORT@PROGRESSNEVERSSTOPS.COM" className="link">SUPPORT@PROGRESSNEVERSSTOPS.COM</a>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;