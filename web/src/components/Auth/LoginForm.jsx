import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Buttons/Button';
import InputField from './InputField';
import OAuthButton from './OAuthButton';

const LoginForm = ({ formData, isLoading, handleChange, handleSubmit, handleGoogleLogin }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <InputField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <div className="forgot-password">
          <Link to="/forgot-password" className="link">
            Forgot Password?
          </Link>
        </div>

        <Button text="Log in" isLoading={isLoading} />
      </form>

      <div className="my-4 text-center">
        <span className="px-2 text-gray-500">or</span>
      </div>

      <OAuthButton onClick={handleGoogleLogin} isLoading={isLoading} />

      <p className="already">
        Don't have an account?{' '}
        <Link to="/sign-up" className="link">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
