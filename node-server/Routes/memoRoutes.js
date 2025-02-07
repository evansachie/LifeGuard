const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Get memos for a user
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id; // Get user ID from token

            const { rows } = await pool.query(
                'SELECT * FROM memos WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching memos:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Create new memo
    router.post('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const { memo } = req.body;

            const { rows } = await pool.query(
                'INSERT INTO memos (user_id, memo) VALUES ($1, $2) RETURNING *',
                [userId, memo]
            );

            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error creating memo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Update memo
    router.put('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const { id } = req.params;
            const { memo } = req.body;

            const { rows } = await pool.query(
                'UPDATE memos SET memo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [memo, id, userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Update memo done status
    router.put('/:id/done', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const { id } = req.params;
            const { done } = req.body;

            const { rows } = await pool.query(
                'UPDATE memos SET done = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [done, id, userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo done state:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Delete memo
    router.delete('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const { id } = req.params;

            const { rowCount } = await pool.query(
                'DELETE FROM memos WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json({ message: 'Memo deleted successfully' });
        } catch (error) {
            console.error('Error deleting memo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};