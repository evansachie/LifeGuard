const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const notificationService = new NotificationService(pool);

    // Get all medications for a user
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                `SELECT m.*, 
                    (SELECT COUNT(*) FROM "MedicationTracking" mt 
                     WHERE mt."MedicationId" = m."Id" AND mt."Taken" = true) as doses_taken,
                    (SELECT COUNT(*) FROM "MedicationTracking" mt 
                     WHERE mt."MedicationId" = m."Id") as total_doses
                FROM "Medications" m 
                WHERE m."UserId" = $1 
                ORDER BY m."Time"[1] ASC`,
                [userId]
            );
            res.json({ success: true, data: result.rows });
        } catch (error) {
            console.error('Error fetching medications:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch medications' });
        }
    });

    // Add new medication
    router.post('/add', async (req, res) => {
        const client = await pool.connect();
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { name, dosage, frequency, times, startDate, endDate, notes } = req.body;

            await client.query('BEGIN');

            // Add medication
            const medicationResult = await client.query(
                `INSERT INTO "Medications" 
                ("UserId", "Name", "Dosage", "Frequency", "Time", "StartDate", "EndDate", "Notes")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [userId, name, dosage, frequency, times, startDate, endDate, notes]
            );

            // Set up reminders
            const medication = medicationResult.rows[0];
            await Promise.all(times.map(time => 
                client.query(
                    `INSERT INTO "MedicationReminders" ("UserId", "MedicationId", "ReminderTime")
                    VALUES ($1, $2, $3)`,
                    [userId, medication.Id, time]
                )
            ));

            await notificationService.scheduleRemindersForDay();

            await client.query('COMMIT');
            res.json({ success: true, data: medication });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error adding medication:', error);
            res.status(500).json({ success: false, error: 'Failed to add medication' });
        } finally {
            client.release();
        }
    });

    // Update medication
    router.put('/:id', async (req, res) => {
        const client = await pool.connect();
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { id } = req.params;
            const { name, dosage, frequency, times, startDate, endDate, notes, active } = req.body;

            await client.query('BEGIN');

            const result = await client.query(
                `UPDATE "Medications" 
                SET "Name" = $1, "Dosage" = $2, "Frequency" = $3, "Time" = $4, 
                    "StartDate" = $5, "EndDate" = $6, "Notes" = $7, "Active" = $8, 
                    "UpdatedAt" = CURRENT_TIMESTAMP
                WHERE "Id" = $9 AND "UserId" = $10
                RETURNING *`,
                [name, dosage, frequency, times, startDate, endDate, notes, active, id, userId]
            );

            // Update reminders
            await client.query(
                `DELETE FROM "MedicationReminders" WHERE "MedicationId" = $1`,
                [id]
            );

            if (active) {
                await Promise.all(times.map(time => 
                    client.query(
                        `INSERT INTO "MedicationReminders" ("UserId", "MedicationId", "ReminderTime")
                        VALUES ($1, $2, $3)`,
                        [userId, id, time]
                    )
                ));
            }

            await notificationService.scheduleRemindersForDay();

            await client.query('COMMIT');
            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating medication:', error);
            res.status(500).json({ success: false, error: 'Failed to update medication' });
        } finally {
            client.release();
        }
    });

    // Delete medication
    router.delete('/:id', async (req, res) => {
        const client = await pool.connect();
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { id } = req.params;

            await client.query('BEGIN');

            // Delete reminders first
            await client.query(
                `DELETE FROM "MedicationReminders" WHERE "MedicationId" = $1`,
                [id]
            );

            // Delete tracking records
            await client.query(
                `DELETE FROM "MedicationTracking" WHERE "MedicationId" = $1`,
                [id]
            );

            // Delete medication
            const result = await client.query(
                `DELETE FROM "Medications" WHERE "Id" = $1 AND "UserId" = $2 RETURNING *`,
                [id, userId]
            );

            await client.query('COMMIT');

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Medication not found' });
            }

            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting medication:', error);
            res.status(500).json({ success: false, error: 'Failed to delete medication' });
        } finally {
            client.release();
        }
    });

    // Track medication dose
    router.post('/track', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { medicationId, scheduledTime, taken } = req.body;

            // Validate input
            if (!medicationId || !scheduledTime) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields' 
                });
            }

            // Verify medication belongs to user
            const medicationCheck = await pool.query(
                `SELECT "Id" FROM "Medications" WHERE "Id" = $1 AND "UserId" = $2`,
                [medicationId, userId]
            );

            if (medicationCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Medication not found'
                });
            }

            const result = await pool.query(
                `INSERT INTO "MedicationTracking" 
                ("UserId", "MedicationId", "ScheduledTime", "Taken", "TakenAt")
                VALUES ($1, $2, $3, $4, CASE WHEN $4 = true THEN CURRENT_TIMESTAMP ELSE NULL END)
                RETURNING *`,
                [userId, medicationId, scheduledTime, taken]
            );

            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Error tracking medication:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to track medication',
                details: error.message 
            });
        }
    });

    // Get compliance rate
    router.get('/compliance', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const result = await pool.query(
                `SELECT 
                    COUNT(CASE WHEN "Taken" = true THEN 1 END)::float / 
                    NULLIF(COUNT(*), 0)::float * 100 as compliance_rate
                FROM "MedicationTracking"
                WHERE "UserId" = $1
                AND "CreatedAt" >= CURRENT_DATE - INTERVAL '30 days'`,
                [userId]
            );

            res.json({ 
                success: true, 
                data: result.rows[0]?.compliance_rate || 0 
            });
        } catch (error) {
            console.error('Error calculating compliance rate:', error);
            res.status(500).json({ success: false, error: 'Failed to calculate compliance rate' });
        }
    });

    return router;
};
