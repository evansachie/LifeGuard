const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('lifeguard');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
  client
};
