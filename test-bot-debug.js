const axios = require('axios');

async function testBotDebug() {
    console.log('🔍 Testing Bot Debug Mode...\n');
    
    try {
        // 1. Check if bot is running
        console.log('1️⃣ Checking if bot is running...');
        const statusResponse = await axios.get('http://localhost:3000/api/bot/status/2', {
            timeout: 5000
        });
        console.log('✅ Bot status response:', statusResponse.data);
        
        // 2. Check Laravel session status
        console.log('\n2️⃣ Checking Laravel session status...');
        const sessionResponse = await axios.get('https://chatbot.soexplast.com/api/webhook/session-status/2', {
            timeout: 5000
        });
        console.log('✅ Session status:', sessionResponse.data);
        
        // 3. Test message processing endpoint
        console.log('\n3️⃣ Testing message processing...');
        const messageResponse = await axios.post('https://chatbot.soexplast.com/api/webhook/message', {
            shop_id: 2,
            whatsapp_number: '1234567890',
            customer_name: 'Test User',
            message_content: 'hello test',
            direction: 'inbound',
            message_type: 'text',
            media_url: null,
            message_id: 'test_message_123',
            is_bot_response: false
        }, {
            timeout: 5000
        });
        console.log('✅ Message stored:', messageResponse.data);
        
        console.log('\n🎉 All tests completed!');
        console.log('\n📱 Now try sending a message to your WhatsApp bot:');
        console.log('- Send any message to the bot number');
        console.log('- The bot should respond with debug information');
        
    } catch (error) {
        console.log('❌ Error:', error.response ? error.response.data : error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 The bot server might not be running. Try starting it with:');
            console.log('node start-bot-shop2.js');
        }
    }
}

testBotDebug(); 