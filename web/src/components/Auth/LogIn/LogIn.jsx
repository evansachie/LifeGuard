import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../button/button";
import loginIllustration from "../../../assets/auth/loginIllustration.svg";
import loginIllustration2 from "../../../assets/auth/loginIllustration2.svg";
import loginIllustration3 from "../../../assets/auth/loginIllustration3.svg";
import ImageSlider from "../../ImageSlider/ImageSlider";
import { useAuth } from "../../../contexts/AuthContext";
import { loginUser } from "../../../utils/auth";
import InputField from "../../InputField/InputField";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";
import "./LogIn.css";

export default function LogIn({ isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

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
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const sliderImages = [loginIllustration, loginIllustration2, loginIllustration3];

    return (
        <div className={`login-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="login-illustration">
                <ImageSlider images={sliderImages} />
            </div>

            <div className="login-form-container">
                <div className="login-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="login-heading">Welcome Back</h2>

                    <form onSubmit={handleSubmit}>
                        <InputField
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />

                        <InputField
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />

                        <div className="forgot-password">
                            <Link to="/forgot-password" className="link">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button text="Log in" isLoading={isLoading} />
                    </form>

                    <p className="already">
                        Don't have an account? <Link to="/sign-up" className="link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
