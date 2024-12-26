import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaMoon, FaSun } from "react-icons/fa";
import signupIllustration from '../../../assets/auth/fitness.svg';
import "./SignUp.css";

export default function SignUp({ onAuthSuccess, isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await fetch('https://lighthouse-portal.onrender.com/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const { token } = await response.json();
                    localStorage.setItem('token', token);
                    onAuthSuccess();
                    navigate('/dashboard');
                } else {
                    console.error('Signup error:', response.status);
                }
            } catch (error) {
                console.error('Error signing up:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.userName.trim()) {
            errors.userName = "Username is required";
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid";
            isValid = false;
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    return (
        <div className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="signup-illustration">
                <img src={signupIllustration} alt="Join our community" />
            </div>
            <div className="signup-form-container">
                <div className="signup-form-card">
                    <img src="/images/logo-no-bkgd.png" alt="lhp logo" className="logo" />
                    <h2 className="signup-heading">Join our Community</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.userName && <FaUser className="input-icon" />}
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="userName">Username</label>
                            </div>
                            {errors.userName && <span className="error">{errors.userName}</span>}
                        </div>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.email && <FaEnvelope className="input-icon" />}
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.password && <FaLock className="input-icon" />}
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : "Join Now"}
                        </button>
                    </form>
                    <p className="already">Already have an account? <Link to="/log-in" className="link">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}
