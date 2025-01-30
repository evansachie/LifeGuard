import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaMoon, FaSun } from "react-icons/fa";
import loginIllustration from '../../../assets/auth/login-page-2.svg';
import loginIllustration2 from '../../../assets/auth/login-page2.svg';
import loginIllustration3 from '../../../assets/auth/login-page3.svg';
import "./LogIn.css";
import ImageSlider from '../../ImageSlider/ImageSlider';

export default function LogIn({ onAuthSuccess, isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
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
        setIsLoading(true);
        try {
            const response = await fetch('https://lifeguard-hiij.onrender.com/api/Account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                onAuthSuccess();
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const sliderImages = [
        loginIllustration,
        loginIllustration2,
        loginIllustration3
    ];

    return (
        <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="login-illustration">
                <ImageSlider images={sliderImages} />
            </div>
            <div className="login-form-container">
                <div className="login-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="login-heading">Welcome Back</h2>
                    <form onSubmit={handleSubmit}>
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
                                    placeholder=""
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : "Log In"}
                        </button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                    <p className="already">Don't have an account? <Link to="/" className="link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}