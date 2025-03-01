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


const sendEmergencyContactNotification = async (contactData, userData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-contact-notification.html');
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    const verificationToken = Buffer.from(`${contactData.Id}:${contactData.Email}`).toString('base64');
    const verificationLink = `${process.env.FRONTEND_URL}/verify-emergency-contact?token=${verificationToken}`;
    
    const replacements = {
      contactName: contactData.Name,
      userName: userData.name || 'A LifeGuard user',
      verificationLink: verificationLink,
      appLogo: `${process.env.FRONTEND_URL}/logo.png`,
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
    const trackingLink = `${process.env.FRONTEND_URL}/emergency-tracking?token=${trackingToken}`;
    
    const replacements = {
      contactName: contactData.Name,
      userName: userData.name || 'A LifeGuard user',
      userPhone: userData.phone || 'Not provided',
      emergencyMessage: emergencyData.message || 'Emergency alert triggered',
      emergencyLocation: emergencyData.location || 'Location not available',
      trackingLink: trackingLink,
      medicalInfo: userData.medicalInfo || 'No medical information provided',
      appLogo: `${process.env.FRONTEND_URL}/logo.png`,
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
      appLogo: `${process.env.FRONTEND_URL}/logo.png`,
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
