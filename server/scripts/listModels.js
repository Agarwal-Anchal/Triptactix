const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please add your API key to the .env file:');
    console.log('GEMINI_API_KEY=your_api_key_here');
    return;
  }

  try {
    console.log('🔍 Listing available Gemini models...\n');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test different common model names
    const commonModels = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'gemini-pro-vision'
    ];

    console.log('📋 Testing common Gemini models:\n');
    
    for (const modelName of commonModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple prompt
        const result = await model.generateContent('Say "Hello" if you can respond');
        const response = await result.response;
        
        console.log(`✅ ${modelName} - WORKING`);
        console.log(`   Response: "${response.text().trim()}"`);
        console.log('');
        
      } catch (error) {
        console.log(`❌ ${modelName} - ERROR: ${error.message}`);
        console.log('');
      }
    }

    // Recommend the best model
    console.log('💡 Recommendation:');
    console.log('For travel planning, try these models in order of preference:');
    console.log('1. gemini-1.5-pro (best reasoning and context)');
    console.log('2. gemini-1.5-flash (faster, good quality)');
    console.log('3. gemini-pro (reliable fallback)');

  } catch (error) {
    console.error('❌ Error testing models:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n🔑 Your API key appears to be invalid. Please check:');
      console.log('1. The API key is correct');
      console.log('2. The Gemini API is enabled');
      console.log('3. You have proper permissions');
    }
  }
}

// Run the script
listAvailableModels().catch(console.error);
