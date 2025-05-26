import React from 'react';

interface OTPInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, setOtp }) => {
  const handleChange = (element: HTMLInputElement, index: number): void => {
    if (isNaN(parseInt(element.value, 10)) && element.value !== '') return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="otp-input-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

export default OTPInput;
