const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

const sendEmergencyContactNotification = async (contactData, userData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-contact-notification.html');
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    // Ensure contactId is a string
    const contactId = String(contactData.Id);
    const contactEmail = contactData.Email;
    
    // Create the token string and encode it
    const tokenString = `${contactId}:${contactEmail}`;
    console.log('Creating verification token with data:', tokenString);
    
    // Clean the token string before encoding
    const cleanTokenString = tokenString.trim().replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');
    const verificationToken = Buffer.from(cleanTokenString).toString('base64');
    console.log('Generated verification token:', verificationToken);
    
    // Create the verification URL - no need to encode the token here as it will be encoded in the frontend
    const verificationLink = `${FRONTEND_URL}/verify-emergency-contact?token=${verificationToken}&contactId=${contactId}&contactEmail=${contactEmail}`;
    console.log('Verification link:', verificationLink);
    
    const replacements = {
      contactName: contactData.Name,
      userName: userData.name || 'A LifeGuard user',
      verificationLink: verificationLink,
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `${userData.name || 'Someone'} added you as an emergency contact on LifeGuard`,
      html: htmlToSend
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendEmergencyAlert = async (contactData, userData, emergencyData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-alert.html');
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    const trackingToken = Buffer.from(`${userData.id}:${new Date().toISOString()}`).toString('base64');
    const trackingLink = `${FRONTEND_URL}/emergency-tracking?token=${trackingToken}`;
    
    const replacements = {
      contactName: contactData.Name,
      userName: userData.name || 'A LifeGuard user',
      userPhone: userData.phone || 'Not provided',
      emergencyMessage: emergencyData.message || 'Emergency alert triggered',
      emergencyLocation: emergencyData.location || 'Location not available',
      trackingLink: trackingLink,
      medicalInfo: userData.medicalInfo || 'No medical information provided',
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard EMERGENCY" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `EMERGENCY ALERT from ${userData.name || 'a LifeGuard user'}`,
      html: htmlToSend,
      priority: 'high'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Emergency email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending emergency email:', error);
    return { success: false, error: error.message };
  }
};

const sendTestAlert = async (contactData, userData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/test-alert.html');
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    const replacements = {
      contactName: contactData.Name,
      userName: userData.name || 'A LifeGuard user',
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `Test Emergency Alert from ${userData.name || 'a LifeGuard user'}`,
      html: htmlToSend
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Test alert email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending test alert email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmergencyContactNotification,
  sendEmergencyAlert,
  sendTestAlert
};
