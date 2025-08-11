const axios = require('axios');

async function testMessageSend() {
    console.log('🧪 Testing Message Send to Bot...\n');
    
    try {
        // 1. Check bot status
        console.log('1️⃣ Checking bot status...');
        const statusResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Server status:', statusResponse.data);
        
        // 2. Send a test message to the bot
        console.log('\n2️⃣ Sending test message to bot...');
        const messageData = {
            shop_id: 2,
            whatsapp_number: '1234567890',
            customer_name: 'Test User',
            message_content: 'hello debug test',
            direction: 'inbound',
            message_type: 'text',
            media_url: null,
            message_id: 'test_debug_123',
            is_bot_response: false
        };
        
        const messageResponse = await axios.post('http://localhost:8000/api/webhook/message', messageData);
        console.log('✅ Message stored in database:', messageResponse.data);
        
        // 3. Check if bot processes the message
        console.log('\n3️⃣ Checking if bot processes message...');
        console.log('💡 The bot should now process this message and respond with debug info');
        console.log('💡 Check your WhatsApp bot for the response');
        
        console.log('\n📱 Instructions:');
        console.log('- Open WhatsApp and find your bot number');
        console.log('- Send any message (like "hello", "test", etc.)');
        console.log('- The bot should respond with debug information');
        console.log('- If no response, check the Node.js console for errors');
        
    } catch (error) {
        console.log('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testMessageSend(); 