import React from 'react';
import Button from '../Buttons/Button';
import InputField from './InputField';

const ResetPasswordForm = ({ 
  formData, 
  passwordError, 
  isLoading, 
  handleChange, 
  handleSubmit 
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <InputField 
        type="password" 
        name="newPassword" 
        value={formData.newPassword} 
        onChange={handleChange} 
        placeholder="New Password" 
        required
      />

      <div className="password-requirements">
        <p>Password must contain:</p>
        <ul>
          <li>At least 6 characters</li>
          <li>One uppercase letter (A-Z)</li>
          <li>One special character (!@#$%^&*)</li>
        </ul>
      </div>

      {passwordError && <div className="error-message">{passwordError}</div>}

      <InputField 
        type="password" 
        name="confirmPassword" 
        value={formData.confirmPassword} 
        onChange={handleChange} 
        placeholder="Confirm Password" 
        required
      />

      <Button text="Reset Password" isLoading={isLoading} />
    </form>
  );
};

export default ResetPasswordForm;