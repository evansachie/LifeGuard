import { FaEnvelope } from 'react-icons/fa';

export default function InputField({ value, onChange, placeholder, type = 'text' }) {
    return (
        <div className="form-group">
            <div className="input-icon-wrapper">
                {!value && <FaEnvelope className="input-icon" />}
                <input 
                    type={type} 
                    value={value} 
                    onChange={onChange} 
                    placeholder=" " 
                    required 
                />
                <label>{placeholder}</label>
            </div>
        </div>
    );
}
