import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import signupIllustration from "../../../assets/auth/signupIllustration.svg";
import signupIllustration2 from "../../../assets/auth/signupIllustration2.svg";
import signupIllustration3 from "../../../assets/auth/signupIllustration3.svg";
import ImageSlider from "../../../components/ImageSlider/ImageSlider";
import { registerUser, initiateGoogleLogin } from "../../../utils/auth";
import { validateSignUpForm } from "../../../utils/validateForm";
import ThemeToggle from "../../../contexts/ThemeToggle";
import { Logo } from "../../../components/Logo/Logo";
import SignUpForm from "../../../components/Auth/SignUpForm";
import "./SignUp.css";

// Custom hook to manage signup state and logic
const useSignUp = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    
    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateSignUpForm(formData);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser(formData.name, formData.email, formData.password);
      
      if (response.userId) {
        localStorage.setItem("userId", response.userId);
        
        if (response.emailVerified) {
          navigate("/verify-otp", { state: { email: formData.email } });
          toast.success("Registration successful! Please verify your email.");
        } else {
          toast.info(response.message || "Account created! You can now log in while email verification is pending.");
          navigate("/log-in");
        }
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateGoogleLogin();
    } catch (error) {
      toast.error(error.message);
      console.error("Google login error:", error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleLogin
  };
};

export default function SignUp({ isDarkMode, toggleTheme }) {
  const signUpProps = useSignUp();
  const sliderImages = [signupIllustration, signupIllustration2, signupIllustration3];

  return (
    <div className={`signup-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="signup-illustration">
        <ImageSlider images={sliderImages} />
      </div>

      <div className="signup-form-container">
        <div className="signup-form-card">
          <Logo />
          <h2 className="signup-heading">Start your journey!</h2>
          <SignUpForm {...signUpProps} />
        </div>
      </div>
    </div>
  );
}