/**
 * CORS Configuration for the LifeGuard API
 * This file centralizes all CORS-related settings
 */

const allowedOrigins = [
  'http://localhost:3000',
  'https://lifeguard-vq69.onrender.com',
  'https://lifeguard-vert.vercel.app',
  'https://lifeguard-node.onrender.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      // For production, uncomment the next line to enforce CORS
      // callback(new Error('Not allowed by CORS'))
      
      // For debugging, allow all origins
      callback(null, true);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
};

module.exports = {
  allowedOrigins,
  corsOptions
};
