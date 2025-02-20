import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaMoon, FaSun } from 'react-icons/fa';
import Button from '../../button/button';
import resetPasswordIllustration from '../../../assets/auth/reset-password.svg';
import { API_ENDPOINTS, fetchApi } from '../../../utils/api';
import { toast } from 'react-toastify';
import './ResetPassword.css';

export default function ResetPassword({ isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [passwordError, setPasswordError] = useState('');

    // Get email and token from URL parameters
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!email || !token) {
            toast.error('Invalid reset password link');
            navigate('/forgot-password');
        }
    }, [email, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);
        
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasNonAlphanumeric) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password requirements
        const passwordValidationError = validatePassword(formData.newPassword);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            toast.error(passwordValidationError);
            return;
        }

        setIsLoading(true);
        try {
            const decodedToken = decodeURIComponent(token).replace(/ /g, '+');
            const payload = {
                Email: email,
                Token: decodedToken,
                NewPassword: formData.newPassword,
                ConfirmPassword: formData.confirmPassword
            };
            
            await fetchApi(API_ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            toast.success('Password reset successful');
            navigate('/log-in');
        } catch (error) {
            console.error('Reset password error:', {
                error,
                email,
                response: error.response
            });
            toast.error(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="reset-password-illustration">
                <img src={resetPasswordIllustration} alt="Reset Password" />
            </div>

            <div className="reset-password-form-container">
                <div className="reset-password-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="reset-password-heading">Reset Password</h2>
                    <p className="reset-password-subheading">
                        Please enter your new password
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.newPassword && <FaLock className="input-icon" />}
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    minLength="6"
                                />
                                <label htmlFor="newPassword">New Password</label>
                            </div>
                            <div className="password-requirements">
                                <p>Password must contain:</p>
                                <ul>
                                    <li>At least 6 characters</li>
                                    <li>One uppercase letter (A-Z)</li>
                                    <li>One special character (!@#$%^&* etc.)</li>
                                </ul>
                            </div>
                            {passwordError && (
                                <div className="error-message">{passwordError}</div>
                            )}
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
                                    minLength="6"
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>
                        </div>

                        <Button 
                            text="Reset Password" 
                            isLoading={isLoading}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
} 