import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import Button from '../../button/button';
import otpIllustration from '../../../assets/auth/otp.svg';
import { API_ENDPOINTS, fetchWithAuth } from '../../../utils/api';
import './OTPVerification.css';

export default function OTPVerification({ isDarkMode, toggleTheme }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/');
            return;
        }
        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleResendOTP = async () => {
        try {
            setIsLoading(true);
            await fetchWithAuth(API_ENDPOINTS.RESEND_OTP, {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setTimeLeft(30);
            setError('');
        } catch (error) {
            setError(error.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all digits');
            return;
        }

        setIsLoading(true);
        try {
            await fetchWithAuth(API_ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    otp: otpValue
                })
            });
            navigate('/log-in');
        } catch (error) {
            setError(error.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`otp-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="otp-illustration">
                <img src={otpIllustration} alt="OTP Verification" />
            </div>

            <div className="otp-form-container">
                <div className="otp-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2>Verify Your Email</h2>
                    <p>Please enter the 6-digit code sent to your email</p>

                    <form onSubmit={handleSubmit}>
                        <div className="otp-input-container">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <Button 
                            text="Verify OTP" 
                            isLoading={isLoading} 
                        />

                        <div className="resend-container">
                            {timeLeft > 0 ? (
                                <p>Resend code in {timeLeft}s</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="resend-button"
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 