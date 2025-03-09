import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../components/button/button';
import forgotPasswordIllustration from '../../../assets/auth/forgot-password.svg';
import { requestPasswordReset } from '../../../utils/auth';
import InputField from '../../../components/InputField/InputField';
import ThemeToggle from '../../../contexts/ThemeToggle';
import './ForgotPassword.css';

export default function ForgotPassword({ isDarkMode, toggleTheme }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            toast.success('Password reset instructions sent to your email');
        } catch (error) {
            toast.error(error.message || 'Failed to process request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`forgot-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="forgot-password-illustration">
                <img src={forgotPasswordIllustration} alt="Forgot Password" />
            </div>

            <div className="forgot-password-form-container">
                <div className="forgot-password-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="forgot-password-heading">Forgot Password?</h2>
                    <p className="forgot-password-subheading">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <InputField 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                        />

                        <Button text="Send Reset Link" isLoading={isLoading} />
                    </form>

                    <p className="back-to-login">
                        Remember your password? <Link to="/log-in" className="link">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
