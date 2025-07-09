import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginIllustration from "../../../assets/auth/loginIllustration.svg";
import loginIllustration2 from "../../../assets/auth/loginIllustration2.svg";
import loginIllustration3 from "../../../assets/auth/loginIllustration3.svg";
import ImageSlider from "../../../components/ImageSlider/ImageSlider";
import { loginUser } from "../../../utils/auth";
import ThemeToggle from '../../../contexts/ThemeToggle';
import { Logo } from "../../../components/Logo/Logo";
import LoginForm from "../../../components/Auth/LoginForm";
import "./LogIn.css";

// Custom hook to manage authentication state and logic
const useAuth = () => {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(formData.email, formData.password);
      
      // Store user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.userName);
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};

export default function LogIn({ isDarkMode, toggleTheme }) {
  const authProps = useAuth();
  const sliderImages = [loginIllustration, loginIllustration2, loginIllustration3];

  return (
    <div className={`login-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="login-illustration">
        <ImageSlider images={sliderImages} />
      </div>

      <div className="login-form-container">
        <div className="login-form-card">
          <Logo />
          <h2 className="login-heading">Welcome Back</h2>
          <LoginForm {...authProps} />
        </div>
      </div>
    </div>
  );
}