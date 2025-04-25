import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import otpIllustration from '../../../assets/auth/otp.svg';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import OTPVerificationForm from '../../../components/Auth/OTPVerificationForm';
import { verifyOTP, resendOTP } from '../../../utils/auth';
import './OTPVerification.css';

// Custom hook to manage OTP verification logic
const useOTPVerification = (email) => {
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    const timer = timeLeft > 0 && setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, email, navigate]);

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      await resendOTP(email);
      setTimeLeft(30);
      setError('');
      toast.info('OTP has been resent to your email');
    } catch (error) {
      const errorMessage = error.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
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
      const errorMessage = error.message || 'Invalid OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    error,
    isLoading,
    timeLeft,
    handleResendOTP,
    handleSubmit,
  };
};

export default function OTPVerification({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const email = location.state?.email;
  const otpProps = useOTPVerification(email);

  return (
    <div className={`otp-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="otp-illustration">
        <img src={otpIllustration} alt="OTP Verification" />
      </div>

      <div className="otp-form-container">
        <div className="otp-form-card">
          <Logo />
          <h2>Verify Your Email</h2>
          <p>Please enter the 6-digit code sent to your email</p>

          <OTPVerificationForm {...otpProps} />
        </div>
      </div>
    </div>
  );
}
