const { queryRag, createDocumentCollection } = require('../services/ragService');
const { 
  processHealthData, 
  processEnvironmentalData, 
  processMedicalKnowledge,
  processUserProfiles 
} = require('../services/dataProcessingService');

// Initialize RAG system
async function initializeRag(req, res) {
  try {
    await createDocumentCollection();
    res.status(200).json({ message: 'RAG system initialized successfully' });
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    res.status(500).json({ error: 'Failed to initialize RAG system' });
  }
}

// Query the RAG system
async function queryRagSystem(req, res) {
  try {
    const { question, userId } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const response = await queryRag(question, userId);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error querying RAG system:', error);
    res.status(500).json({ error: 'Failed to query RAG system' });
  }
}

// Process health data
async function processHealthDataEndpoint(req, res) {
  try {
    const { healthData } = req.body;
    
    if (!healthData || !Array.isArray(healthData) || healthData.length === 0) {
      return res.status(400).json({ error: 'Valid health data array is required' });
    }
    
    await processHealthData(healthData);
    res.status(200).json({ message: 'Health data processed successfully' });
  } catch (error) {
    console.error('Error processing health data:', error);
    res.status(500).json({ error: 'Failed to process health data' });
  }
}

// Process environmental data
async function processEnvironmentalDataEndpoint(req, res) {
  try {
    const { environmentalData } = req.body;
    
    if (!environmentalData || !Array.isArray(environmentalData) || environmentalData.length === 0) {
      return res.status(400).json({ error: 'Valid environmental data array is required' });
    }
    
    await processEnvironmentalData(environmentalData);
    res.status(200).json({ message: 'Environmental data processed successfully' });
  } catch (error) {
    console.error('Error processing environmental data:', error);
    res.status(500).json({ error: 'Failed to process environmental data' });
  }
}

// Process medical knowledge
async function processMedicalKnowledgeEndpoint(req, res) {
  try {
    const { medicalData } = req.body;
    
    if (!medicalData || !Array.isArray(medicalData) || medicalData.length === 0) {
      return res.status(400).json({ error: 'Valid medical data array is required' });
    }
    
    await processMedicalKnowledge(medicalData);
    res.status(200).json({ message: 'Medical knowledge processed successfully' });
  } catch (error) {
    console.error('Error processing medical knowledge:', error);
    res.status(500).json({ error: 'Failed to process medical knowledge' });
  }
}

// Process user profiles
async function processUserProfilesEndpoint(req, res) {
  try {
    const { profiles } = req.body;
    
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({ error: 'Valid profiles array is required' });
    }
    
    await processUserProfiles(profiles);
    res.status(200).json({ message: 'User profiles processed successfully' });
  } catch (error) {
    console.error('Error processing user profiles:', error);
    res.status(500).json({ error: 'Failed to process user profiles' });
  }
}

module.exports = {
  initializeRag,
  queryRagSystem,
  processHealthDataEndpoint,
  processEnvironmentalDataEndpoint,
  processMedicalKnowledgeEndpoint,
  processUserProfilesEndpoint
};
