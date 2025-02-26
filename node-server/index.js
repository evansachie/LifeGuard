const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const cors = require('cors');
const memoRoutes = require('./Routes/memoRoutes');
const bmrCalculatorRoutes = require('./Routes/bmrCalculatorRoutes')
const settingsRoutes = require('./Routes/bmrCalculatorRoutes');
const emergencyContactsRoutes = require('./Routes/emergencyContactsRoutes');
const ragRoutes = require('./Routes/ragRoutes');
const { connectToDatabase } = require('./config/mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
});

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://lifeguard-vq69.onrender.com',
        'https://lifeguard-vert.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// PostgreSQL pool configuration
const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Test db connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to database successfully!');
        release();
    }
});

// Connect to MongoDB for RAG functionality
connectToDatabase()
    .then(() => console.log('Connected to MongoDB for RAG'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api/memos', memoRoutes(pool));
app.use('/api/calories', bmrCalculatorRoutes(pool));
app.use('/api/settings', settingsRoutes(pool));
app.use('/api/emergency-contacts', emergencyContactsRoutes(pool));
app.use('/api/rag', ragRoutes);

app.get('/', (req, res) => {
    res.send('LifeGuard API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});