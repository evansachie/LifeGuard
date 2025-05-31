import React from 'react';
import { FiLock } from 'react-icons/fi';
import Button from '../Buttons/Button';
import InputField from './InputField';

interface ResetPasswordFormProps {
  formData: {
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDarkMode?: boolean;
}

const ResetPasswordForm = ({
  formData,
  passwordError,
  isLoading,
  handleChange,
  handleSubmit,
  isDarkMode = false,
}: ResetPasswordFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="New Password"
        icon={FiLock}
        isDarkMode={isDarkMode}
      />

      <div className="password-requirements mt-2 mb-4 p-3 rounded-md">
        <p className="font-medium mb-1">Password must contain:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>At least 6 characters</li>
          <li>One uppercase letter (A-Z)</li>
          <li>One special character (!@#$%^&*)</li>
        </ul>
      </div>

      {passwordError && (
        <div className="error-message mb-4 text-sm text-red-600 dark:text-red-400">
          {passwordError}
        </div>
      )}

      <InputField
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        icon={FiLock}
        isDarkMode={isDarkMode}
      />

      <Button text="Reset Password" isLoading={isLoading} />
    </form>
  );
};

export default ResetPasswordForm;
