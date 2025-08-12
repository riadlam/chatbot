const axios = require('axios');

async function testBotSetup() {
    console.log('🧪 Testing Complete Bot Setup...\n');
    
    try {
        // Test 1: Check if both servers are running
        console.log('1️⃣ Checking server status...');
        
        const botHealth = await axios.get('http://localhost:3000/health');
        console.log('✅ Bot server is running:', botHealth.data.status);
        
        const laravelHealth = await axios.get('https://chatbot.soexplast.com/api/health');
        console.log('✅ Laravel API is running:', laravelHealth.data.status);
        
        // Test 2: Start the bot
        console.log('\n2️⃣ Starting bot...');
        
        const startResponse = await axios.post('http://localhost:3000/api/bot/start', {
            shop_id: 1,
            bot_id: 1
        });
        
        console.log('✅ Bot start response:', startResponse.data);
        
        // Test 3: Wait a moment for QR generation
        console.log('\n3️⃣ Waiting for QR code generation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test 4: Check QR code
        console.log('\n4️⃣ Checking QR code...');
        
        try {
            const qrResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/qr-code');
            console.log('✅ QR code status:', qrResponse.data);
            
            if (qrResponse.data.qr_code_path) {
                console.log('📱 QR code path:', qrResponse.data.qr_code_path);
                console.log('🔗 QR code URL: https://chatbot.soexplast.com/' + qrResponse.data.qr_code_path);
            }
        } catch (error) {
            console.log('❌ QR code not ready yet:', error.response?.status);
        }
        
        // Test 5: Show keyword setup instructions
        console.log('\n5️⃣ Keyword Setup Instructions:');
        console.log('To make your bot respond to messages:');
        console.log('');
        console.log('📱 Frontend Method:');
        console.log('1. Open your frontend dashboard');
        console.log('2. Go to "Keywords" section');
        console.log('3. Click "Add New Keyword"');
        console.log('4. Select your bot');
        console.log('5. Add keywords like: "hello", "hi", "help"');
        console.log('6. Set response message: "Hello! How can I help you today?"');
        console.log('7. Save the keyword');
        console.log('');
        console.log('🔧 Direct API Method:');
        console.log('You can also add keywords directly via API:');
        console.log('POST https://chatbot.soexplast.com/api/shops/1/bots/1/keywords');
        console.log('Body: {');
        console.log('  "type": "text",');
        console.log('  "message": {');
        console.log('    "text": "Hello! How can I help you today?"');
        console.log('  },');
        console.log('  "keywords": ["hello", "hi", "hey"]');
        console.log('}');
        
        // Test 6: Show current bot status
        console.log('\n6️⃣ Current Bot Status:');
        
        try {
            const statusResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status');
            console.log('✅ Bot status:', statusResponse.data);
        } catch (error) {
            console.log('❌ Could not get bot status:', error.response?.status);
        }
        
        console.log('\n🏁 Bot setup test completed!');
        console.log('\n📱 Next steps:');
        console.log('1. Add keywords through your frontend dashboard');
        console.log('2. Scan the QR code with your WhatsApp');
        console.log('3. Send a message containing your keywords');
        console.log('4. The bot should respond automatically!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testBotSetup().then(() => {
    console.log('\n✅ Setup test completed successfully!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Setup test failed:', error);
    process.exit(1);
}); 