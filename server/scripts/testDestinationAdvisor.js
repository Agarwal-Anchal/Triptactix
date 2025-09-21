const axios = require('axios');

async function testDestinationAdvisor() {
  const baseURL = 'http://localhost:3001/api';
  
  try {
    console.log('🔍 Testing destination advisor...\n');

    // First, let's check if we have users in the database
    console.log('1. Checking for existing users...');
    const usersResponse = await axios.get(`${baseURL}/users`);
    console.log(`Found ${usersResponse.data.users?.length || 0} users\n`);
    
    if (usersResponse.data.users?.length > 0) {
      const user = usersResponse.data.users[0];
      console.log(`Using existing user: ${user.name} (${user._id})\n`);
      
      // Test destination generation
      console.log('2. Testing destination generation...');
      const startTime = Date.now();
      
      try {
        const destResponse = await axios.post(`${baseURL}/advisory/destinations/${user._id}`);
        const endTime = Date.now();
        
        console.log(`✅ Destination generation successful! (${endTime - startTime}ms)`);
        console.log('Response:', JSON.stringify(destResponse.data, null, 2));
        
      } catch (destError) {
        console.log('❌ Destination generation failed:');
        console.log('Error:', destError.response?.data || destError.message);
      }
      
    } else {
      console.log('❌ No users found. You need to create a user through the onboarding flow first.');
    }
    
  } catch (error) {
    console.error('❌ Error testing destination advisor:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running on port 3001');
    }
  }
}

testDestinationAdvisor();
