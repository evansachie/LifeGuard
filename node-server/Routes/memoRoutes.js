const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Middleware to verify JWT token from .NET backend
    const verifyToken = (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            
            // Decode the token without verification first to get the payload
            const decoded = jwt.decode(token);
            if (!decoded) {
                return res.status(401).json({ error: 'Invalid token format' });
            }

            // Extract user ID from the token claims
            // .NET tokens store the user ID in the 'nameid' claim
            const userId = decoded.nameid || decoded.sub;
            if (!userId) {
                return res.status(401).json({ error: 'Invalid token claims' });
            }

            // Store userId in request object
            req.userId = userId;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };

    // Get memos for a user
    router.get('/', verifyToken, async (req, res) => {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM memos WHERE user_id = $1 ORDER BY created_at DESC',
                [req.userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching memos:', error);
            res.status(500).json({ error: 'Failed to fetch memos' });
        }
    });

    // Create new memo
    router.post('/', verifyToken, async (req, res) => {
        try {
            const { memo } = req.body;
            if (!memo) {
                return res.status(400).json({ error: 'Memo content is required' });
            }

            const { rows } = await pool.query(
                'INSERT INTO memos (user_id, memo) VALUES ($1, $2) RETURNING *',
                [req.userId, memo]
            );
            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error creating memo:', error);
            res.status(500).json({ error: 'Failed to create memo' });
        }
    });

    // Update memo
    router.put('/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { memo } = req.body;

            const { rows } = await pool.query(
                'UPDATE memos SET memo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [memo, id, req.userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo:', error);
            res.status(500).json({ error: 'Failed to update memo' });
        }
    });

    // Update memo done status
    router.put('/:id/done', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { done } = req.body;

            const { rows } = await pool.query(
                'UPDATE memos SET done = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [done, id, req.userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo done state:', error);
            res.status(500).json({ error: 'Failed to update memo status' });
        }
    });

    // Delete memo
    router.delete('/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { rowCount } = await pool.query(
                'DELETE FROM memos WHERE id = $1 AND user_id = $2',
                [id, req.userId]
            );

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json({ message: 'Memo deleted successfully' });
        } catch (error) {
            console.error('Error deleting memo:', error);
            res.status(500).json({ error: 'Failed to delete memo' });
        }
    });

    return router;
};