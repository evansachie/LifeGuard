interface OTPInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

const OTPInput = ({ otp, setOtp }: OTPInputProps) => {
  const handleChange = (element: HTMLInputElement, index: number): void => {
    if (isNaN(parseInt(element.value, 10)) && element.value !== '') return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="otp-input-container" role="group" aria-label="Enter OTP code">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onFocus={(e) => e.target.select()}
          aria-label={`OTP digit ${index + 1} of ${otp.length}`}
          inputMode="numeric"
          pattern="[0-9]"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default OTPInput;
