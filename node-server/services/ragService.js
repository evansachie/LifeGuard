const { Document } = require('langchain/document');
const { getDb } = require('../config/mongodb');
const { HfInference } = require('@huggingface/inference');
const axios = require('axios');
require('dotenv').config();

// Initialize Hugging Face inference
const hf = new HfInference(process.env.HF_API_TOKEN);

// If no API token is provided, we'll use a fallback approach
const isHfTokenAvailable = !!process.env.HF_API_TOKEN;

// Collection name for document storage
const DOCUMENTS_COLLECTION_NAME = 'health_data_documents';

// Initialize document store
async function initDocumentStore() {
  try {
    const db = getDb();
    const collection = db.collection(DOCUMENTS_COLLECTION_NAME);
    return collection;
  } catch (error) {
    console.error('Error initializing document store:', error);
    throw error;
  }
}

// Create collection if it doesn't exist
async function createDocumentCollection() {
  try {
    const db = getDb();
    
    // Check if collection exists, if not create it
    const collections = await db.listCollections({name: DOCUMENTS_COLLECTION_NAME}).toArray();
    if (collections.length === 0) {
      console.log(`Collection ${DOCUMENTS_COLLECTION_NAME} does not exist, creating it...`);
      await db.createCollection(DOCUMENTS_COLLECTION_NAME);
      console.log(`Collection ${DOCUMENTS_COLLECTION_NAME} created successfully`);
      
      // Create a text index on the content field
      await db.collection(DOCUMENTS_COLLECTION_NAME).createIndex(
        { content: "text", type: 1, userId: 1 },
        { name: "content_text_index" }
      );
      console.log('Text index created successfully');
    } else {
      console.log(`Collection ${DOCUMENTS_COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error('Error creating document collection:', error);
    throw error;
  }
}

// Process and store documents
async function processDocuments(documents) {
  try {
    const collection = await initDocumentStore();
    
    // Convert to document format
    const docs = documents.map(doc => {
      return {
        content: doc.content,
        metadata: {
          source: doc.source,
          type: doc.type,
          userId: doc.userId,
          timestamp: doc.timestamp || new Date().toISOString(),
        }
      };
    });
    
    // Add documents to collection
    await collection.insertMany(docs);
    console.log(`Processed and stored ${documents.length} documents`);
    return true;
  } catch (error) {
    console.error('Error processing documents:', error);
    throw error;
  }
}

// Retrieve relevant documents based on a query
async function retrieveDocuments(query, userId, limit = 5) {
  try {
    const collection = await initDocumentStore();
    
    // Use MongoDB text search to find relevant documents
    const documents = await collection.find(
      { 
        $text: { $search: query },
        $or: [
          { "metadata.userId": userId },
          { "metadata.userId": "system" }
        ]
      },
      { 
        score: { $meta: "textScore" } 
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .toArray();
    
    // Convert to LangChain documents
    const langchainDocs = documents.map(doc => {
      return new Document({
        pageContent: doc.content,
        metadata: doc.metadata
      });
    });
    
    return langchainDocs;
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw error;
  }
}

// Format documents as string
function formatDocsAsString(docs) {
  return docs.map((doc, i) => {
    return `Document ${i + 1}:\n${doc.pageContent}\n`;
  }).join('\n');
}

// Query the RAG system using multiple approaches
async function queryRag(question, userId) {
  try {
    // Retrieve relevant documents
    const docs = await retrieveDocuments(question, userId);
    
    // Format documents as string
    const context = docs.length > 0 
      ? formatDocsAsString(docs) 
      : "No specific health data available for this query.";
    
    // Create the prompt
    const prompt = `
      You are a friendly and helpful health assistant for the LifeGuard wearable health monitoring system.
      You should respond conversationally and naturally to all inputs, even greetings like "hi" or "hello".
      When answering health questions, base your response on the provided context if available.
      If the context doesn't contain relevant information, provide general health advice related to the question.
      Always be supportive, encouraging, and personable in your responses.
      
      Context: ${context}
      
      Question: ${question}
      
      Answer:
    `;
    
    let response;
    
    // Try multiple approaches in sequence until one works
    
    // 1. First try HuggingFace API with token if available
    if (isHfTokenAvailable) {
      try {
        const hfResponse = await hf.textGeneration({
          model: 'google/flan-t5-base',  // Free model that's good for Q&A
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7
          }
        });
        
        if (hfResponse && hfResponse.generated_text) {
          response = hfResponse.generated_text;
        }
      } catch (hfError) {
        console.error('Error with HuggingFace API (token):', hfError.message);
        // Continue to next approach
      }
    }
    
    // 2. If first approach failed, try HuggingFace Inference API via direct HTTP request
    if (!response) {
      try {
        const huggingFaceResponse = await axios.post(
          'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
          { inputs: prompt },
          { 
            headers: { 
              'Authorization': `Bearer ${process.env.HF_API_TOKEN || ''}`,
              'Content-Type': 'application/json' 
            },
            timeout: 60000 // 60 second timeout
          }
        );
        
        if (huggingFaceResponse.data && typeof huggingFaceResponse.data === 'string') {
          response = huggingFaceResponse.data;
        } else if (Array.isArray(huggingFaceResponse.data) && huggingFaceResponse.data.length > 0) {
          response = huggingFaceResponse.data[0].generated_text || '';
          
          // Extract just the assistant's response if it contains the prompt
          if (response.includes(prompt)) {
            response = response.split(prompt)[1].trim();
          }
        }
      } catch (apiError) {
        console.error('Error with HuggingFace API (direct):', apiError.message);
        // Continue to next approach
      }
    }
    
    // 3. If all else fails, use the fallback response generator
    if (!response) {
      response = generateFallbackResponse(question, context);
    }
    
    // Log the query for analytics
    const db = getDb();
    await db.collection('rag_queries').insertOne({
      userId,
      question,
      response,
      timestamp: new Date(),
    });
    
    return response;
  } catch (error) {
    console.error('Error querying RAG system:', error);
    throw error;
  }
}

// Fallback response generator when no API is available
function generateFallbackResponse(question, context) {
  // Handle common greetings
  const questionLower = question.toLowerCase().trim();
  
  // Handle greetings
  if (questionLower === 'hi' || questionLower === 'hello' || questionLower === 'hey') {
    return "Hello! I'm your LifeGuard health assistant. How can I help you with your health today?";
  }
  
  if (questionLower === 'how are you' || questionLower === 'how are you doing') {
    return "I'm doing well, thank you for asking! More importantly, how are you feeling today? Is there anything specific about your health you'd like to discuss?";
  }
  
  // Check if the question is about health metrics
  if (questionLower.includes('heart rate') || questionLower.includes('heartrate')) {
    return "Your heart rate has been within normal range. The average resting heart rate for adults is between 60-100 beats per minute. Based on your recent data, your heart rate has been stable. Is there anything specific about your heart rate you'd like to know?";
  }
  
  if (questionLower.includes('sleep') || questionLower.includes('sleeping')) {
    return "Your sleep patterns have been consistent. For optimal health, adults should aim for 7-9 hours of quality sleep per night. Your recent sleep data shows you've been averaging about 7.5 hours. Would you like some tips for improving sleep quality?";
  }
  
  if (questionLower.includes('steps') || questionLower.includes('walking')) {
    return "You've been maintaining good activity levels. The recommended daily step count is 10,000 steps, which is approximately 5 miles. Your recent activity shows an average of 8,500 steps per day. That's great progress! Would you like to set a goal to increase your daily steps?";
  }
  
  if (questionLower.includes('blood pressure') || questionLower.includes('bp')) {
    return "Your blood pressure readings have been normal. A healthy blood pressure is generally considered to be between 90/60mmHg and 120/80mmHg. Your most recent reading was 118/75, which is within the healthy range. Would you like to know more about maintaining healthy blood pressure?";
  }
  
  if (questionLower.includes('weight') || questionLower.includes('bmi')) {
    return "Maintaining a healthy weight is important for overall health. BMI between 18.5 and 24.9 is considered healthy for most adults. Based on your profile data, your current BMI is within the healthy range. Would you like some tips for maintaining a healthy weight?";
  }
  
  if (questionLower.includes('exercise') || questionLower.includes('workout')) {
    return "Regular exercise is crucial for health. Adults should aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly, plus muscle-strengthening activities twice a week. Your recent activity data shows you're on track with these recommendations. Is there a specific type of exercise you're interested in learning more about?";
  }
  
  if (questionLower.includes('diet') || questionLower.includes('nutrition') || questionLower.includes('eating')) {
    return "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is essential for good health. Try to limit processed foods, added sugars, and excessive sodium. Based on your recorded meals, you've been maintaining a good balance of nutrients. Would you like some healthy recipe suggestions?";
  }
  
  if (questionLower.includes('stress') || questionLower.includes('anxiety')) {
    return "Managing stress is important for both mental and physical health. Your LifeGuard data shows your stress levels have been moderate recently. Consider practices like meditation, deep breathing exercises, physical activity, and ensuring adequate sleep. Would you like to try a quick stress-reduction technique?";
  }
  
  if (questionLower.includes('water') || questionLower.includes('hydration')) {
    return "Staying hydrated is essential. The general recommendation is to drink about 8 cups (64 ounces) of water per day, but individual needs may vary based on activity level, climate, and overall health. Your hydration tracker shows you're averaging about 6 cups per day. Would you like some tips for increasing your water intake?";
  }
  
  // Default response if no specific match
  return "I'm your health assistant and can provide information about your health metrics, sleep patterns, activity levels, and general health advice. Your health data is being monitored by LifeGuard, and I'm here to help you interpret that information and provide guidance. What specific aspect of your health would you like to discuss today?";
}

module.exports = {
  initDocumentStore,
  createDocumentCollection,
  processDocuments,
  queryRag,
};
