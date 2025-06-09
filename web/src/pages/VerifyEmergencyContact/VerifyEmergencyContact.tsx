import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaMoon, FaSun } from 'react-icons/fa';
import { toast } from 'react-toastify';
import verifyContactImage from '../../assets/verifyContactImage.svg';
import { Logo } from '../../components/Logo/Logo';
import { API_ENDPOINTS } from '../../utils/api';
import './VerifyEmergencyContact.css';

interface VerifyEmergencyContactProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface ContactData {
  Name: string;
  Email: string;
  Phone: string;
  [key: string]: string;
}

interface VerificationResponse {
  success: boolean;
  contact?: ContactData;
  error?: string;
}

const VerifyEmergencyContact = ({ isDarkMode, toggleTheme }: VerifyEmergencyContactProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const token = searchParams.get('token');
  const contactId = searchParams.get('contactId');
  const contactEmail = searchParams.get('contactEmail');

  useEffect(() => {
    const verifyContact = async (): Promise<void> => {
      if (!token && (!contactId || !contactEmail)) {
        setVerificationStatus('error');
        toast.error('Invalid verification parameters');
        return;
      }

      try {
        let response: Response;

        if (token) {
          console.log('Verifying with token:', token);
          // Make sure the token is properly URI encoded
          const encodedToken = encodeURIComponent(token);
          response = await fetch(`${API_ENDPOINTS.EMERGENCY_CONTACT_VERIFY(encodedToken)}`);
        } else {
          // Fallback to using contactId and contactEmail directly
          console.log('Verifying with contactId and contactEmail:', { contactId, contactEmail });
          // Create a token on the fly
          const fallbackToken = Buffer.from(`${contactId}:${contactEmail}`).toString('base64');
          const encodedToken = encodeURIComponent(fallbackToken);
          response = await fetch(`${API_ENDPOINTS.EMERGENCY_CONTACT_VERIFY(encodedToken)}`);
        }

        if (!response.ok) {
          throw new Error(`Verification failed with status: ${response.status}`);
        }

        const data = (await response.json()) as VerificationResponse;

        if (data.success) {
          setVerificationStatus('success');
          if (data.contact) {
            setContactData(data.contact);
          }
          toast.success('Contact verified successfully!');
        } else {
          setVerificationStatus('error');
          toast.error(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Error verifying contact:', error);
        setVerificationStatus('error');
        toast.error(
          `Failed to verify contact: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    };

    verifyContact();
  }, [token, contactId, contactEmail]);

  const handleGoToHome = (): void => {
    navigate('/');
  };

  return (
    <div className={`verify-contact-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      <div
        className={`verify-contact-illustration ${isDarkMode ? 'bg-[#2D3748]' : 'bg-[#E8EEF7]'}`}
      >
        <img src={verifyContactImage} alt="Verify Emergency Contact" />
      </div>

      <div className="verify-contact-form-container">
        <div className="verify-contact-form-card">
          <Logo />

          {verificationStatus === 'loading' && (
            <div className="verification-status">
              <FaSpinner className="status-icon spinner" />
              <h2 className="verify-contact-heading">Verifying Contact</h2>
              <p className="verify-contact-subheading">
                Please wait while we verify your emergency contact status...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="verification-status">
              <FaCheckCircle className="status-icon success" />
              <h2 className="verify-contact-heading">Verification Successful!</h2>
              <p className="verify-contact-subheading">
                Thank you for confirming your emergency contact status. You are now a verified
                emergency contact.
              </p>
              {contactData && (
                <div className="contact-info-container">
                  <h3 className="contact-info-heading">Your Contact Information:</h3>
                  <p className="contact-info-detail">
                    <span>Name:</span> {contactData.Name}
                  </p>
                  <p className="contact-info-detail">
                    <span>Email:</span> {contactData.Email}
                  </p>
                  <p className="contact-info-detail">
                    <span>Phone:</span> {contactData.Phone}
                  </p>
                </div>
              )}
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="verification-status">
              <FaTimesCircle className="status-icon error" />
              <h2 className="verify-contact-heading">Verification Failed</h2>
              <p className="verify-contact-subheading">
                We couldn&apos;t verify your emergency contact status. The link may be invalid or
                expired.
              </p>
            </div>
          )}

          <button onClick={handleGoToHome} className="home-button">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmergencyContact;
