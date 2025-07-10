import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import signupIllustration from '../../../assets/auth/signupIllustration.svg';
import signupIllustration2 from '../../../assets/auth/signupIllustration2.svg';
import signupIllustration3 from '../../../assets/auth/signupIllustration3.svg';
import ImageSlider from '../../../components/ImageSlider/ImageSlider';
import { registerUser, initiateGoogleLogin } from '../../../utils/auth';
import { validateSignUpForm } from '../../../utils/validateForm';
import { getErrorMessage } from '../../../utils/errorHandler';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import SignUpForm from '../../../components/Auth/SignUpForm';
import { AuthPageProps, SignUpFormHook } from '../../../types/common.types';
import './SignUp.css';

// Custom hook to manage signup state and logic
const useSignUp = (): SignUpFormHook => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { isValid, errors } = validateSignUpForm(formData);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setIsLoading(true);
    setRetryCount(0);

    try {
      const response = await registerUser(formData.name, formData.email, formData.password);

      if (response.userId) {
        localStorage.setItem('userId', response.userId);

        if (response.emailVerified) {
          navigate('/verify-otp', { state: { email: formData.email } });
          toast.success('Registration successful! Please verify your email.');
        } else {
          toast.info(
            response.message ||
              'Account created! You can now log in while email verification is pending.'
          );
          navigate('/log-in');
        }
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Registration failed');

      // Handle timeout errors with retry suggestion
      if (errorMessage.includes('timed out') || errorMessage.includes('starting up')) {
        setRetryCount((prev) => prev + 1);
        toast.error(`${errorMessage} ${retryCount > 0 ? `(Retry ${retryCount + 1})` : ''}`);
        setErrors((prev) => ({ ...prev, submit: `${errorMessage} Please try again.` }));
      } else {
        toast.error(errorMessage);
        setErrors((prev) => ({ ...prev, submit: errorMessage }));
      }

      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Show helpful message for slow Google OAuth
    const timeoutId = setTimeout(() => {
      toast.info('Google signup may take a moment on free hosting. Please wait...');
    }, 3000);

    try {
      await initiateGoogleLogin();
      clearTimeout(timeoutId);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage = getErrorMessage(error, 'Google login failed');
      toast.error(errorMessage);
      console.error('Google login error:', error);
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
};

const SignUp = ({ isDarkMode, toggleTheme }: AuthPageProps) => {
  const signUpProps = useSignUp();

  const signupSlides = [
    {
      image: signupIllustration,
      text: 'Track your runs and outdoor activities with real-time health monitoring.',
      alt: 'Running activity illustration',
    },
    {
      image: signupIllustration2,
      text: 'Follow personalized workout routines tailored to your fitness goals.',
      alt: 'Workout routines illustration',
    },
    {
      image: signupIllustration3,
      text: 'Measure your progress with detailed performance analytics and activity tracking.',
      alt: 'Performance analytics illustration',
    },
  ];

  return (
    <div className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="signup-illustration">
        <ImageSlider slides={signupSlides} interval={6000} />
      </div>

      <div className="signup-form-container">
        <div className="signup-form-card">
          <Logo />
          <h2 className="signup-heading">Start your journey!</h2>
          <SignUpForm {...signUpProps} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
