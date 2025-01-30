export default function Button({ text, isLoading }) {
    return (
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 text-white font-semibold rounded-[10px] transition duration-300
          ${isLoading ? "bg-[#6c94e0] cursor-not-allowed" : "bg-custom-blue hover:bg-custom-blue-hover"}
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          text
        )}
      </button>
    );
  }
  