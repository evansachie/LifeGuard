const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // POST route to calculate calories
    router.post('/calculate', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const user_id = decoded.user_id;
            const { age, weight, height, gender, activityLevel } = req.body;

            // Validate and sanitize input values
            const sanitizedAge = parseInt(age, 10);
            const sanitizedWeight = parseFloat(weight);
            const sanitizedHeight = parseInt(height, 10);

            if (isNaN(sanitizedAge) || isNaN(sanitizedWeight) || isNaN(sanitizedHeight)) {
                return res.status(400).json({ error: 'Invalid input values' });
            }

            // Calculate calorie values
            const bmr = calculateBMR(gender, sanitizedAge, sanitizedWeight, sanitizedHeight);
            const activityFactor = getActivityFactor(activityLevel);
            const restingCalories = Math.round(bmr);
            const calorieIntake = Math.round(bmr * activityFactor);
            const caloriesBurned = Math.round(calorieIntake - restingCalories);

            // Check if the user's measurements exist in the database
            const { rows: measurements } = await pool.query(
                'SELECT id FROM user_measurements WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
                [user_id]
            ).catch((err) => {
                console.error('Error querying user measurements:', err);
                return res.status(500).json({ error: 'Internal server error' });
            });

            let user_measurement_id;

            if (measurements.length > 0) {
                // Update the existing measurements
                await pool.query(
                    'UPDATE user_measurements SET age = $1, weight = $2, height = $3, gender = $4, activity_level = $5 WHERE id = $6',
                    [sanitizedAge, sanitizedWeight, sanitizedHeight, gender, activityLevel, measurements[0].id]
                ).catch((err) => {
                    console.error('Error updating user measurements:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                });

                user_measurement_id = measurements[0].id;
            } else {
                // Insert a new measurement
                const { rows: newMeasurement } = await pool.query(
                    'INSERT INTO user_measurements (user_id, age, weight, height, gender, activity_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                    [user_id, sanitizedAge, sanitizedWeight, sanitizedHeight, gender, activityLevel]
                ).catch((err) => {
                    console.error('Error inserting user measurements:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                });

                user_measurement_id = newMeasurement[0].id;
            }

            // Insert calorie values into the calories table
            await pool.query(
                'INSERT INTO calories (user_measurement_id, resting_calories, calorie_intake, calories_burned) VALUES ($1, $2, $3, $4)',
                [user_measurement_id, restingCalories, calorieIntake, caloriesBurned]
            ).catch((err) => {
                console.error('Error inserting calorie values:', err);
                return res.status(500).json({ error: 'Internal server error' });
            });

            res.json({ restingCalories, calorieIntake, caloriesBurned });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.error('Token expired:', err);
                return res.status(401).json({ error: 'Token expired' });
            } else if (err.name === 'JsonWebTokenError') {
                console.error('Invalid token:', err);
                return res.status(401).json({ error: 'Invalid token' });
            } else {
                console.error('Error verifying token or executing database operations:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    });

    // Helper functions for BMR calculation and activity factor
    const calculateBMR = (gender, age, weight, height) => {
        const weightInKg = parseFloat(weight);
        const heightInCm = parseFloat(height);
        let bmr;

        if (gender === 'male') {
            bmr = 88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * age;
        } else {
            bmr = 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * age;
        }

        return bmr;
    };

    const getActivityFactor = (activityLevel) => {
        switch (activityLevel) {
            case 'sedentary':
                return 1.2;
            case 'lightly':
                return 1.375;
            case 'moderately':
                return 1.55;
            case 'very':
                return 1.725;
            case 'extra':
                return 1.9;
            default:
                return 1.2;
        }
    };

    return router;
};