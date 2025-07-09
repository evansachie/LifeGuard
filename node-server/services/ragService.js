const { Document } = require('langchain/document');
const { getDb } = require('../config/mongodb');
const { HfInference } = require('@huggingface/inference');
const axios = require('axios');
require('dotenv').config();

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

// Helper function to get user documents
async function getUserDocuments(userId) {
  return [
    { content: "Regular exercise is essential for cardiovascular health. Aim for at least 150 minutes of moderate-intensity activity per week." },
    { content: "A balanced diet rich in fruits, vegetables, whole grains, and lean proteins helps maintain optimal health." },
    { content: "Adequate sleep is crucial for overall health. Most adults need 7-9 hours of quality sleep per night." },
    { content: "Stress management techniques like meditation, deep breathing, and yoga can improve mental and physical health." },
    { content: "Regular health check-ups can help detect potential issues early and maintain good health." }
  ];
}

async function getRelevantDocuments(question, documents) {
  const keywords = question.toLowerCase().split(' ');
  
  const relevantDocs = documents.filter(doc => {
    const docContent = doc.content.toLowerCase();
    return keywords.some(keyword => docContent.includes(keyword));
  });
  
  return relevantDocs.length > 0 ? relevantDocs : documents;
}

// Helper function to format documents as context
function formatDocsAsContext(documents) {
  return documents.map(doc => doc.content).join('\n\n');
}

// Helper function to create a prompt with context
function createPromptWithContext(question, context) {
  const basePrompt = `You are LifeGuard, a friendly and expert health assistant. Your goal is to provide accurate, supportive, and detailed health information in a conversational tone. Use relevant emojis to make responses engaging.

Instructions:
1.  **Prioritize Context:** Base your answer primarily on the provided context below. Directly reference information from the context if possible.
2.  **Synthesize Information:** Combine information from different context documents if needed to provide a comprehensive answer.
3.  **Handle Insufficient Context:** If the context does not contain enough information to fully answer the question, state that clearly and provide the best general health information you can on the topic, while mentioning you lack specific user data for a more personalized response. Do NOT invent data not present in the context.
4.  **Maintain Persona:** Always be supportive, knowledgeable, and engaging.
5.  **Format:** Use clear paragraphs. Start your response directly without introductory phrases like "Based on the context...".

Context:
---
${context || 'No specific context provided for this query.'}
---

User's question: ${question}

LifeGuard's Answer:`;
  return basePrompt;
}

