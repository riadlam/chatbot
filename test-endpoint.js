const axios = require('axios');

async function testEndpoints() {
    console.log('🧪 Testing Endpoints...\n');
    
    try {
        // Test 1: Health endpoint
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Health response:', healthResponse.data);
        
        // Test 2: Try bot start endpoint
        console.log('\n2️⃣ Testing bot start endpoint...');
        try {
            const startResponse = await axios.post('http://localhost:3000/api/bot/start', {
                shop_id: 1,
                bot_id: 1,
                session_id: 'test_123'
            });
            console.log('✅ Bot start response:', startResponse.data);
        } catch (error) {
            console.log('❌ Bot start error:', error.response?.status, error.response?.data);
        }
        
        // Test 3: Try a non-existent endpoint
        console.log('\n3️⃣ Testing non-existent endpoint...');
        try {
            const fakeResponse = await axios.get('http://localhost:3000/api/fake');
            console.log('✅ Fake endpoint response:', fakeResponse.data);
        } catch (error) {
            console.log('❌ Fake endpoint error:', error.response?.status, error.response?.data);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the function
testEndpoints().then(() => {
    console.log('\n✅ Endpoint test completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 