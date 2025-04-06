import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Buttons/Button';
import InputField from './InputField';

const ForgotPasswordForm = ({ email, setEmail, isLoading, handleSubmit }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required
        />

        <Button text="Send Reset Link" isLoading={isLoading} />
      </form>

      <p className="back-to-login">
        Remember your password? <Link to="/log-in" className="link">Log In</Link>
      </p>
    </>
  );
};

export default ForgotPasswordForm;