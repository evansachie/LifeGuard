import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaMoon, FaSun } from "react-icons/fa";
import Button from "../../button/button";
import loginIllustration from '../../../assets/auth/loginIllustration.svg';
import loginIllustration2 from '../../../assets/auth/loginIllustration2.svg';
import loginIllustration3 from '../../../assets/auth/loginIllustration3.svg';
import ImageSlider from '../../ImageSlider/ImageSlider';
import "./LogIn.css";
import { API_BASE_URL, API_ENDPOINTS, fetchWithAuth } from '../../../utils/api';
import { toast } from 'react-toastify';

export default function LogIn({ onAuthSuccess, isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

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
            const data = await fetchWithAuth(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userName', data.userName);
            
            toast.success('Login successful!');
            onAuthSuccess();
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to login');
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
                            <div className="forgot-password">
                                <Link to="/forgot-password" className="link">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button 
                            text="Log in" 
                            isLoading={isLoading}
                        />
                    </form>
                    <p className="already">Don't have an account? <Link to="/" className="link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}