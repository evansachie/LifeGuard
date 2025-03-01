import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { API_ENDPOINTS, fetchWithAuth } from '../../utils/api';

function VerifyEmergencyContact({ isDarkMode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [contactData, setContactData] = useState(null);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyContact = async () => {
      if (!token) {
        setVerificationStatus('error');
        toast.error('Invalid verification token');
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.EMERGENCY_CONTACT_VERIFY(token)}`);
        const data = await response.json();

        if (data.success) {
          setVerificationStatus('success');
          setContactData(data.contact);
          toast.success('Contact verified successfully!');
        } else {
          setVerificationStatus('error');
          toast.error(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Error verifying contact:', error);
        setVerificationStatus('error');
        toast.error('Failed to verify contact');
      }
    };

    verifyContact();
  }, [token]);

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="text-center">
          {verificationStatus === 'loading' && (
            <>
              <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2">Verifying Contact</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please wait while we verify your emergency contact status...
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <FaCheckCircle className="text-5xl mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Verification Successful!</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Thank you for confirming your emergency contact status. You are now a verified emergency contact.
              </p>
              {contactData && (
                <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-semibold mb-2">Your Contact Information:</h3>
                  <p><span className="font-medium">Name:</span> {contactData.Name}</p>
                  <p><span className="font-medium">Email:</span> {contactData.Email}</p>
                  <p><span className="font-medium">Phone:</span> {contactData.Phone}</p>
                </div>
              )}
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <FaTimesCircle className="text-5xl mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We couldn't verify your emergency contact status. The link may be invalid or expired.
              </p>
            </>
          )}

          <button
            onClick={handleGoToHome}
            className={`w-full py-2 rounded-lg font-medium ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmergencyContact;
