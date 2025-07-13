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

// Test the connection
transporter.verify(function(error) {
  if (error) {
    console.error('Email service not properly configured:', error);
  } else {
    console.log('Email server connection verified and ready to send messages');
  }
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

const sendEmergencyAlert = async (contactData, userData, emergencyData) => {
  try {
    // Choose template based on recipient type
    let templatePath;
    if (contactData.Id === 'ambulance-service') {
      templatePath = path.join(__dirname, '../templates/ambulance-alert.html');
    } else {
      templatePath = path.join(__dirname, '../templates/emergency-alert.html');
    }
    
    const html = await readHTMLFile(templatePath);
    const template = handlebars.compile(html);

    // Always fetch full user profile for alerts
    const profile = await fetchFullUserProfile(userData.id);
    
    // Simplified tracking link with just userId instead of a token
    const trackingLink = `${FRONTEND_URL}/emergency-tracking?userId=${profile.id}`;
    
    // Hardcoded test coordinates for testing if no real coordinates are present
    // 6.6745, -1.5716 = Kumasi, Ghana (used as test coordinates)
    const testCoordinates = {
      latitude: "6.6745",
      longitude: "-1.5716"
    };
    
    // Parse location for coordinates
    let coordinates = null;
    if (emergencyData.location && typeof emergencyData.location === 'string') {
      // Try to extract coordinates if they're in the location string (lat,lng format)
      const coordMatch = emergencyData.location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (coordMatch) {
        coordinates = {
          latitude: coordMatch[1],
          longitude: coordMatch[2]
        };
      } 
      // For testing purposes, use test coordinates if none found
      // In production, you'd remove this and only use real coordinates
      else if (process.env.NODE_ENV !== 'production') {
        coordinates = testCoordinates;
      }
    } 
    // For testing purposes, use test coordinates if location is not available
    // In production, you'd remove this and only use real coordinates
    else if (process.env.NODE_ENV !== 'production') {
      coordinates = testCoordinates;
    }
    
    // Extract location address without coordinates for clarity
    let locationAddress = null;
    if (emergencyData.location && emergencyData.location.includes('(')) {
      locationAddress = emergencyData.location.split('(')[0].trim();
    }
    
    const replacements = {
      contactName: contactData.Name,
      userName: profile.name || profile.userName || 'A LifeGuard user',
      userPhone: profile.phoneNumber || 'Not available',
      age: profile.age != null ? profile.age : 'Not available',
      gender: profile.gender || 'Not available',
      weight: profile.weight != null ? profile.weight : 'Not available',
      height: profile.height != null ? profile.height : 'Not available',
      bio: profile.bio || 'Not available',
      emergencyMessage: emergencyData.message || 'Emergency alert triggered',
      emergencyLocation: emergencyData.location || 'Location currently unavailable',
      locationAddress: locationAddress,
      coordinates: coordinates,
      trackingLink: trackingLink,
      medicalInfo: profile.bio || 'No medical information provided',
      appLogo: 'https://github-production-user-asset-6210df.s3.amazonaws.com/102630199/418295595-9dbe93f6-9f68-41b5-9b9e-4312683f5b34.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250301T174742Z&X-Amz-Expires=300&X-Amz-Signature=b487a8f40e2dbddd3c608dd8832b02c042b270ecf5fb68a6c7c32041417f3f48&X-Amz-SignedHeaders=host',
      currentYear: new Date().getFullYear()
    };

    const htmlToSend = template(replacements);
    const mailOptions = {
      from: `"LifeGuard EMERGENCY" <${process.env.EMAIL_USER}>`,
      to: contactData.Email,
      subject: `EMERGENCY ALERT from ${profile.name || profile.userName || 'a LifeGuard user'}`,
      html: htmlToSend,
      priority: 'high'
    };


    if (contactData.Id === 'ambulance-service') {
      console.log('*** Sending AMBULANCE SERVICE email ***');
      console.log('Using template:', templatePath);
    }
    
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (emailError) {
      console.error('ERROR SENDING EMAIL:', emailError.message);
      console.error('Email failed to:', contactData.Email);
      return { success: false, error: emailError.message };
    }
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
  sendMedicationReminderEmail
};
