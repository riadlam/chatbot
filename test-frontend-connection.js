const axios = require('axios');

async function testFrontendConnection() {
    console.log('🧪 Testing Frontend Connection Flow...\n');
    
    try {
        // Test 1: Check if Laravel API is accessible
        console.log('1️⃣ Testing Laravel API connection...');
        const laravelHealth = await axios.get('https://chatbot.soexplast.com/api/health');
        console.log('✅ Laravel API is running:', laravelHealth.data);
        
        // Test 2: Check if Node.js bot server is accessible
        console.log('\n2️⃣ Testing Node.js bot server connection...');
        const botHealth = await axios.get('http://localhost:3000/health');
        console.log('✅ Bot server is running:', botHealth.data);
        
        // Test 3: Simulate frontend calling Laravel to start bot
        console.log('\n3️⃣ Testing Laravel bot start endpoint...');
        try {
            const startResponse = await axios.post('https://chatbot.soexplast.com/api/shops/1/bots/1/start', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            });
            
            console.log('✅ Laravel bot start response:', startResponse.data);
            
            if (startResponse.data.success) {
                console.log('✅ Bot start successful!');
                
                // Test 4: Check bot status
                console.log('\n4️⃣ Testing bot status endpoint...');
                const statusResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status');
                console.log('✅ Bot status response:', statusResponse.data);
                
                // Test 5: Wait a bit and check for QR code
                console.log('\n5️⃣ Waiting for QR code generation...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const statusResponse2 = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status');
                console.log('✅ Bot status after 5 seconds:', statusResponse2.data);
                
            } else {
                console.log('❌ Bot start failed:', startResponse.data.message);
            }
            
        } catch (error) {
            console.log('❌ Laravel bot start error:', error.response?.status, error.response?.data);
            console.log('Error details:', error.message);
        }
        
        console.log('\n📊 Summary:');
        console.log('- Laravel API: ✅ Running');
        console.log('- Node.js Bot Server: ✅ Running');
        console.log('- Frontend should be able to connect to both services');
        console.log('');
        console.log('🔍 If you see "Initializing bot connection..." in the frontend:');
        console.log('1. Check browser console for errors');
        console.log('2. Check Laravel logs for any issues');
        console.log('3. The bot should start and generate QR code');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the function
testFrontendConnection().then(() => {
    console.log('\n✅ Frontend connection test completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 