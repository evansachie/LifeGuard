import * as React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TermsOfUse.css';
import {ArrowLeft} from "lucide-react";

const TermsOfUse = ({ isDarkMode }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    const handleAccept = () => {
        setTermsAccepted(true);
    };

    const handleDecline = () => {
        navigate('/settings');
    };

    return (
        <div className={`terms-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="terms-header">
                <Link to="/settings" className="back-link">
                    <ArrowLeft size={20} className="back-icon" />
                    <i className="fas fa-arrow-left"></i> Back to Settings
                </Link>
                <h1>Terms of Use</h1>
            </div>

            <div className="terms-content">
                <p>
                    Welcome to our fitness app! By using our app, you agree to the following terms and conditions:
                </p>

                <h2><strong>1. User Responsibilities</strong></h2>
                <p>
                    You are solely responsible for your use of the app and the information you provide. Ensure that the information you provide is accurate and up-to-date.
                </p>

                <h2><strong>2. Privacy and Data Collection</strong></h2>
                <p>
                    We respect your privacy and follow strict data protection policies. Please review our <Link to="/privacy-policy" className="link">Privacy Policy</Link> for more information.
                </p>

                <h2><strong>3. Intellectual Property</strong></h2>
                <p>
                    The app and its content are protected by intellectual property laws. You may not copy, modify, or distribute any part of the app without our prior written consent.
                </p>


                <div className="terms-actions">
                    <button
                        className={`accept-btn ${termsAccepted ? 'accepted' : ''}`}
                        onClick={handleAccept}
                        disabled={termsAccepted}
                    >
                        {termsAccepted ? 'Terms Accepted' : 'Accept Terms'}
                    </button>
                    <button className="decline-btn" onClick={handleDecline}>
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;