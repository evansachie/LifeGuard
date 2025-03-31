const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Use jwt.decode instead of jwt.verify to match the approach in memoRoutes.js
    const decoded = jwt.decode(token);
    
    // Get the correct ID claim from the token
    const userId = decoded.uid;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token claims' });
    }
    
    req.user = decoded;
    req.userId = userId; // Add userId to the request object for consistency
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};
