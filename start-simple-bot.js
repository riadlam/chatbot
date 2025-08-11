const BotStarter = require('./src/bot-starter.js');

async function startSimpleBot() {
    console.log('🚀 Starting Simple Bot (No Database Storage)...\n');
    
    try {
        const botStarter = new BotStarter();
        
        console.log('📱 Starting bot for shop_id=2, bot_id=2...');
        const result = await botStarter.startBot(2, 2);
        
        console.log('✅ Bot start result:', result);
        
        if (result.success) {
            console.log('🎉 Bot started successfully!');
            console.log('📱 Session ID:', result.sessionId);
            console.log('🔧 Simplified mode: No database storage');
            console.log('💬 Send any message to your WhatsApp number');
            console.log('🤖 Bot will respond with debug message');
            
            // Keep the process running
            console.log('\n⏰ Bot is running... Press Ctrl+C to stop');
            
            // Handle graceful shutdown
            process.on('SIGINT', async () => {
                console.log('\n🛑 Stopping bot...');
                await botStarter.stopBot(2);
                process.exit(0);
            });
            
        } else {
            console.log('❌ Bot start failed:', result.error);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

startSimpleBot(); 