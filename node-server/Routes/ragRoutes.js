const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const authMiddleware = require('../middleware/auth');

// Initialize RAG system
router.post('/initialize', authMiddleware.verifyAdmin, ragController.initializeRag);

// Query the RAG system
router.post('/query', authMiddleware.verifyToken, ragController.queryRagSystem);

// Process health data
router.post('/process/health', authMiddleware.verifyToken, ragController.processHealthDataEndpoint);

// Process environmental data
router.post('/process/environmental', authMiddleware.verifyToken, ragController.processEnvironmentalDataEndpoint);

// Process medical knowledge (admin only)
router.post('/process/medical', authMiddleware.verifyAdmin, ragController.processMedicalKnowledgeEndpoint);

// Process user profiles
router.post('/process/profiles', authMiddleware.verifyToken, ragController.processUserProfilesEndpoint);

module.exports = router;
