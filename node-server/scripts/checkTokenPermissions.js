// Script to check Cloudflare API token permissions
require('dotenv').config();
const axios = require('axios');

async function checkTokenPermissions() {
  try {
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      console.error('❌ Error: CLOUDFLARE_API_TOKEN not found in environment variables');
      return;
    }

    console.log('🔍 Checking Cloudflare API token permissions...');
    
    // First, verify the token is valid
    try {
      const verifyResponse = await axios.get(
        'https://api.cloudflare.com/client/v4/user/tokens/verify',
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (verifyResponse.data && verifyResponse.data.success) {
        console.log('✅ Token is valid and active');
        console.log(`Token ID: ${verifyResponse.data.result.id}`);
        console.log(`Status: ${verifyResponse.data.result.status}`);
      } else {
        console.error('❌ Token verification failed');
        console.log(verifyResponse.data);
        return;
      }
    } catch (verifyError) {
      console.error('❌ Error verifying token:', verifyError.message);
      return;
    }
    
    // Check account access
    if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
      console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID not found in environment variables');
      return;
    }
    
    try {
      console.log('\n🔍 Checking account access...');
      const accountResponse = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (accountResponse.data && accountResponse.data.success) {
        console.log('✅ Account access confirmed');
        console.log(`Account Name: ${accountResponse.data.result.name}`);
      } else {
        console.error('❌ Account access failed');
        console.log(accountResponse.data);
      }
    } catch (accountError) {
      console.error('❌ Error accessing account:', accountError.message);
      if (accountError.response) {
        console.log('Status:', accountError.response.status);
        console.log('Response:', accountError.response.data);
      }
    }
    
    // Test Workers AI access
    try {
      console.log('\n🔍 Testing Workers AI access...');
      // List available AI models
      const aiResponse = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/models`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (aiResponse.data && aiResponse.data.success) {
        console.log('✅ Workers AI access confirmed');
        console.log(`Available models: ${aiResponse.data.result.length}`);
        
        // Display a few models
        const models = aiResponse.data.result.slice(0, 5);
        console.log('\nSample of available models:');
        models.forEach(model => {
          console.log(`- ${model.id || model.name}`);
        });
        
        console.log('\n✅ Your token has the necessary permissions for Workers AI!');
      } else {
        console.error('❌ Workers AI access failed');
        console.log(aiResponse.data);
      }
    } catch (aiError) {
      console.error('❌ Error accessing Workers AI:', aiError.message);
      if (aiError.response) {
        console.log('Status:', aiError.response.status);
        console.log('Response:', aiError.response.data);
        
        if (aiError.response.status === 403) {
          console.log('\n❌ Your token does not have permission to access Workers AI');
          console.log('\nPlease create a new token with these permissions:');
          console.log('- Account > Workers AI > Edit');
          console.log('- Account > Account Settings > Read');
        }
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the check
checkTokenPermissions();
