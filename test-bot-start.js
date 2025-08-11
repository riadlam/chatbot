const BotStarter = require('./src/bot-starter.js');

async function testBotStart() {
    console.log('🧪 Testing Bot Start...\n');
    
    try {
        const botStarter = new BotStarter();
        
        console.log('🚀 Starting bot for shop_id=1, bot_id=1...');
        const result = await botStarter.startBot(1, 1);
        
        console.log('✅ Bot start result:', result);
        
        if (result.success) {
            console.log('🎉 Bot started successfully!');
            console.log('📱 Session ID:', result.sessionId);
            console.log('🔍 Now try sending a message to your WhatsApp number');
            console.log('💬 The bot should respond with a debug message');
            
            // Keep the process running for 30 seconds to test
            console.log('\n⏰ Keeping bot running for 30 seconds...');
            setTimeout(() => {
                console.log('⏰ Test completed. Stopping bot...');
                botStarter.stopBot(1);
                process.exit(0);
            }, 30000);
            
        } else {
            console.log('❌ Bot start failed:', result.error);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testBotStart(); 