import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import forgotPasswordIllustration from '../../../assets/auth/forgot-password.svg';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import './ForgotPassword.css';
import ForgotPasswordForm from '../../../components/Auth/ForgotPasswordForm';
import { requestPasswordReset } from '../../../utils/auth';
import { getErrorMessage } from '../../../utils/errorHandler';
import { AuthPageProps } from '../../../types/common.types';

// Custom hook to manage form state and submission
const usePasswordResetForm = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      toast.success('Password reset instructions sent to your email');
      setEmail('');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to process request');
      toast.error(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    handleSubmit,
  };
};

const ForgotPassword = ({ isDarkMode, toggleTheme }: AuthPageProps) => {
  const formProps = usePasswordResetForm();

  return (
    <div className={`forgot-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="forgot-password-illustration">
        <img src={forgotPasswordIllustration} alt="Forgot Password" />
      </div>

      <div className="forgot-password-form-container">
        <div className="forgot-password-form-card">
          <Logo />
          <h2 className="forgot-password-heading">Forgot Password?</h2>
          <p className="forgot-password-subheading">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <ForgotPasswordForm {...formProps} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
