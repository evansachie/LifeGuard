import React from 'react';

interface ButtonProps {
  text: string;
  isLoading?: boolean;
  type?: 'submit' | 'button' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ text, isLoading = false, type = 'submit', onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 text-white font-semibold rounded-[10px] transition duration-300 flex items-center justify-center
                ${isLoading ? 'bg-loading cursor-not-allowed' : 'bg-custom-blue hover:bg-custom-blue-hover'}
            `}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>Please wait...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