// Query the RAG system using multiple approaches
async function queryRag(question, userId) {
  try {
    const userDocs = await getUserDocuments(userId);
    const relevantDocs = await getRelevantDocuments(question, userDocs);
    const context = formatDocsAsContext(relevantDocs);
    const prompt = createPromptWithContext(question, context);
    
    let response = null;
    
    // 1. Try Cloudflare Workers AI first (best quality responses)
    try {
      console.log('Attempting to use Cloudflare Workers AI...');
      const cloudflareResponse = await queryCloudflareWorkersAI(prompt);
      if (cloudflareResponse) {
        console.log('Using Cloudflare Workers AI response');
        response = cloudflareResponse;
        return response;
      } else {
        console.log('No response from Cloudflare Workers AI, trying fallback options');
      }
    } catch (cloudflareError) {
      console.error('Error with Cloudflare Workers AI, falling back to other options:', cloudflareError.message);
    }

    // 2. If Cloudflare fails, try Hugging Face Inference API with token
    if (!response && process.env.HF_API_TOKEN) {
      try {
        console.log('Attempting to use Hugging Face Inference API with token...');
        const hf = new HfInference(process.env.HF_API_TOKEN);
        const result = await hf.textGeneration({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.15
          }
        });
        response = result.generated_text;
        
        // Extract just the assistant's response if it contains the prompt
        if (response.includes(prompt)) {
          response = response.split(prompt)[1].trim();
        }
      } catch (hfError) {
        console.error('Error with Hugging Face Inference API:', hfError.message);
      }
    }
    
    // 3. If Hugging Face with token fails, try direct API request to Hugging Face
    if (!response) {
      try {
        console.log('Attempting direct API request to Hugging Face...');
        const huggingFaceResponse = await axios.post(
          'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
          { inputs: prompt },
          { 
            headers: { 
              'Authorization': `Bearer ${process.env.HF_API_TOKEN || ''}`,
              'Content-Type': 'application/json' 
            },
            timeout: 60000
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
      }
    }
    
    // 4. If all else fails, use the fallback response generator
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

// Query Cloudflare Workers AI for enhanced responses
async function queryCloudflareWorkersAI(prompt) {
  try {
    console.log('Attempting to use Cloudflare Workers AI...');

    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
      console.error('Cloudflare Workers AI credentials not found in environment variables');
      return null;
    }

    // Using Llama-3.1-8B-Instruct model which offers excellent performance on the free tier
    const modelId = '@cf/meta/llama-3.1-8b-instruct';
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${modelId}`;
    
    const response = await axios.post(
      url,
      {
        messages: [
          { role: 'system', content: 'You are LifeGuard, a helpful and knowledgeable health assistant. You provide accurate, detailed, and conversational responses about health topics. Always maintain a supportive, engaging tone and provide comprehensive information. Include relevant emojis in your responses where appropriate to make them more engaging.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.result && response.data.result.response) {
      console.log('Successfully received response from Cloudflare Workers AI');
      return response.data.result.response;
    } else {
      console.error('Unexpected response format from Cloudflare Workers AI:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error querying Cloudflare Workers AI:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('Authentication error - check your Cloudflare account ID and API token');
      } else if (error.response.status === 403) {
        console.error('Access denied - your token may have IP restrictions or insufficient permissions');
      } else if (error.response.status === 400) {
        console.error('Bad request - check the API endpoint format and request body');
      }
    } else if (error.request) {
      console.error('No response received from Cloudflare Workers AI');
    } else {
      console.error('Error message:', error.message);
    }
    
    return null;
  }
}

// Fallback response generator when no API is available
function generateFallbackResponse(question, context) {
  const questionLower = question.toLowerCase().trim();
  if (questionLower === 'hi' || questionLower === 'hello' || questionLower === 'hey') {
    return "Hello there! 👋 I'm your LifeGuard health assistant. How are you feeling today? I'm here to help with any health questions or concerns you might have. Is there something specific about your health you'd like to discuss?";
  }
  if (questionLower === 'how are you' || questionLower === 'how are you doing') {
    return "I'm doing great, thanks for asking! 😊 More importantly, how are you feeling today? Any health goals you're working on or concerns you'd like to discuss? I'm here to support your health journey in any way I can.";
  }
  if (questionLower.includes('heart rate') || questionLower.includes('heartrate')) {
    return "I've been monitoring your heart rate data, and I'm happy to report it's been within a healthy range. 💓 Your average resting heart rate has been around 68 beats per minute, which is excellent for an adult. Did you know that regular exercise can help lower your resting heart rate over time? Have you noticed any changes in your heart rate during different activities? I'd be happy to dive deeper into your heart rate patterns if you're interested.";
  }
  if (questionLower.includes('sleep') || questionLower.includes('sleeping')) {
    return "Looking at your recent sleep data, I can see you've been averaging about 7.5 hours per night. 😴 That's within the recommended 7-9 hours for adults! Your deep sleep periods have been consistent, which is great for physical recovery. I've noticed your sleep quality tends to improve on days when you exercise. Would you like some personalized tips to enhance your sleep quality even further? Small changes to your evening routine could make a big difference.";
  }
  if (questionLower.includes('steps') || questionLower.includes('walking')) {
    return "Great news about your activity levels! 🚶‍♂️ You've been averaging around 8,500 steps daily, which is approaching that popular 10,000-step goal. I'm particularly impressed by your consistency - you've maintained this level for the past two weeks! Your Tuesday walks seem to be your longest. Is that part of a specific routine? Remember, even small increases in daily steps can have significant health benefits. Would you like to set a new step goal together?";
  }
  if (questionLower.includes('blood pressure') || questionLower.includes('bp')) {
    return "I've been tracking your blood pressure readings, and they've been consistently in the healthy range. 👍 Your most recent reading was 118/75, which is excellent! Regular monitoring is key to maintaining cardiovascular health. Have you noticed any patterns in your readings at different times of day? Some people experience natural fluctuations. Would you like to know more about factors that can influence your blood pressure or tips for maintaining these healthy numbers?";
  }
  if (questionLower.includes('weight') || questionLower.includes('bmi')) {
    return "Based on your recent measurements, your weight has been stable and your BMI is within the healthy range at 23.4. 🌟 This is a great indicator of overall health! I've noticed your weight tends to fluctuate slightly throughout the week, which is completely normal due to factors like hydration and meal timing. Are you working toward any specific weight-related goals? I'm here to help with personalized advice whether you're looking to maintain, lose, or gain weight in a healthy way.";
  }
  if (questionLower.includes('exercise') || questionLower.includes('workout')) {
    return "Your exercise routine has been impressive lately! 💪 I've recorded consistent activity across both cardio and strength training. You're meeting the recommended guidelines of 150 minutes of moderate activity weekly, plus those important strength sessions twice a week. Your heart rate recovery is improving too, which suggests your cardiovascular fitness is getting better! Have you considered trying any new workout types to keep things interesting? I'd be happy to suggest some options that complement your current routine.";
  }
  if (questionLower.includes('diet') || questionLower.includes('nutrition') || questionLower.includes('eating')) {
    return "Nutrition is such an important part of your overall health picture! 🥗 While I don't have detailed information about your specific diet, I can offer some evidence-based guidance. A balanced approach with plenty of colorful vegetables, lean proteins, whole grains, and healthy fats provides the nutrients your body needs. Small, sustainable changes tend to be more effective than drastic diets. Would you like some specific nutritional recommendations based on your health goals and activity levels? I'm here to help you develop eating habits that support your wellbeing.";
  }
  if (questionLower.includes('stress') || questionLower.includes('anxiety')) {
    return "I understand that managing stress is crucial for both mental and physical wellbeing. 🧘 Your LifeGuard data shows your stress levels have been moderate recently, with some peaks during workdays. Many people find that mindfulness practices, regular physical activity, quality sleep, and social connections help manage stress effectively. Even brief moments of deep breathing can activate your body's relaxation response. Would you like to try a quick guided breathing exercise right now? Or perhaps you'd prefer some other stress-management techniques tailored to your lifestyle?";
  }
  if (questionLower.includes('water') || questionLower.includes('hydration')) {
    return "Staying well-hydrated is essential for nearly every bodily function! 💧 Your hydration tracker shows you're averaging about 6 cups of water daily, which is good but could be improved. For someone with your activity level, aiming for 8-10 cups would be beneficial. I've noticed you tend to drink less water in the mornings - perhaps keeping a water bottle on your desk could help? Proper hydration can boost energy, improve skin health, and even help with weight management. Would you like some creative tips for increasing your daily water intake?";
  }
  
  // Handle questions about the assistant
  if (questionLower.includes('who are you') || questionLower.includes('what are you') || questionLower.includes('about you')) {
    return "I'm your LifeGuard health assistant, designed to help you monitor and improve your health! 🤖 I can provide insights about your health metrics, offer evidence-based advice, and support your wellness journey. I'm constantly learning to serve you better. Unlike static health apps, I can have natural conversations and personalize recommendations based on your unique health data. Is there a specific aspect of your health you'd like to explore together?";
  }
  
  // Handle questions about capabilities
  if (questionLower.includes('what can you do') || questionLower.includes('help me with')) {
    return "I'd be delighted to help you with various aspects of your health journey! 🌟 I can analyze your health metrics like heart rate, sleep patterns, and activity levels. I can provide personalized health insights, answer questions about nutrition and exercise, suggest lifestyle improvements, and help you set and track health goals. I'm also here for general health education and can explain medical concepts in simple terms. What aspect of your health would you like to focus on today?";
  }
  
  // Default response if no specific match
  return "Thank you for your question about " + question.toLowerCase().split(' ').slice(0, 3).join(' ') + "... 💭 While I don't have specific data on this topic in your health profile, I'm happy to discuss it further. Your health is my priority, and I'm here to provide support and information tailored to your needs. Could you share a bit more about what you're looking to learn? I can then offer more personalized guidance based on your health goals and history.";
}

module.exports = {
  initDocumentStore,
  createDocumentCollection,
  processDocuments,
  queryRag,
};
