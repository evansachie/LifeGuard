const express = require('express');
const jwt = require('jsonwebtoken');

const settingsRoutes = (pool) => {
    const router = express.Router();

    // GET route to fetch user settings
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const user_id = decoded.user_id;

            // Check if user_id is valid
            if (!user_id) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const query = 'SELECT campaign_name, day_end_time, notification_enabled, measurement_unit FROM user_settings WHERE user_id = $1';
            const result = await pool.query(query, [user_id]);

            if (result.rows.length === 0) {
                // If the user settings record does not exist, create a new one with default values
                const insertQuery = `
                    INSERT INTO user_settings (user_id, campaign_name, day_end_time, notification_enabled, measurement_unit)
                    VALUES ($1, '', '00:00:00', false, 'Metric')
                    RETURNING campaign_name, day_end_time, notification_enabled, measurement_unit;
                `;
                const insertResult = await pool.query(insertQuery, [user_id]);
                res.status(200).json(insertResult.rows[0]);
            } else {
                res.status(200).json(result.rows[0]);
            }
        } catch (error) {
            console.error('Error fetching user settings:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // PUT route to update user settings
    router.put('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const user_id = decoded.user_id;

            // Check if user_id is valid
            if (!user_id) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const { campaign_name, day_end_time, notification_enabled, measurement_unit } = req.body;

            const query = `
                UPDATE user_settings
                SET campaign_name = $2, day_end_time = $3, notification_enabled = $4, measurement_unit = $5
                WHERE user_id = $1;
            `;
            const values = [user_id, campaign_name, day_end_time, notification_enabled, measurement_unit];

            await pool.query(query, values);
            res.status(200).json({ message: 'User settings updated successfully' });
        } catch (error) {
            console.error('Error updating user settings:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

module.exports = settingsRoutes;