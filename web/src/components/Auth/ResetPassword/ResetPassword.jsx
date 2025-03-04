import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../button/button';
import resetPasswordIllustration from '../../../assets/auth/reset-password.svg';
import { resetUserPassword } from '../../../utils/auth';
import { validatePassword } from '../../../utils/validatePassword';
import InputField from '../../InputField/InputField';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import './ResetPassword.css';

export default function ResetPassword({ isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const passwordValidationError = validatePassword(formData.newPassword);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            toast.error(passwordValidationError);
            return;
        }

        setIsLoading(true);
        try {
            await resetUserPassword(email, token, formData.newPassword, formData.confirmPassword);
            toast.success('Password reset successful');
            navigate('/log-in');
        } catch (error) {
            toast.error(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="reset-password-illustration">
                <img src={resetPasswordIllustration} alt="Reset Password" />
            </div>

            <div className="reset-password-form-container">
                <div className="reset-password-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="reset-password-heading">Reset Password</h2>
                    <p className="reset-password-subheading">Please enter your new password</p>

                    <form onSubmit={handleSubmit}>
                        <InputField 
                            type="password" 
                            name="newPassword" 
                            value={formData.newPassword} 
                            onChange={handleChange} 
                            placeholder="New Password" 
                        />

                        <div className="password-requirements">
                            <p>Password must contain:</p>
                            <ul>
                                <li>At least 6 characters</li>
                                <li>One uppercase letter (A-Z)</li>
                                <li>One special character (!@#$%^&*)</li>
                            </ul>
                        </div>

                        {passwordError && <div className="error-message">{passwordError}</div>}

                        <InputField 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Confirm Password" 
                        />

                        <Button text="Reset Password" isLoading={isLoading} />
                    </form>
                </div>
            </div>
        </div>
    );
}
