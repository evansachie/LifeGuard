const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    // Get emergency preferences
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                `SELECT * FROM "EmergencyPreferences" WHERE "UserId" = $1`,
                [userId]
            );

            // Return preferences or default values
            const preferences = result.rows[0] || {
                SendToEmergencyContacts: true,
                SendToAmbulanceService: false
            };

            res.json({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error('Error fetching emergency preferences:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch emergency preferences'
            });
        }
    });

    // Update emergency preferences
    router.put('/', async (req, res) => {
        const client = await pool.connect();
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            // Extract preferences from request body - support both camelCase and PascalCase for flexibility
            let sendToEmergencyContacts = req.body.sendToEmergencyContacts ?? req.body.SendToEmergencyContacts;
            let sendToAmbulanceService = req.body.sendToAmbulanceService ?? req.body.SendToAmbulanceService;
            
            // Default values if not provided
            sendToEmergencyContacts = sendToEmergencyContacts !== undefined ? sendToEmergencyContacts : true;
            sendToAmbulanceService = sendToAmbulanceService !== undefined ? sendToAmbulanceService : false;

            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO "EmergencyPreferences" (
                    "UserId", 
                    "SendToEmergencyContacts", 
                    "SendToAmbulanceService", 
                    "CreatedAt", 
                    "UpdatedAt"
                )
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT ("UserId") 
                DO UPDATE SET 
                    "SendToEmergencyContacts" = $2,
                    "SendToAmbulanceService" = $3,
                    "UpdatedAt" = CURRENT_TIMESTAMP
                RETURNING *`,
                [
                    userId, 
                    sendToEmergencyContacts, 
                    sendToAmbulanceService
                ]
            );

            await client.query('COMMIT');
            res.json({ 
                success: true, 
                data: result.rows[0] 
            });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating emergency preferences:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to update emergency preferences' 
            });
        } finally {
            client.release();
        }
    });

    return router;
};
