import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import Button from '../Buttons/Button';
import InputField from './InputField';
import OAuthButton from './OAuthButton';

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isDarkMode?: boolean;
}

const LoginForm = ({
  formData,
  isLoading,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  isDarkMode = false,
}: LoginFormProps) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          icon={FiMail}
          isDarkMode={isDarkMode}
        />

        <InputField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          icon={FiLock}
          isDarkMode={isDarkMode}
        />

        <div className="forgot-password">
          <Link to="/forgot-password" className="link">
            Forgot Password?
          </Link>
        </div>

        <Button text={isLoading ? 'Signing in...' : 'Log in'} isLoading={isLoading} />
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        <span className="px-4 text-gray-500 !dark:text-gray-400 !dark:bg-gray-900">OR</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <OAuthButton onClick={handleGoogleLogin} isLoading={isLoading} isDarkMode={isDarkMode} />

      <p className="already">
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" className="link">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
