const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Post route to insert a new memo
    router.post('/', async (req, res) => {
        try {
            const { email, memo } = req.body;
            console.log('Received email:', email, 'memo:', memo);

            const { rows } = await pool.query(
                'INSERT INTO memos (email, memo, done) VALUES ($1, $2, false) RETURNING *',
                [email, memo]
            );

            console.log('Inserted memo:', rows[0]);
            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error creating memo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Get route to fetch memos
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const { email } = decoded;
            const { rows } = await pool.query(
                'SELECT * FROM memos WHERE email = $1',
                [email]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching memos:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Put route to edit a specific memo
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { memo } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const { email } = decoded;
            const { rows } = await pool.query(
                'UPDATE memos SET memo = $1 WHERE id = $2 AND email = $3 RETURNING *',
                [memo, id, email]
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

    // Put route to edit a specific memo's done status
    router.put('/:id/done', async (req, res) => {
        try {
            const { id } = req.params;
            const done = req.body.done;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const { email } = decoded;
            const { rows } = await pool.query(
                'UPDATE memos SET done = $1 WHERE id = $2 AND email = $3 RETURNING *',
                [done, id, email]
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

    // Delete route to remove an existing memo
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_secret_key');
            const { email } = decoded;
            await pool.query('DELETE FROM memos WHERE id = $1 AND email = $2', [id, email]);
            res.json({ message: 'Memo deleted successfully' });
        } catch (error) {
            console.error('Error deleting memo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};