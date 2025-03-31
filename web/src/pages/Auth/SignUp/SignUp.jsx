import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import signupIllustration from "../../../assets/auth/signupIllustration.svg";
import signupIllustration2 from "../../../assets/auth/signupIllustration2.svg";
import signupIllustration3 from "../../../assets/auth/signupIllustration3.svg";
import Button from "../../../components/Buttons/button";
import ImageSlider from "../../../components/ImageSlider/ImageSlider";
import { registerUser } from "../../../utils/auth";
import { validateSignUpForm } from "../../../utils/validateForm";
import InputField from "../../../components/InputField/InputField";
import ThemeToggle from "../../../contexts/ThemeToggle";
import { Logo } from "../../../components/Logo/Logo";
import "./SignUp.css";

export default function SignUp({ isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
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
            toast.error(error.message || "Registration failed");
            setErrors((prev) => ({ ...prev, submit: error.message || "Registration failed. Please try again." }));
        } finally {
            setIsLoading(false);
        }
    };

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

                    <form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                        {errors.name && <span className="error">{errors.name}</span>}

                        <InputField
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}

                        <InputField
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {errors.password && <span className="error">{errors.password}</span>}

                        <InputField
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                        <Button text="Sign Up" isLoading={isLoading} />
                    </form>

                    <p className="already">
                        Already have an account? <Link to="/log-in" className="link">Log In</Link>
                    </p>

                    {errors.submit && <div className="error-message mt-2 text-red-500 text-center">{errors.submit}</div>}
                </div>
            </div>
        </div>
    );
}
