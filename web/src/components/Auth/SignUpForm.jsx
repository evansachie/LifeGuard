import React from "react";
import { Link } from "react-router-dom";
import Button from "../Buttons/Button";
import InputField from "./InputField";

const SignUpForm = ({ formData, errors, isLoading, handleChange, handleSubmit }) => {
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
            required
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
            required
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
            required
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
            required
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <Button text="Sign Up" isLoading={isLoading} />
      </form>

      <p className="already">
        Already have an account? <Link to="/log-in" className="link">Log In</Link>
      </p>

      {errors.submit && (
        <div className="error-message mt-2 text-red-500 text-center">
          {errors.submit}
        </div>
      )}
    </>
  );
};

export default SignUpForm;