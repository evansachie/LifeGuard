const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Get all emergency contacts for a user
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // Decode the token without verification to get the email
            const decoded = jwt.decode(token);
            const user_id = decoded.nameid || decoded.sub; // Get email from token

            const { rows } = await pool.query(
                'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
                [user_id]
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
            const user_id = decoded.nameid || decoded.sub;
            const { name, phone, email, relationship } = req.body;

            const { rows } = await pool.query(
                'INSERT INTO emergency_contacts (user_id, name, phone, email, relationship) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [user_id, name, phone, email, relationship]
            );
            res.status(201).json(rows[0]);
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
            const user_id = decoded.nameid || decoded.sub;
            const { id } = req.params;
            const { name, phone, email, relationship } = req.body;

            const { rows } = await pool.query(
                'UPDATE emergency_contacts SET name = $1, phone = $2, email = $3, relationship = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
                [name, phone, email, relationship, id, user_id]
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
            const user_id = decoded.nameid || decoded.sub;
            const { id } = req.params;

            const { rowCount } = await pool.query(
                'DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2',
                [id, user_id]
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

    return router;
};