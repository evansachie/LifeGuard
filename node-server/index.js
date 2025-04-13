const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const cors = require('cors');

const memoRoutes = require('./Routes/memoRoutes');
const bmrCalculatorRoutes = require('./Routes/bmrCalculatorRoutes')
const settingsRoutes = require('./Routes/bmrCalculatorRoutes');
const emergencyContactsRoutes = require('./Routes/emergencyContactsRoutes');
const ragRoutes = require('./Routes/ragRoutes');
const freesoundRoutes = require('./Routes/freesoundRoutes');
const favoriteSoundsRoutes = require('./Routes/favoriteSoundsRoutes');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const healthMetricsRoutes = require('./Routes/healthMetricsRoutes');
const medicationRoutes = require('./Routes/medicationRoutes');
const userPreferencesRoutes = require('./Routes/userPreferencesRoutes');

const { connectToDatabase } = require('./config/mongodb');
const NotificationService = require('./services/NotificationService');

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS more comprehensively
// This middleware must be added before any routes
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://lifeguard-vq69.onrender.com',
      'https://lifeguard-vert.vercel.app',
      'https://lifeguard-node.onrender.com'
    ];
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(null, true);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Log request details for debugging
  console.log(`${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'none'}`);
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

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

// Initialize notification service
const notificationService = new NotificationService(pool);

const scheduleNotifications = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const delay = tomorrow.getTime() - now.getTime();

  notificationService.scheduleRemindersForDay();

  setTimeout(() => {
    notificationService.scheduleRemindersForDay();
    setInterval(() => {
      notificationService.scheduleRemindersForDay();
    }, 24 * 60 * 60 * 1000);
  }, delay);
};

// Test db connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to database successfully!');
        scheduleNotifications();
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
app.use('/api/freesound', freesoundRoutes(pool));
app.use('/api/favorite-sounds', favoriteSoundsRoutes(pool));
app.use('/api/exercise', exerciseRoutes(pool));
app.use('/api/health-metrics', healthMetricsRoutes(pool));
app.use('/api/medications', medicationRoutes(pool));
app.use('/api/user-preferences', userPreferencesRoutes(pool));

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