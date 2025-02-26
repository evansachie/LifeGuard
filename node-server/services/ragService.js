const { OpenAIEmbeddings } = require('@langchain/openai');
const { ChatOpenAI } = require('@langchain/openai');
const { Document } = require('langchain/document');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables');
const { getDb, client } = require('../config/mongodb');
require('dotenv').config();

// Initialize the embedding model
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
});

// Initialize the chat model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.2,
});

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

// Query the RAG system
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
    
    // Create the prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a health assistant for the LifeGuard wearable health monitoring system.
      Answer the question based on the following context.
      If you don't know the answer, just say you don't know. Don't make up an answer.
      
      Context: {context}
      
      Question: {question}
      
      Answer:
    `);
    
    // Create the RAG chain
    const chain = RunnableSequence.from([
      {
        context: () => context,
        question: () => question,
      },
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);
    
    // Run the chain
    const response = await chain.invoke({});
    
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

module.exports = {
  initDocumentStore,
  createDocumentCollection,
  processDocuments,
  queryRag,
};
