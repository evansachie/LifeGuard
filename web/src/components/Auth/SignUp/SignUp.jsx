import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaMoon, FaSun, FaPhone } from "react-icons/fa";
import signupIllustration from '../../../assets/auth/fitness.svg';
import signupIllustration2 from '../../../assets/auth/signupIllustration2.svg';
import signupIllustration3 from '../../../assets/auth/signupIllustration3.svg';
import Button from "../../button/button";
import "./SignUp.css";
import ImageSlider from '../../ImageSlider/ImageSlider';
import { API_ENDPOINTS, fetchWithAuth } from '../../../utils/api';

export default function SignUp({ onAuthSuccess, isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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
                const data = await fetchWithAuth(API_ENDPOINTS.REGISTER, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                });
                
                if (data.userId) {
                    localStorage.setItem('userId', data.userId);
                    onAuthSuccess();
                    navigate('/dashboard');
                } else {
                    setErrors(prev => ({
                        ...prev,
                        submit: 'Registration successful but no user ID received'
                    }));
                }
            } catch (error) {
                console.error('Error signing up:', error);
                setErrors(prev => ({
                    ...prev,
                    submit: error.message || 'An error occurred during registration. Please try again later.'
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = "Name is required";
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
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const sliderImages = [
        signupIllustration,
        signupIllustration2,
        signupIllustration3
    ];

    return (
        <div className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="signup-illustration">
                <ImageSlider images={sliderImages} />
            </div>
            <div className="signup-form-container">
                <div className="signup-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="signup-heading">Start your journey!</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.name && <FaUser className="input-icon" />}
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="name">Name</label>
                            </div>
                            {errors.name && <span className="error">{errors.name}</span>}
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

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.confirmPassword && <FaLock className="input-icon" />}
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>
                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        </div>

                        {errors.submit && <div className="error-message">{errors.submit}</div>}

                        <Button text="Join Now" disabled={isLoading}/>
                    </form>
                    <p className="already">Already have an account? <Link to="/log-in" className="link">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}
