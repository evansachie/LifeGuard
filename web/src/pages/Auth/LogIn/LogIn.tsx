import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginIllustration from '../../../assets/auth/loginIllustration.svg';
import loginIllustration2 from '../../../assets/auth/loginIllustration2.svg';
import loginIllustration3 from '../../../assets/auth/loginIllustration3.svg';
import ImageSlider from '../../../components/ImageSlider/ImageSlider';
import { loginUser, initiateGoogleLogin } from '../../../utils/auth';
import { getErrorMessage } from '../../../utils/errorHandler';
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from '../../../components/Logo/Logo';
import LoginForm from '../../../components/Auth/LoginForm';
import './LogIn.css';
import { AuthPageProps, LoginFormHook } from '../../../types/common.types';

// Custom hook to manage authentication state and logic
const useAuth = (): LoginFormHook => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setRetryCount(0);

    try {
      const data = await loginUser(formData.email, formData.password);

      // Store user details in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.userName);

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Login failed');

      // Handle timeout errors with retry suggestion
      if (errorMessage.includes('timed out') || errorMessage.includes('starting up')) {
        setRetryCount((prev) => prev + 1);
        toast.error(`${errorMessage} ${retryCount > 0 ? `(Retry ${retryCount + 1})` : ''}`);
      } else {
        toast.error(errorMessage);
      }

      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Show helpful message for slow Google OAuth
    const timeoutId = setTimeout(() => {
      toast.info('Google login may take a moment on free hosting. Please wait...');
    }, 3000);

    try {
      await initiateGoogleLogin();
      clearTimeout(timeoutId);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage = getErrorMessage(error, 'Google login failed');
      toast.error(errorMessage);
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
};

const LogIn = ({ isDarkMode, toggleTheme }: AuthPageProps) => {
  const authProps = useAuth();

  const loginSlides = [
    {
      image: loginIllustration,
      text: 'Track your fitness routines and exercise progress with personalized feedback.',
      alt: 'Fitness tracking illustration',
    },
    {
      image: loginIllustration2,
      text: 'Access guided meditation and sleep tracking for better rest quality.',
      alt: 'Meditation and sleep tracking illustration',
    },
    {
      image: loginIllustration3,
      text: 'Monitor your workout metrics and health activities in one comprehensive dashboard.',
      alt: 'Health dashboard illustration',
    },
  ];

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="login-illustration">
        <ImageSlider slides={loginSlides} interval={6000} />
      </div>

      <div className="login-form-container">
        <div className="login-form-card">
          <Logo />
          <h2 className="login-heading">Welcome Back</h2>
          <LoginForm {...authProps} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
