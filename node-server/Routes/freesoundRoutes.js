const express = require('express');
const axios = require('axios');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/audio-proxy', async (req, res) => {
        try {
            const { url } = req.body;
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'stream',
                headers: {
                    'Origin': 'https://freesound.org',
                    'Authorization': `Token ${process.env.FREESOUND_API_KEY}`
                }
            });

            // Forward content type header
            res.setHeader('Content-Type', response.headers['content-type']);
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            // Pipe the audio stream
            response.data.pipe(res);
        } catch (error) {
            console.error('Proxy error:', error);
            res.status(500).json({ error: 'Error proxying audio' });
        }
    });

    return router;
};
