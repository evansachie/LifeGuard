const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (pool) => {
    // Get latest health metrics for user
    router.get('/latest', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                'SELECT * FROM "HealthMetrics" WHERE "UserId" = $1 ORDER BY "CreatedAt" DESC LIMIT 1',
                [userId]
            );

            // If no metrics exist, try to get data from user profile
            if (result.rows.length === 0) {
                const profileResult = await pool.query(
                    'SELECT "Age", "Weight", "Height", "Gender" FROM "UserProfiles" WHERE "UserId" = $1',
                    [userId]
                );

                if (profileResult.rows.length > 0) {
                    return res.json({
                        ...profileResult.rows[0],
                        fromProfile: true
                    });
                }
            }

            res.json(result.rows[0] || {});
        } catch (error) {
            console.error('Error fetching health metrics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Save health metrics
    router.post('/save', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { age, weight, height, gender, activityLevel, goal, bmr, tdee, unit } = req.body;

            const result = await pool.query(
                `INSERT INTO "HealthMetrics" 
                ("UserId", "Age", "Weight", "Height", "Gender", "ActivityLevel", "Goal", "BMR", "TDEE", "Unit")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
                [userId, age, weight, height, gender, activityLevel, goal, bmr, tdee, unit]
            );

            // Also update user profile if it exists
            await pool.query(
                `UPDATE "UserProfiles" 
                SET "Age" = $2, "Weight" = $3, "Height" = $4, "Gender" = $5, "UpdatedAt" = CURRENT_TIMESTAMP
                WHERE "UserId" = $1`,
                [userId, age, weight, height, gender]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error saving health metrics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Get metrics history
    router.get('/history', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                'SELECT * FROM "HealthMetrics" WHERE "UserId" = $1 ORDER BY "CreatedAt" DESC LIMIT 10',
                [userId]
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching metrics history:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
