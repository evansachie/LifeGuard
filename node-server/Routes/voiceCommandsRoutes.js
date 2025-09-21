const express = require('express');
const jwt = require('jsonwebtoken');
const NLPService = require('../services/nlpService');
const { sendEmergencyAlert } = require('../services/emailService');
const { sendEmergencyAlertSMS } = require('../services/smsService');

module.exports = (pool) => {
    const router = express.Router();
    const nlpService = new NLPService();

    // Process voice command
    router.post('/process', async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No authentication token provided' });
            }

            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const { command, context = {} } = req.body;

            if (!command) {
                return res.status(400).json({ error: 'Voice command is required' });
            }

            // Get user context for better command processing
            const userContext = await getUserContext(pool, userId);
            const fullContext = { ...context, ...userContext };

            // Process the command using NLP service
            const result = nlpService.processCommand(command, fullContext);

            if (!result.success) {
                return res.status(400).json(result);
            }

            // Execute actions based on the processed command
            const executionResult = await executeActions(result, pool, userId);

            res.json({
                ...result,
                execution: executionResult
            });

        } catch (error) {
            console.error('Error processing voice command:', error);
            res.status(500).json({ 
                error: 'Failed to process voice command',
                details: error.message 
            });
        }
    });

    // Process emergency voice command
    router.post('/emergency', async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No authentication token provided' });
            }

            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const { command, location, medicalInfo } = req.body;

            // Process emergency command with high priority
            const userContext = await getUserContext(pool, userId);
            const result = nlpService.processEmergencyCommand(command, {
                ...userContext,
                location,
                medicalInfo
            });

            if (!result.success) {
                return res.status(400).json(result);
            }

            // Execute emergency actions
            const emergencyResult = await executeEmergencyActions(result, pool, userId, {
                location,
                medicalInfo
            });

            res.json({
                ...result,
                emergency: true,
                execution: emergencyResult
            });

        } catch (error) {
            console.error('Error processing emergency voice command:', error);
            res.status(500).json({ 
                error: 'Failed to process emergency command',
                details: error.message 
            });
        }
    });

    // Get available voice commands
    router.get('/commands', (req, res) => {
        try {
            const commands = nlpService.getAvailableCommands();
            res.json({
                success: true,
                commands: commands,
                total: commands.length
            });
        } catch (error) {
            console.error('Error getting voice commands:', error);
            res.status(500).json({ 
                error: 'Failed to get available commands',
                details: error.message 
            });
        }
    });

    // Execute actions based on processed command
    async function executeActions(commandResult, pool, userId) {
        const results = [];

        for (const action of commandResult.actions) {
            try {
                let result = null;

                switch (action.type || action) {
                    case 'send_alert':
                        result = await sendEmergencyAlertAction(pool, userId, action);
                        break;
                    case 'get_sensor_data':
                        result = await getSensorDataAction(pool, userId);
                        break;
                    case 'get_location':
                        result = await getLocationAction();
                        break;
                    case 'connect_device':
                        result = await connectDeviceAction();
                        break;
                    case 'disconnect_device':
                        result = await disconnectDeviceAction();
                        break;
                    case 'show_medications':
                        result = await getMedicationsAction(pool, userId);
                        break;
                    case 'navigate_to':
                        result = await navigateAction(action.target);
                        break;
                    default:
                        result = { success: false, message: 'Unknown action type' };
                }

                results.push({
                    action: action.type || action,
                    success: result?.success !== false,
                    result: result
                });

            } catch (error) {
                console.error(`Error executing action ${action.type || action}:`, error);
                results.push({
                    action: action.type || action,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    // Execute emergency-specific actions
    async function executeEmergencyActions(commandResult, pool, userId, emergencyData) {
        const results = [];

        // Always send emergency alert
        try {
            const alertResult = await sendEmergencyAlertAction(pool, userId, {
                ...emergencyData,
                priority: 'critical',
                include_location: true,
                include_medical_info: true
            });
            results.push({
                action: 'emergency_alert',
                success: alertResult.success,
                result: alertResult
            });
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            results.push({
                action: 'emergency_alert',
                success: false,
                error: error.message
            });
        }

        return results;
    }

    // Action implementations
    async function sendEmergencyAlertAction(pool, userId, actionData) {
        try {
            // Get user's emergency contacts
            const { rows: contacts } = await pool.query(
                'SELECT * FROM "EmergencyContacts" WHERE "UserId" = $1 ORDER BY "Priority" ASC',
                [userId]
            );

            if (contacts.length === 0) {
                return { success: false, message: 'No emergency contacts found' };
            }

            // Get user data
            const { rows: userRows } = await pool.query(
                'SELECT "Name", "Email" FROM "Users" WHERE "Id" = $1',
                [userId]
            );

            if (userRows.length === 0) {
                return { success: false, message: 'User not found' };
            }

            const userData = userRows[0];

            // Send alerts to all contacts
            const alertResults = await Promise.all(contacts.map(async (contact) => {
                const emergencyData = {
                    id: Date.now(),
                    message: actionData.message || 'Emergency alert triggered via voice command',
                    location: actionData.location || 'Location not available',
                    medicalInfo: actionData.medicalInfo || 'No medical information provided'
                };

                // Send email alert
                const emailResult = await sendEmergencyAlert(contact, userData, emergencyData);
                
                // Send SMS alert
                const smsResult = await sendEmergencyAlertSMS(contact, userData, emergencyData);

                return {
                    contactId: contact.Id,
                    contactName: contact.Name,
                    emailSent: emailResult.success,
                    smsSent: smsResult.success
                };
            }));

            return {
                success: true,
                message: 'Emergency alerts sent',
                alertsSent: alertResults
            };

        } catch (error) {
            console.error('Error in sendEmergencyAlertAction:', error);
            return { success: false, error: error.message };
        }
    }

    async function getSensorDataAction(pool, userId) {
        try {
            // Get latest sensor data for user
            const { rows } = await pool.query(
                'SELECT * FROM "SensorData" WHERE "UserId" = $1 ORDER BY "Timestamp" DESC LIMIT 1',
                [userId]
            );

            return {
                success: true,
                data: rows[0] || null,
                message: 'Sensor data retrieved'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function getLocationAction() {
        // This would typically get location from the client
        return {
            success: true,
            message: 'Location request sent to client',
            action: 'request_location'
        };
    }

    async function connectDeviceAction() {
        return {
            success: true,
            message: 'Device connection initiated',
            action: 'connect_ble_device'
        };
    }

    async function disconnectDeviceAction() {
        return {
            success: true,
            message: 'Device disconnection initiated',
            action: 'disconnect_ble_device'
        };
    }

    async function getMedicationsAction(pool, userId) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM "Medications" WHERE "UserId" = $1 ORDER BY "Name" ASC',
                [userId]
            );

            return {
                success: true,
                medications: rows,
                count: rows.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function navigateAction(target) {
        return {
            success: true,
            message: `Navigation to ${target} initiated`,
            target: target
        };
    }

    // Get user context for better command processing
    async function getUserContext(pool, userId) {
        try {
            const { rows: userRows } = await pool.query(
                'SELECT "Name", "Email" FROM "Users" WHERE "Id" = $1',
                [userId]
            );

            const { rows: contactRows } = await pool.query(
                'SELECT "Name", "Phone", "Email" FROM "EmergencyContacts" WHERE "UserId" = $1',
                [userId]
            );

            const { rows: medicationRows } = await pool.query(
                'SELECT "Name" FROM "Medications" WHERE "UserId" = $1',
                [userId]
            );

            return {
                user: userRows[0] || {},
                emergencyContacts: contactRows,
                medications: medicationRows.map(m => m.Name),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting user context:', error);
            return {};
        }
    }

    return router;
};
