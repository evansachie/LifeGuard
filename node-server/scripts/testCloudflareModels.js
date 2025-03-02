// Test script for comparing different Cloudflare Workers AI models
require('dotenv').config();
const axios = require('axios');

// List of models to test
const MODELS = [
  {
    id: '@cf/meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    description: 'Latest Llama model, excellent for conversational responses'
  },
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.1',
    name: 'Mistral 7B Instruct',
    description: 'High-quality instruction-following model'
  },
  {
    id: '@cf/qwen/qwen1.5-7b-chat',
    name: 'Qwen 1.5 7B Chat',
    description: 'Multilingual model with strong performance'
  },
  {
    id: '@cf/meta/llama-2-7b-chat-int8',
    name: 'Llama 2 7B Chat (Int8)',
    description: 'Quantized version of Llama 2, efficient with good quality'
  }
];

// Test prompt
const TEST_PROMPT = 'What are three important things to know about maintaining good cardiovascular health?';

async function testModel(model) {
  try {
    console.log(`\n\n🧪 Testing model: ${model.name} (${model.id})`);
    console.log(`📝 Description: ${model.description}`);
    
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
      console.error('❌ Error: Cloudflare credentials not found in environment variables');
      return null;
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model.id}`;
    
    console.log('📤 Sending test prompt...');
    
    const startTime = Date.now();
    
    const response = await axios.post(
      url,
      {
        messages: [
          { role: 'system', content: 'You are LifeGuard, a helpful and knowledgeable health assistant. You provide accurate, detailed, and conversational responses about health topics. Always maintain a supportive, engaging tone and provide comprehensive information.' },
          { role: 'user', content: TEST_PROMPT }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;

    if (response.data && response.data.result && response.data.result.response) {
      console.log(`✅ Success! Response time: ${responseTime.toFixed(2)} seconds`);
      console.log('\n' + response.data.result.response + '\n');
      
      return {
        model: model.name,
        responseTime,
        responseLength: response.data.result.response.length,
        success: true
      };
    } else {
      console.error('❌ Error: Unexpected response format');
      return {
        model: model.name,
        success: false,
        error: 'Unexpected response format'
      };
    }
  } catch (error) {
    console.error(`❌ Error testing ${model.name}:`);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      return {
        model: model.name,
        success: false,
        error: `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      };
    } else {
      console.error('Error message:', error.message);
      
      return {
        model: model.name,
        success: false,
        error: error.message
      };
    }
  }
}

async function runTests() {
  console.log('🔍 Testing Cloudflare Workers AI Models');
  console.log(`🔑 Using Account ID: ${process.env.CLOUDFLARE_ACCOUNT_ID.substring(0, 3)}...`);
  console.log(`❓ Test prompt: "${TEST_PROMPT}"`);
  
  const results = [];
  
  for (const model of MODELS) {
    const result = await testModel(model);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n\n📊 Results Summary:');
  console.log('=================');
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.model}: ${result.responseTime.toFixed(2)}s, ${result.responseLength} chars`);
    } else {
      console.log(`❌ ${result.model}: Failed - ${result.error}`);
    }
  });
  
  // Recommend the best model
  const successfulResults = results.filter(r => r.success);
  if (successfulResults.length > 0) {
    console.log('\n🏆 Recommendation:');
    
    // Sort by response time (faster is better)
    const fastestModel = [...successfulResults].sort((a, b) => a.responseTime - b.responseTime)[0];
    console.log(`⚡ Fastest model: ${fastestModel.model} (${fastestModel.responseTime.toFixed(2)}s)`);
    
    // Sort by response length (longer might be more detailed)
    const mostDetailedModel = [...successfulResults].sort((a, b) => b.responseLength - a.responseLength)[0];
    console.log(`📝 Most detailed model: ${mostDetailedModel.model} (${mostDetailedModel.responseLength} chars)`);
    
    // Overall recommendation
    const recommendedModel = MODELS.find(m => m.name === fastestModel.model);
    console.log(`\n👉 Suggested model for your LifeGuard app: ${recommendedModel.id}`);
  }
}

// Run all tests
runTests();
