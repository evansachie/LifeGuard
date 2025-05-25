import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import resetPasswordIllustration from '../../../assets/auth/reset-password.svg';
import { resetUserPassword } from '../../../utils/auth';
import { validatePassword } from '../../../utils/validatePassword';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import ResetPasswordForm from '../../../components/Auth/ResetPasswordForm';
import { AuthPageProps, ResetPasswordFormHook } from '../../../types/common.types';
import './ResetPassword.css';

// Custom hook to manage password reset logic
const usePasswordReset = (): ResetPasswordFormHook => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      toast.error('Invalid reset password link');
      navigate('/forgot-password');
    }
  }, [email, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear password error when user starts typing again
    if (name === 'newPassword' && passwordError) {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordValidationError = validatePassword(formData.newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    setIsLoading(true);
    try {
      if (!email || !token) {
        throw new Error('Missing email or token');
      }
      await resetUserPassword(email, token, formData.newPassword, formData.confirmPassword);
      toast.success('Password reset successful');
      navigate('/log-in');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    passwordError,
    isLoading,
    handleChange,
    handleSubmit,
  };
};

const ResetPassword: React.FC<AuthPageProps> = ({ isDarkMode, toggleTheme }) => {
  const resetProps = usePasswordReset();

  return (
    <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="reset-password-illustration">
        <img src={resetPasswordIllustration} alt="Reset Password" />
      </div>

      <div className="reset-password-form-container">
        <div className="reset-password-form-card">
          <Logo />
          <h2 className="reset-password-heading">Reset Password</h2>
          <p className="reset-password-subheading">Please enter your new password</p>

          <ResetPasswordForm {...resetProps} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
