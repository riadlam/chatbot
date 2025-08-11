const axios = require('axios');

async function startBotShop2() {
    console.log('🚀 Starting bot for Shop 2...\n');
    
    try {
        // Start bot for shop 2, bot 2
        console.log('1️⃣ Starting bot for shop 2, bot 2...');
        const startResponse = await axios.post('http://localhost:3000/api/bot/start', {
            shop_id: 2,
            bot_id: 2,
            session_id: 'bot_2_test'
        });
        
        console.log('✅ Bot start response:', startResponse.data);
        
        if (startResponse.data.success) {
            console.log('\n🎉 Bot started successfully for Shop 2!');
            console.log('📱 Now try sending a message to your WhatsApp bot:');
            console.log('- Send "hello" (should respond with "sama")');
            console.log('- Send "hi" (should respond with "Hi there! How can I help you today?")');
            console.log('- Send "help" (should respond with "Need help? I\'m here to assist you!")');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.response ? error.response.data : error.message);
    }
}

startBotShop2(); 