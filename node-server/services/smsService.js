require('dotenv').config();

// This is a placeholder for a real SMS service like Twilio
// In a production environment, you would use a service like Twilio, Nexmo, or AWS SNS
const sendSMS = async (phoneNumber, message) => {
  try {
    // In a real implementation, this would call an SMS API
    console.log(`SMS would be sent to ${phoneNumber}: ${message}`);
    
    // Mock successful response
    return {
      success: true,
      sid: `mock-sms-${Date.now()}`,
      to: phoneNumber
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send emergency alert via SMS
const sendEmergencyAlertSMS = async (contactData, userData, emergencyData) => {
  try {
    // Format the message
    const message = `
EMERGENCY ALERT from ${userData.name || 'a LifeGuard user'}
${emergencyData.message || 'Emergency alert triggered'}
Location: ${emergencyData.location || 'Location not available'}
Please check your email for more details and tracking link.
`;
    
    // Send the SMS
    const result = await sendSMS(contactData.Phone, message);
    console.log('Emergency SMS sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending emergency SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send verification code via SMS
const sendVerificationSMS = async (phoneNumber, code) => {
  try {
    // Format the message
    const message = `Your LifeGuard verification code is: ${code}. This code will expire in 10 minutes.`;
    
    // Send the SMS
    const result = await sendSMS(phoneNumber, message);
    console.log('Verification SMS sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send test alert via SMS
const sendTestAlertSMS = async (contactData, userData) => {
  try {
    // Format the message
    const message = `
TEST ALERT from LifeGuard
This is a TEST message to verify that ${userData.name || 'a LifeGuard user'} can reach you in case of emergency.
No action is required.
`;
    
    // Send the SMS
    const result = await sendSMS(contactData.Phone, message);
    console.log('Test SMS sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending test SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendSMS,
  sendEmergencyAlertSMS,
  sendVerificationSMS,
  sendTestAlertSMS
};
