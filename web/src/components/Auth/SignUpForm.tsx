import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Button from '../Buttons/Button';
import InputField from './InputField';
import OAuthButton from './OAuthButton';

interface SignUpFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isDarkMode?: boolean;
}

const SignUpForm = ({
  formData,
  errors,
  isLoading,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  isDarkMode = false,
}: SignUpFormProps) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <InputField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            icon={FiUser}
            isDarkMode={isDarkMode}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            icon={FiMail}
            isDarkMode={isDarkMode}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <InputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            icon={FiLock}
            isDarkMode={isDarkMode}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <InputField
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            icon={FiLock}
            isDarkMode={isDarkMode}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <Button text="Sign Up" isLoading={isLoading} />
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        <span className="px-4 text-gray-500 !dark:text-gray-400 !dark:bg-gray-900">OR</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <OAuthButton onClick={handleGoogleLogin} isLoading={isLoading} isDarkMode={isDarkMode} />

      <p className="already">
        Already have an account?{' '}
        <Link to="/log-in" className="link">
          Log In
        </Link>
      </p>

      {errors.submit && <div className="error-message">{errors.submit}</div>}
    </>
  );
};

export default SignUpForm;
