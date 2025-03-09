import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../components/button/button';
import otpIllustration from '../../../assets/auth/otp.svg';
import { verifyOTP, resendOTP } from '../../../utils/auth';
import OTPInput from '../../../components/OTPInput/OTPInput';
import ThemeToggle from '../../../contexts/ThemeToggle';
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

    const handleResendOTP = async () => {
        try {
            setIsLoading(true);
            await resendOTP(email);
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
            await verifyOTP(email, otpValue);
            toast.success('OTP verified successfully!');
            navigate('/log-in');
        } catch (error) {
            setError(error.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`otp-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="otp-illustration">
                <img src={otpIllustration} alt="OTP Verification" />
            </div>

            <div className="otp-form-container">
                <div className="otp-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2>Verify Your Email</h2>
                    <p>Please enter the 6-digit code sent to your email</p>

                    <form onSubmit={handleSubmit}>
                        <OTPInput otp={otp} setOtp={setOtp} />

                        {error && <div className="error-message">{error}</div>}

                        <Button text="Verify OTP" isLoading={isLoading} />

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
