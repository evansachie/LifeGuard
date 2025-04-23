import { FcGoogle } from 'react-icons/fc';

const OAuthButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 border border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <FcGoogle size={20} />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuthButton;
