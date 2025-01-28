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
                Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our application. By using our services, you agree to the practices described in this policy.
            </p>

            <h2><strong>Information We Collect</strong></h2>
            <p>
                We collect the following types of information to provide and improve our services:
            </p>
            <ul>
                <li><strong>Personal Information:</strong> Information you provide, such as your name, email address, and profile picture, when creating an account.</li>
                <li><strong>Health and Activity Data:</strong> Information you input into health trackers, notes, or other features.</li>
                <li><strong>Environmental Data:</strong> Data collected through sensors or external integrations for air quality and pollution tracking.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our application, including pages visited, features used, and time spent on the platform.</li>
            </ul>

            <h2><strong>How We Use Your Information</strong></h2>
            <p>
                We use your information to:
            </p>
            <ul>
                <li>Provide and personalize the services you use.</li>
                <li>Improve our application's performance and user experience.</li>
                <li>Send important updates, notifications, or reminders.</li>
                <li>Maintain the security of your account and data.</li>
            </ul>

            <h2><strong>How We Protect Your Information</strong></h2>
            <p>
                We implement robust security measures to protect your personal information, including encryption, secure storage, and restricted access. However, no system can be completely secure, and we encourage you to safeguard your account credentials.
            </p>

            <h2><strong>Sharing Your Information</strong></h2>
            <p>
                We do not sell or share your personal information with third parties, except in the following cases:
            </p>
            <ul>
                <li>To comply with legal requirements or protect our rights.</li>
                <li>To trusted service providers who assist in delivering our services (e.g., hosting, analytics).</li>
            </ul>

            <h2><strong>Your Choices</strong></h2>
            <p>
                You have control over your data. You can:
            </p>
            <ul>
                <li>Access and update your account information.</li>
                <li>Request the deletion of your personal data.</li>
                <li>Opt-out of receiving promotional communications.</li>
            </ul>

            <h2><strong>Changes to This Policy</strong></h2>
            <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant updates through our application or via email.
            </p>

            <h2><strong>Contact Us</strong></h2>
            <p>
                If you have any questions or concerns about this Privacy Policy or how your information is handled, please contact us at <strong>evansachie0101@gmail.com</strong>.
            </p>
        </div>

        </div>
    );
};

export default PrivacyPolicy;