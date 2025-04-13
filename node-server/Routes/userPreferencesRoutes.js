const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    // Get user preferences
    router.get('/notifications', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                `SELECT * FROM "UserNotificationPreferences" WHERE "UserId" = $1`,
                [userId]
            );

            res.json({
                success: true,
                data: result.rows[0] || {
                    EmailNotifications: true,
                    ReminderLeadTime: 15
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch preferences' });
        }
    });

    // Update user preferences
    router.put('/notifications', async (req, res) => {
        const client = await pool.connect();
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { emailNotifications, reminderLeadTime } = req.body;

            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO "UserNotificationPreferences" ("UserId", "EmailNotifications", "ReminderLeadTime")
                VALUES ($1, $2, $3)
                ON CONFLICT ("UserId") 
                DO UPDATE SET 
                    "EmailNotifications" = $2,
                    "ReminderLeadTime" = $3,
                    "UpdatedAt" = CURRENT_TIMESTAMP
                RETURNING *`,
                [userId, emailNotifications, reminderLeadTime]
            );

            await client.query('COMMIT');
            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            await client.query('ROLLBACK');
            res.status(500).json({ success: false, error: 'Failed to update preferences' });
        } finally {
            client.release();
        }
    });

    return router;
};
