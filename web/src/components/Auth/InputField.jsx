import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function InputField({ type = 'text', name, value, onChange, placeholder }) {
  // Determine the appropriate icon
  const icon =
    type === 'password' ? <FaLock className="input-icon" /> : <FaEnvelope className="input-icon" />;

  return (
    <div className="form-group">
      <div className="input-icon-wrapper">
        {!value && icon}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder=" "
          required
          minLength={type === 'password' ? 6 : undefined}
        />
        <label>{placeholder}</label>
      </div>
    </div>
  );
}
