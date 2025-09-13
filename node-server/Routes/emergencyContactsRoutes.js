const express = require('express');
const jwt = require('jsonwebtoken');
const { sendEmergencyContactNotification, sendEmergencyAlert, sendTestAlert } = require('../services/emailService');
const { sendEmergencyAlertSMS, sendTestAlertSMS } = require('../services/smsService');
const axios = require('axios');

module.exports = (pool) => {
    const router = express.Router();

    // Get all emergency contacts for a user
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const { rows } = await pool.query(
                'SELECT "Id", "Name", "Email", "Phone", "Relationship", "UserId", "IsVerified", "Priority", "Role", "CreatedAt", "UpDatedAt" FROM "EmergencyContacts" WHERE "UserId" = $1 ORDER BY "Priority" ASC, "CreatedAt" DESC',
                [userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching emergency contacts:', error);
            res.status(500).json({ error: 'Failed to fetch emergency contacts' });
        }
    });

    // Verify emergency contact - IMPORTANT: This route must be defined BEFORE other parametrized routes
    router.get('/verify', async (req, res) => {
        try {
            const token = req.query.token;
            const contactId = req.query.contactId;
            const contactEmail = req.query.contactEmail;
            
            // Check if we have a token or direct parameters
            if (!token && (!contactId || !contactEmail)) {
                return res.status(400).json({ error: 'Missing verification parameters' });
            }
            
            let finalContactId, finalContactEmail;
            
            if (token) {
                console.log('Received verification token:', token);
                
                // Decode the token
                try {
                    // First decode the URL encoding, then decode base64
                    const decodedToken = decodeURIComponent(token);
                    const decodedData = Buffer.from(decodedToken, 'base64').toString('utf-8');
                    console.log('Decoded token data:', decodedData);
                    
                    // Split the decoded data and clean any special characters
                    const parts = decodedData.split(':');
                    if (parts.length !== 2) {
                        console.error('Invalid token format - expected format "id:email", got:', decodedData);
                        return res.status(400).json({ error: 'Invalid token format - expected format "id:email"' });
                    }
                    
                    finalContactId = parts[0].trim();
                    finalContactEmail = parts[1].trim().replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');
                } catch (decodeError) {
                    console.error('Error decoding token:', decodeError);
                    return res.status(400).json({ error: 'Invalid token format - could not decode' });
                }
            } else {
                // Use direct parameters
                console.log('Using direct contactId and contactEmail parameters');
                finalContactId = contactId;
                finalContactEmail = contactEmail;
            }
            
            if (!finalContactId || !finalContactEmail) {
                console.error('Invalid verification data - missing contactId or email:', { finalContactId, finalContactEmail });
                return res.status(400).json({ error: 'Invalid verification data' });
            }
            
            console.log('Attempting to verify contact:', { finalContactId, finalContactEmail });
            
            // Update the contact verification status using direct pool query
            const { rows } = await pool.query(
                'UPDATE "EmergencyContacts" SET "IsVerified" = true, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $1 AND "Email" = $2 RETURNING *',
                [finalContactId, finalContactEmail]
            );
            
            console.log('Query result:', rows.length > 0 ? 'Contact found and updated' : 'No contact found');
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Contact not found or already verified' });
            }
            
            res.json({ 
                success: true, 
                message: 'Contact verified successfully',
                contact: rows[0]
            });
        } catch (error) {
            console.error('Error verifying emergency contact:', error);
            res.status(500).json({ error: 'Failed to verify emergency contact: ' + error.message });
        }
    });

    // Create new emergency contact
    router.post('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            console.log("Decoded token:", decoded);
            
            const userId = decoded.uid;
            if (!userId) {
                return res.status(401).json({ error: 'Invalid user ID in token' });
            }
            const { name, phone, email, relationship, priority = 1, role = 'General' } = req.body;

            console.log("Attempting to insert contact with data:", { name, phone, email, relationship, userId, priority, role });
            
            // Insert the contact directly without transaction
            const { rows } = await pool.query(
                'INSERT INTO "EmergencyContacts" ("Name", "Phone", "Email", "Relationship", "UserId", "IsVerified", "Priority", "Role", "CreatedAt", "UpDatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
                [name, phone, email, relationship, userId, false, priority, role]
            );
            
            console.log('Contact inserted successfully:', rows[0]);
            
            // Get user info from .NET backend instead of AspNetUsers
            try {
                const profileUrl = `https://lifeguard-hiij.onrender.com/api/Account/GetProfile/${userId}`;
                const response = await axios.get(profileUrl);
                if (response.data) {
                    let userData = {
                        id: userId, 
                        name: response.data.name || 'A LifeGuard user', 
                        email: response.data.email || decoded.email || 'user@lifeguard.com',
                        phone: response.data.phoneNumber || 'Not available',
                        bio: response.data.bio || '',
                    };
                    
                    // Send email notification
                    const emailResult = await sendEmergencyContactNotification(rows[0], userData);
                    
                    // Return the created contact with email status
                    res.status(201).json({
                        ...rows[0],
                        notificationSent: emailResult.success
                    });
                }
            } catch (userError) {
                console.log('Could not fetch user profile from .NET backend, using default user data:', userError.message);
                // Continue with default userData
                let userData = { 
                    id: userId, 
                    name: 'A LifeGuard user', 
                    email: decoded.email || 'user@lifeguard.com',
                    phone: 'Not available'
                };
                
                // Send email notification
                const emailResult = await sendEmergencyContactNotification(rows[0], userData);
                
                // Return the created contact with email status
                res.status(201).json({
                    ...rows[0],
                    notificationSent: emailResult.success
                });
            }
        } catch (error) {
            console.error('Error creating emergency contact:', error);
            res.status(500).json({ 
                error: 'Failed to create emergency contact',
                details: error.message
            });
        }
    });

    // Update emergency contact
    router.put('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { id } = req.params;
            const { name, phone, email, relationship, priority, role } = req.body;

            const { rows } = await pool.query(
                'UPDATE "EmergencyContacts" SET "Name" = $1, "Phone" = $2, "Email" = $3, "Relationship" = $4, "Priority" = $5, "Role" = $6, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $7 AND "UserId" = $8 RETURNING *',
                [name, phone, email, relationship, priority, role, id, userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating emergency contact:', error);
            res.status(500).json({ error: 'Failed to update emergency contact' });
        }
    });

    // Delete emergency contact
    router.delete('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { id } = req.params;

            const { rowCount } = await pool.query(
                'DELETE FROM "EmergencyContacts" WHERE "Id" = $1 AND "UserId" = $2',
                [id, userId]
            );

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Error deleting emergency contact:', error);
            res.status(500).json({ error: 'Failed to delete emergency contact' });
        }
    });

    // Send emergency alert to all contacts
    router.post('/alert', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            
            const { message, location, medicalInfo, emailAddresses } = req.body;
            
            // Get user info from .NET backend instead of AspNetUsers
            try {
                const axios = require('axios');
                const profileUrl = `https://lifeguard-hiij.onrender.com/api/Account/GetProfile/${userId}`;
                const response = await axios.get(profileUrl);
                if (response.data) {
                    let userData = {
                        id: userId, 
                        name: response.data.name || 'A LifeGuard user', 
                        email: response.data.email || decoded.email || 'user@lifeguard.com',
                        phone: response.data.phoneNumber || 'Not available',
                        bio: response.data.bio || '',
                    };
                    
                    // Get user emergency preferences
                    const { rows: preferences } = await pool.query(
                        'SELECT * FROM "EmergencyPreferences" WHERE "UserId" = $1',
                        [userId]
                    );
                    
                    // Default preferences if none found
                    const userPrefs = preferences[0] || {
                        SendToEmergencyContacts: true,
                        SendToAmbulanceService: false
                    };
                    
                    let contacts = [];
                    
                    // Always get emergency contacts regardless of preference
                    // This ensures emergency alerts are always sent to contacts
                    const { rows: userContacts } = await pool.query(
                        'SELECT * FROM "EmergencyContacts" WHERE "UserId" = $1 AND "IsVerified" = true ORDER BY "Priority" ASC',
                        [userId]
                    );
                    contacts = [...userContacts];
                    
                    if (contacts.length === 0) {
                        console.log('WARNING: No verified emergency contacts found for user', userId);
                    } else {
                        console.log(`Found ${contacts.length} verified emergency contacts`);
                    }
                    
                    // Create emergency record
                    const emergencyResult = await pool.query(
                        'INSERT INTO "EmergencyAlerts" ("UserId", "Message", "Location", "Status", "CreatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
                        [userId, message, location, 'Active']
                    );
                    
                    const emergencyId = emergencyResult.rows[0].Id;
                    
                    // Prepare emergency data with real location if provided, otherwise use fallback
                    let formattedLocation = location;
                    if (!formattedLocation || formattedLocation === 'Location not available') {
                        // Use fallback location only if no real location is provided
                        formattedLocation = "Location unavailable - emergency services notified";
                        console.log('⚠️ No location data provided for emergency alert');
                    } else {
                        console.log('📍 Using provided location for emergency alert:', formattedLocation);
                    }
                    
                    const emergencyData = {
                        id: emergencyId,
                        message: message || 'Emergency alert triggered',
                        location: formattedLocation,
                        medicalInfo: medicalInfo || 'No medical information provided'
                    };
                    
                    const alertResults = [];
                    
                    // 1. Process emergency contacts if enabled
                    if (userPrefs.SendToEmergencyContacts && contacts.length > 0) {
                        console.log(`SENDING TO ${contacts.length} EMERGENCY CONTACTS: enabled by preferences`);
                        const contactAlerts = await Promise.all(contacts.map(async (contact) => {
                            // Send email alert
                            const emailResult = await sendEmergencyAlert(contact, userData, emergencyData);
                            
                            // Send SMS alert
                            const smsResult = await sendEmergencyAlertSMS(contact, userData, emergencyData);
                            
                            // Record the alert
                            await pool.query(
                                'INSERT INTO "EmergencyContactAlerts" ("EmergencyId", "ContactId", "EmailSent", "SmsSent", "CreatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
                                [emergencyId, contact.Id, emailResult.success, smsResult.success]
                            );
                            
                            alertResults.push({
                                contactId: contact.Id,
                                contactName: contact.Name,
                                contactType: 'emergency-contact',
                                emailSent: emailResult.success,
                                smsSent: smsResult.success
                            });
                            
                            return {success: emailResult.success || smsResult.success};
                        }));
                    } else if (!userPrefs.SendToEmergencyContacts) {
                        console.log('SKIPPING EMERGENCY CONTACTS: disabled by user preferences');
                    } else {
                        console.log('SKIPPING EMERGENCY CONTACTS: no verified contacts found');
                    }
                    
                    // 2. Process ambulance service - only if enabled in preferences
                    if (userPrefs.SendToAmbulanceService) {
                        console.log('SENDING TO AMBULANCE SERVICE: enabled by preferences');
                        try {
                            // Create ambulance contact with hardcoded values for direct testing
                            const ambulanceContact = {
                                Id: 'ambulance-service',
                                Name: 'Ambulance Service',
                                Email: 'navarahq@gmail.com', // Hardcoded email for testing
                                Phone: '112'
                            };
                            
                            // Send email alert to ambulance with explicit error handling
                            const emailResult = await sendEmergencyAlert(ambulanceContact, userData, emergencyData);
                            
                            alertResults.push({
                                contactType: 'ambulance-service',
                                emailSent: emailResult.success
                            });
                        } catch (ambulanceError) {
                            console.error('ERROR SENDING AMBULANCE EMAIL:', ambulanceError);
                            alertResults.push({
                                contactType: 'ambulance-service',
                                emailSent: false,
                                error: ambulanceError.message
                            });
                        }
                    } else {
                        console.log('SKIPPING AMBULANCE SERVICE: disabled by user preferences');
                    }
                    
                    // 4. If additional email addresses were provided in the request (from client)
                    if (emailAddresses && Array.isArray(emailAddresses) && emailAddresses.length > 0) {
                        for (const email of emailAddresses) {
                            if (email && typeof email === 'string' && email.includes('@')) {
                                const additionalContact = {
                                    Id: 'additional-email',
                                    Name: 'Additional Contact',
                                    Email: email,
                                    Phone: 'Not Available'
                                };
                                
                                // Send email alert
                                const emailResult = await sendEmergencyAlert(additionalContact, userData, emergencyData);
                                
                                alertResults.push({
                                    contactType: 'additional-email',
                                    emailSent: emailResult.success
                                });
                            }
                        }
                    }
                    
                    res.json({
                        success: true,
                        emergencyId: emergencyId,
                        alertsSent: alertResults
                    });
                }
            } catch (userError) {
                console.log('Could not fetch user profile from .NET backend, using default user data:', userError.message);
                // Continue with default userData
                let userData = { 
                    id: userId, 
                    name: 'A LifeGuard user', 
                    email: decoded.email || 'user@lifeguard.com',
                    phone: 'Not available'
                };
                
                // Get all verified emergency contacts
                const { rows: contacts } = await pool.query(
                    'SELECT * FROM "EmergencyContacts" WHERE "UserId" = $1 AND "IsVerified" = true ORDER BY "Priority" ASC',
                    [userId]
                );
                
                if (contacts.length === 0) {
                    return res.status(404).json({ error: 'No verified emergency contacts found' });
                }
                
                // Create emergency record
                const emergencyResult = await pool.query(
                    'INSERT INTO "EmergencyAlerts" ("UserId", "Message", "Location", "Status", "CreatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
                    [userId, message, location, 'Active']
                );
                
                const emergencyId = emergencyResult.rows[0].Id;
                
                // Send alerts to all contacts
                const alertResults = await Promise.all(contacts.map(async (contact) => {
                    // Prepare emergency data
                    const emergencyData = {
                        id: emergencyId,
                        message: message || 'Emergency alert triggered',
                        location: location || 'Location not available',
                        medicalInfo: medicalInfo || 'No medical information provided'
                    };
                    
                    // Send email alert
                    const emailResult = await sendEmergencyAlert(contact, userData, emergencyData);
                    
                    // Send SMS alert
                    const smsResult = await sendEmergencyAlertSMS(contact, userData, emergencyData);
                    
                    // Record the alert
                    await pool.query(
                        'INSERT INTO "EmergencyContactAlerts" ("EmergencyId", "ContactId", "EmailSent", "SmsSent", "CreatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
                        [emergencyId, contact.Id, emailResult.success, smsResult.success]
                    );
                    
                    return {
                        contactId: contact.Id,
                        contactName: contact.Name,
                        emailSent: emailResult.success,
                        smsSent: smsResult.success
                    };
                }));
                
                res.json({
                    success: true,
                    emergencyId: emergencyId,
                    alertsSent: alertResults
                });
            }
        } catch (error) {
            console.error('Error sending emergency alerts:', error);
            res.status(500).json({ error: 'Failed to send emergency alerts' });
        }
    });

    // Send test alert to a specific contact
    router.post('/test-alert/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { id } = req.params;
            
            // Get user info from .NET backend instead of AspNetUsers
            // For test alert, only pass userId so the full profile is always fetched
            let userData = { id: userId };
            
            // Get the specific contact
            const { rows } = await pool.query(
                'SELECT * FROM "EmergencyContacts" WHERE "Id" = $1 AND "UserId" = $2',
                [id, userId]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            
            const contact = rows[0];
            
            // Send test alerts
            const emailResult = await sendTestAlert(contact, userData);
            const smsResult = await sendTestAlertSMS(contact, userData);
            
            res.json({
                success: true,
                contactId: contact.Id,
                contactName: contact.Name,
                emailSent: emailResult.success,
                smsSent: smsResult.success
            });
        } catch (error) {
            console.error('Error sending test alert:', error);
            res.status(500).json({ error: 'Failed to send test alert' });
        }
    });

    // Get emergency alert history
    router.get('/alerts', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            
            const { rows } = await pool.query(
                `SELECT ea.*, 
                (SELECT COUNT(*) FROM "EmergencyContactAlerts" eca WHERE eca."EmergencyId" = ea."Id") as "AlertsSent",
                (SELECT COUNT(*) FROM "EmergencyContactAlerts" eca WHERE eca."EmergencyId" = ea."Id" AND eca."EmailSent" = true) as "EmailsSent",
                (SELECT COUNT(*) FROM "EmergencyContactAlerts" eca WHERE eca."EmergencyId" = ea."Id" AND eca."SmsSent" = true) as "SmsSent"
                FROM "EmergencyAlerts" ea 
                WHERE ea."UserId" = $1 
                ORDER BY ea."CreatedAt" DESC`,
                [userId]
            );
            
            res.json(rows);
        } catch (error) {
            console.error('Error fetching emergency alerts:', error);
            res.status(500).json({ error: 'Failed to fetch emergency alerts' });
        }
    });

    return router;
};