const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();

// Configure logging
const logEmailError = (functionName, error, userId = null, contactEmail = null) => {
  console.error(`[${functionName}] Error sending email:`, {
    timestamp: new Date().toISOString(),
    userId,
    contactEmail,
    error: error.message,
    stack: error.stack
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify email configuration on startup
transporter.verify()
  .then(() => console.log('Email service is ready'))
  .catch(err => console.error('Email service configuration error:', err));

const readHTMLFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};

// Default frontend URL if not set in environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://lifeguard-vert.vercel.app';

// Helper function to get user data
const getUserData = async (userId, pool) => {
  try {
    const userResult = await pool.query(
      'SELECT "FirstName", "LastName", "Email" as email, "Phone" as phone, "MedicalInfo" as medicalinfo FROM "AspNetUsers" WHERE "Id" = $1',
      [userId]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const firstName = (user.firstname || '').trim();
      const lastName = (user.lastname || '').trim();
      return {
        name: [firstName, lastName].filter(Boolean).join(' ') || 'Unknown User',
        email: user.email,
        phone: user.phone,
        medicalInfo: user.medicalinfo
      };
    }
    return { name: 'Unknown User', email: null };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { name: 'Unknown User', email: null };
  }
};

const sendEmergencyContactNotification = async (contactData, userId, email, pool) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-contact-notification.html');
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    // Ensure contactId is a string
    const contactId = String(contactData.Id);
    const contactEmail = contactData.Email;
    
    // Get user info for the email
    const userData = await getUserData(userId, pool);
    
    // Create the token string and encode it
    const tokenString = `${contactId}:${contactEmail}`;
    const cleanTokenString = tokenString.trim().replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');
    const verificationToken = Buffer.from(cleanTokenString).toString('base64');
    
    // Create the verification URL
    const verificationLink = `${FRONTEND_URL}/verify-emergency-contact?token=${verificationToken}&contactId=${contactId}&contactEmail=${contactEmail}`;
    
    const replacements = {
      contactName: contactData.Name || 'Emergency Contact',
      userName: userData.name,
      verificationLink: verificationLink,
      appLogo: 'https://res.cloudinary.com/dat7slh1u/image/upload/v1740908768/logo_moe3jm.png',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `${userData.name} added you as an emergency contact on LifeGuard`,
      html: htmlToSend
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', { messageId: info.messageId, to: contactData.Email });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logEmailError('sendEmergencyContactNotification', error, userId, contactData.Email);
    return { success: false, error: error.message };
  }
};

const sendEmergencyAlert = async (contactData, userId, email, pool, emergencyData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-alert.html');
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    // Get user info for the email
    const userData = await getUserData(userId, pool);
    
    const trackingToken = Buffer.from(`${userId}:${new Date().toISOString()}`).toString('base64');
    const trackingLink = `${FRONTEND_URL}/emergency-tracking?token=${trackingToken}`;
    
    const replacements = {
      contactName: contactData.Name || 'Emergency Contact',
      userName: userData.name,
      userPhone: userData.phone || 'Not provided',
      emergencyMessage: emergencyData.message || 'Emergency alert triggered',
      emergencyLocation: emergencyData.location || 'Location not available',
      trackingLink: trackingLink,
      medicalInfo: userData.medicalInfo || 'No medical information provided',
      appLogo: 'https://res.cloudinary.com/dat7slh1u/image/upload/v1740908768/logo_moe3jm.png',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard EMERGENCY" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `EMERGENCY ALERT from ${userData.name}`,
      html: htmlToSend,
      priority: 'high'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Emergency email sent:', { messageId: info.messageId, to: contactData.Email });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logEmailError('sendEmergencyAlert', error, userId, contactData.Email);
    return { success: false, error: error.message };
  }
};

const sendTestAlert = async (contactData, userId, email, pool) => {
  try {
    const templatePath = path.join(__dirname, '../templates/test-alert.html');
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    // Get user info for the email
    const userData = await getUserData(userId, pool);
    
    const replacements = {
      contactName: contactData.Name || 'Emergency Contact',
      userName: userData.name,
      appLogo: 'https://res.cloudinary.com/dat7slh1u/image/upload/v1740908768/logo_moe3jm.png',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `Test Alert - LifeGuard Emergency Contact System`,
      html: htmlToSend
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Test alert sent:', { messageId: info.messageId, to: contactData.Email });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logEmailError('sendTestAlert', error, userId, contactData.Email);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmergencyContactNotification,
  sendEmergencyAlert,
  sendTestAlert
};
