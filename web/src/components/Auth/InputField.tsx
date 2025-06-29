import React from 'react';
import { IconType } from 'react-icons';

interface InputFieldProps {
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
  icon?: IconType | React.ReactElement;
  iconPosition?: 'left' | 'right';
  style?: React.CSSProperties;
  isDarkMode?: boolean;
}

const InputField = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  icon,
  iconPosition = 'left',
  style = {},
  isDarkMode = false,
}: InputFieldProps) => {
  return (
    <div className={`input-field-container mb-4 ${className}`}>
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {React.isValidElement(icon)
              ? icon
              : React.createElement(icon as IconType, { size: 18 })}
          </div>
        )}

        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} 
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
          style={{
            paddingLeft: icon && iconPosition === 'left' ? '2.5rem' : undefined,
            paddingRight: icon && iconPosition === 'right' ? '2.5rem' : undefined,
            ...style,
          }}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {React.isValidElement(icon)
              ? icon
              : React.createElement(icon as IconType, { size: 18 })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
