import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import Button from '../Buttons/Button';
import InputField from './InputField';

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDarkMode?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  email, 
  setEmail, 
  isLoading, 
  handleSubmit,
  isDarkMode = false,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          value={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Email"
          icon={FiMail}
          style={isDarkMode ? {
            backgroundColor: '#1f2937',
            color: '#fff',
            borderColor: '#374151'
          } : undefined}
        />

        <Button text="Send Reset Link" isLoading={isLoading} />
      </form>

      <p className="mt-6 text-center !text-gray-500 dark:text-gray-300">
        Remember your password?{' '}
        <Link to="/log-in" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          Log In
        </Link>
      </p>
    </>
  );
};

export default ForgotPasswordForm;
