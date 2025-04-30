const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();
const axios = require('axios');

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

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://lifeguard-vert.vercel.app';

// Helper to fetch user profile and userName from .NET backend
async function fetchFullUserProfile(userId) {
  try {
    // Fetch /api/Account/{id} for userName
    const userUrl = `https://lifeguard-hiij.onrender.com/api/Account/${userId}`;
    const userRes = await axios.get(userUrl);
    const userName = userRes.data?.userName || 'A LifeGuard user';
    // Fetch /api/Account/GetProfile/{id} for profile fields
    const profileUrl = `https://lifeguard-hiij.onrender.com/api/Account/GetProfile/${userId}`;
    const profileRes = await axios.get(profileUrl);
    const profile = (profileRes.data && profileRes.data.data) ? profileRes.data.data : {};
    // Merge logic: prefer profile.name, else userName
    return {
      id: userId,
      name: profile.name || userName,
      userName,
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      phoneNumber: profile.phoneNumber,
      bio: profile.bio
    };
  } catch (error) {
    console.error('Error fetching full user profile:', error.message);
    return { id: userId, name: 'A LifeGuard user', userName: 'A LifeGuard user' };
  }
}

const sendEmergencyContactNotification = async (contactData, userData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-contact-notification.html');
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    const contactId = String(contactData.Id);
    const contactEmail = contactData.Email;
    
    let profile = userData;
    if (!userData || !userData.name || !userData.phoneNumber) {
      profile = await fetchFullUserProfile(userData?.id || userData?.userId || userData?._id);
    }
    
    const tokenString = `${contactId}:${contactEmail}`;
    console.log('Creating verification token with data:', tokenString);
    
    const cleanTokenString = tokenString.trim().replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');
    const verificationToken = Buffer.from(cleanTokenString).toString('base64');
    console.log('Generated verification token:', verificationToken);
    
    const verificationLink = `${FRONTEND_URL}/verify-emergency-contact?token=${verificationToken}&contactId=${contactId}&contactEmail=${contactEmail}`;
    console.log('Verification link:', verificationLink);
    
    const replacements = {
      contactName: contactData.Name,
      userName: profile.name || profile.userName || 'A LifeGuard user',
      verificationLink: verificationLink,
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `${profile.name || 'Someone'} added you as an emergency contact on LifeGuard`,
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

function generateTrackingToken(userId) {
  const tokenData = `${userId}:${new Date().toISOString()}`;
  return Buffer.from(tokenData).toString('base64');
}

const sendEmergencyAlert = async (contactData, userData, emergencyData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emergency-alert.html');
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);
    
    // Generate tracking token
    const trackingToken = generateTrackingToken(userData.id);
    
    // Create tracking link with token
    const trackingLink = `${FRONTEND_URL}/emergency-tracking?token=${encodeURIComponent(trackingToken)}`;
    
    const replacements = {
      userName: userData.name || 'LifeGuard User',
      userPhone: userData.phone || 'Not available',
      age: userData.age || 'Not available',
      gender: userData.gender || 'Not available',
      weight: userData.weight || 'Not available',
      height: userData.height || 'Not available',
      bio: userData.bio || 'Not available',
      contactName: contactData.Name,
      emergencyMessage: emergencyData.message || 'Emergency alert triggered',
      emergencyLocation: emergencyData.location || 'Location not available',
      medicalInfo: emergencyData.medicalInfo || 'No medical information available',
      trackingLink: trackingLink,
      appLogo: 'https://res.cloudinary.com/dat7slh1u/image/upload/v1740908768/logo_moe3jm.png',
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
    
    let profile = userData;
    if (!userData || !userData.name) {
      profile = await fetchFullUserProfile(userData?.id || userData?.userId || userData?._id);
    }
    
    const replacements = {
      contactName: contactData.Name,
      userName: profile.name || profile.userName || 'A LifeGuard user',
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `Test Emergency Alert from ${profile.name || profile.userName || 'a LifeGuard user'}`,
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

const sendMedicationReminderEmail = async (userEmail, medData, userId = null) => {
  try {
    const templatePath = path.join(__dirname, '../templates/medication-reminder.html');
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);

    let profile = {};
    if (userId) {
      profile = await fetchFullUserProfile(userId);
    }
    
    const replacements = {
      userName: profile.name || '',
      medicationName: medData.Name,
      dosage: medData.Dosage,
      time: medData.Time,
      notes: medData.Notes || '',
      currentYear: new Date().getFullYear()
    };
    
    const htmlToSend = template(replacements);
    
    const mailOptions = {
      from: `"LifeGuard" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Time to take ${medData.Name}`,
      html: htmlToSend
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Medication email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending medication reminder email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmergencyContactNotification,
  sendEmergencyAlert,
  sendTestAlert,
  sendMedicationReminderEmail,
  generateTrackingToken,
};
