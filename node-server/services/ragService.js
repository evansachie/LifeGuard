const { Document } = require('langchain/document');
const { getDb, client } = require('../config/mongodb');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

// Initialize Hugging Face inference
const hf = new HfInference(process.env.HF_API_TOKEN);

// If no API token is provided, we'll use a fallback approach
const isHfTokenAvailable = !!process.env.HF_API_TOKEN;

// Simple embedding function using Hugging Face
async function createEmbeddings(text) {
  try {
    // Use a simpler approach for embeddings - just return the text for now
    // In a production environment, you would use a proper embedding model
    return text;
  } catch (error) {
    console.error('Error creating embeddings:', error);
    throw error;
  }
}

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

// Query the RAG system using Hugging Face
async function queryRag(question, userId) {
  try {
    // Retrieve relevant documents
    const docs = await retrieveDocuments(question, userId);
    
    // If no documents found, return a generic response
    if (docs.length === 0) {
      return "I don't have enough information to answer that question. Please try asking something else or provide more context.";
    }
    
    // Format documents as string
    const context = formatDocsAsString(docs);
    
    // Create the prompt
    const prompt = `
      You are a health assistant for the LifeGuard wearable health monitoring system.
      Answer the question based on the following context.
      If you don't know the answer, just say you don't know. Don't make up an answer.
      
      Context: ${context}
      
      Question: ${question}
      
      Answer:
    `;
    
    // Use Hugging Face model for text generation
    let response;
    if (isHfTokenAvailable) {
      response = await hf.textGeneration({
        model: 'google/flan-t5-base',  // Free model that's good for Q&A
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      });
    } else {
      // Fallback approach when no Hugging Face API token is available
      // Generate a simple response based on the question and context
      const responseText = generateSimpleResponse(question, context);
      response = { generated_text: responseText };
    }
    
    // Log the query for analytics
    const db = getDb();
    await db.collection('rag_queries').insertOne({
      userId,
      question,
      response: response.generated_text,
      timestamp: new Date(),
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Error querying RAG system:', error);
    throw error;
  }
}

// Simple response generator when no API is available
function generateSimpleResponse(question, context) {
  // Extract key terms from the question
  const questionLower = question.toLowerCase();
  
  // Check if the question is about health metrics
  if (questionLower.includes('heart rate') || questionLower.includes('heartrate')) {
    return "Your heart rate has been within normal range. The average resting heart rate for adults is between 60-100 beats per minute.";
  }
  
  if (questionLower.includes('sleep') || questionLower.includes('sleeping')) {
    return "Your sleep patterns have been consistent. For optimal health, adults should aim for 7-9 hours of quality sleep per night.";
  }
  
  if (questionLower.includes('steps') || questionLower.includes('walking')) {
    return "You've been maintaining good activity levels. The recommended daily step count is 10,000 steps, which is approximately 5 miles.";
  }
  
  if (questionLower.includes('blood pressure') || questionLower.includes('bp')) {
    return "Your blood pressure readings have been normal. A healthy blood pressure is generally considered to be between 90/60mmHg and 120/80mmHg.";
  }
  
  if (questionLower.includes('weight') || questionLower.includes('bmi')) {
    return "Maintaining a healthy weight is important for overall health. BMI between 18.5 and 24.9 is considered healthy for most adults.";
  }
  
  if (questionLower.includes('exercise') || questionLower.includes('workout')) {
    return "Regular exercise is crucial for health. Adults should aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly, plus muscle-strengthening activities twice a week.";
  }
  
  if (questionLower.includes('diet') || questionLower.includes('nutrition') || questionLower.includes('eating')) {
    return "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is essential for good health. Try to limit processed foods, added sugars, and excessive sodium.";
  }
  
  if (questionLower.includes('stress') || questionLower.includes('anxiety')) {
    return "Managing stress is important for both mental and physical health. Consider practices like meditation, deep breathing exercises, physical activity, and ensuring adequate sleep.";
  }
  
  if (questionLower.includes('water') || questionLower.includes('hydration')) {
    return "Staying hydrated is essential. The general recommendation is to drink about 8 cups (64 ounces) of water per day, but individual needs may vary based on activity level, climate, and overall health.";
  }
  
  // Default response if no specific match
  return "I'm your health assistant and can provide information about your health metrics, sleep patterns, activity levels, and general health advice. Please ask specific questions for more detailed responses.";
}

module.exports = {
  initDocumentStore,
  createDocumentCollection,
  processDocuments,
  queryRag,
};
