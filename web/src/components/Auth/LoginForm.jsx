import React from "react";
import { Link } from "react-router-dom";
import Button from '../Buttons/Button';
import InputField from './InputField';

const LoginForm = ({ formData, isLoading, handleChange, handleSubmit }) => {
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

      <p className="already">
        Don't have an account? <Link to="/sign-up" className="link">Sign Up</Link>
      </p>
    </>
  );
};

export default LoginForm;