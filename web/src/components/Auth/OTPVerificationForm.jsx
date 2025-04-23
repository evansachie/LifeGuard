import React from 'react';
import Button from '../Buttons/Button';
import OTPInput from './OTPInput';

const OTPVerificationForm = ({
  otp,
  setOtp,
  error,
  isLoading,
  timeLeft,
  handleResendOTP,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <OTPInput otp={otp} setOtp={setOtp} />

      {error && <div className="error-message">{error}</div>}

      <Button text="Verify OTP" isLoading={isLoading} />

      <div className="resend-container">
        {timeLeft > 0 ? (
          <p>Resend code in {timeLeft}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            className="resend-button"
            disabled={isLoading}
          >
            Resend OTP
          </button>
        )}
      </div>
    </form>
  );
};

export default OTPVerificationForm;
