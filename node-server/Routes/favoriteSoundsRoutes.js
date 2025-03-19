const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // Add a sound to favorites
    router.post('/', async (req, res) => {
        const { userId, soundId, soundName, soundUrl, previewUrl, category, duration } = req.body;
        
        try {
            // Convert duration to a number if it's a string
            const parsedDuration = parseFloat(duration);
            
            const result = await pool.query(
                `INSERT INTO favorite_sounds 
                (user_id, sound_id, sound_name, sound_url, preview_url, category, duration) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [userId, soundId.toString(), soundName, soundUrl, previewUrl, category, parsedDuration]
            );
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error adding favorite:', error);
            res.status(500).json({ error: 'Failed to add favorite', details: error.message });
        }
    });

    // Get user's favorite sounds
    router.get('/:userId', async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT * FROM favorite_sounds WHERE user_id = $1 ORDER BY created_at DESC',
                [req.params.userId]
            );
            
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            res.status(500).json({ error: 'Failed to fetch favorites' });
        }
    });

    // Remove from favorites 
    router.delete('/:userId/:soundId', async (req, res) => {
        try {
            const result = await pool.query(
                'DELETE FROM favorite_sounds WHERE user_id = $1 AND sound_id = $2 RETURNING *',
                [req.params.userId, req.params.soundId]
            );
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Favorite not found' });
            }
            
            res.json({ message: 'Favorite removed successfully' });
        } catch (error) {
            console.error('Error removing favorite:', error);
            res.status(500).json({ error: 'Failed to remove favorite' });
        }
    });

    return router;
};
