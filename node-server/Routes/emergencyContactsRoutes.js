const express = require('express');
const jwt = require('jsonwebtoken');
const { sendEmergencyContactNotification, sendEmergencyAlert, sendTestAlert } = require('../services/emailService');
const { sendEmergencyAlertSMS, sendVerificationSMS, sendTestAlertSMS } = require('../services/smsService');
const crypto = require('crypto');

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

            // Start a transaction
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Insert the contact
                const { rows } = await client.query(
                    'INSERT INTO "EmergencyContacts" ("Name", "Phone", "Email", "Relationship", "UserId", "IsVerified", "Priority", "Role", "CreatedAt", "UpDatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
                    [name, phone, email, relationship, userId, false, priority, role]
                );
                
                // Get user info for the email - handle case where AspNetUsers might not exist
                let userData = { name: 'A LifeGuard user', email: decoded.email || email };
                
                try {
                    const userResult = await client.query(
                        'SELECT "Name" as name, "Email" as email, "Phone" as phone FROM "AspNetUsers" WHERE "Id" = $1',
                        [userId]
                    );
                    
                    if (userResult.rows.length > 0) {
                        userData = userResult.rows[0];
                    }
                } catch (userError) {
                    console.log('AspNetUsers table might not exist, using default user data:', userError.message);
                    // Continue with default userData
                }
                
                // Send email notification
                const emailResult = await sendEmergencyContactNotification(rows[0], userData);
                
                // Commit the transaction
                await client.query('COMMIT');
                
                // Return the created contact with email status
                res.status(201).json({
                    ...rows[0],
                    notificationSent: emailResult.success
                });
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Error creating emergency contact:', error);
            res.status(500).json({ error: 'Failed to create emergency contact' });
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

    // Verify emergency contact
    router.get('/verify/:token', async (req, res) => {
        try {
            const { token } = req.params;
            
            // Decode the token
            const decodedData = Buffer.from(token, 'base64').toString('utf-8');
            const [contactId, email] = decodedData.split(':');
            
            if (!contactId || !email) {
                return res.status(400).json({ error: 'Invalid verification token' });
            }
            
            // Update the contact verification status
            const { rows } = await pool.query(
                'UPDATE "EmergencyContacts" SET "IsVerified" = true, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $1 AND "Email" = $2 RETURNING *',
                [contactId, email]
            );
            
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
            res.status(500).json({ error: 'Failed to verify emergency contact' });
        }
    });

    // Send emergency alert to all contacts
    router.post('/alert', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            
            const { message, location, medicalInfo } = req.body;
            
            // Get user info - handle case where AspNetUsers might not exist
            let userData = { 
                id: userId, 
                name: 'A LifeGuard user', 
                email: decoded.email || 'user@lifeguard.com',
                phone: 'Not available'
            };
            
            try {
                const userResult = await pool.query(
                    'SELECT "Name" as name, "Email" as email, "Phone" as phone FROM "AspNetUsers" WHERE "Id" = $1',
                    [userId]
                );
                
                if (userResult.rows.length > 0) {
                    userData = { ...userData, ...userResult.rows[0] };
                }
            } catch (userError) {
                console.log('AspNetUsers table might not exist, using default user data:', userError.message);
                // Continue with default userData
            }
            
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
            
            // Get user info - handle case where AspNetUsers might not exist
            let userData = { 
                id: userId, 
                name: 'A LifeGuard user', 
                email: decoded.email || 'user@lifeguard.com',
                phone: 'Not available'
            };
            
            try {
                const userResult = await pool.query(
                    'SELECT "Name" as name, "Email" as email, "Phone" as phone FROM "AspNetUsers" WHERE "Id" = $1',
                    [userId]
                );
                
                if (userResult.rows.length > 0) {
                    userData = { ...userData, ...userResult.rows[0] };
                }
            } catch (userError) {
                console.log('AspNetUsers table might not exist, using default user data:', userError.message);
                // Continue with default userData
            }
            
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