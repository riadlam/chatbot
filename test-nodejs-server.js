const axios = require('axios');

async function testNodeJsServer() {
    console.log('🔍 Testing Node.js Bot Server...\n');
    
    try {
        // Test 1: Health check
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:3000/health', {
            timeout: 5000
        });
        
        console.log('✅ Health check successful');
        console.log('Response:', healthResponse.data);
        
        // Test 2: Bot start endpoint (without starting actual bot)
        console.log('\n2️⃣ Testing bot start endpoint...');
        const startResponse = await axios.post('http://localhost:3000/api/bot/start', {
            shop_id: 1,
            bot_id: 1,
            session_id: 'test_session'
        }, {
            timeout: 10000
        });
        
        console.log('✅ Bot start endpoint accessible');
        console.log('Response:', startResponse.data);
        
        console.log('\n🎉 Node.js Bot Server is working correctly!');
        
    } catch (error) {
        console.error('❌ Node.js Bot Server test failed:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   - Server is not running on port 3000');
            console.error('   - Please start it with: npm run bot-server');
        } else if (error.response) {
            console.error('   - Server responded with error:', error.response.status);
            console.error('   - Response:', error.response.data);
        } else {
            console.error('   - Error:', error.message);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Node.js bot server is running: npm run bot-server');
        console.log('2. Check if port 3000 is available');
        console.log('3. Verify all dependencies are installed: npm install');
    }
}

testNodeJsServer(); 