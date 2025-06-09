import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import otpIllustration from '../../../assets/auth/otp.svg';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import OTPVerificationForm from '../../../components/Auth/OTPVerificationForm';
import { verifyOTP, resendOTP } from '../../../utils/auth';
import { getErrorMessage } from '../../../utils/errorHandler';
import { AuthPageProps, OTPVerificationFormHook } from '../../../types/common.types';
import './OTPVerification.css';

// Custom hook to manage OTP verification logic
const useOTPVerification = (email: string | undefined): OTPVerificationFormHook => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    const timer = timeLeft > 0 && setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, email, navigate]);

  const handleResendOTP = async (): Promise<void> => {
    try {
      if (!email) {
        throw new Error('Email is missing');
      }

      setIsLoading(true);
      await resendOTP(email);
      setTimeLeft(30);
      setError('');
      toast.info('OTP has been resent to your email');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to resend OTP');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter all digits');
      return;
    }

    if (!email) {
      setError('Email is missing. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(email, otpValue);
      toast.success('OTP verified successfully!');
      navigate('/log-in');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Invalid OTP');
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

const OTPVerification: React.FC<AuthPageProps> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const email = location.state?.email as string | undefined;
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
};

export default OTPVerification;
