const BotStarter = require('./src/bot-starter.js');

async function testBotFix() {
    const botStarter = new BotStarter();
    
    console.log('🔧 Testing Bot Fix...');
    
    // Check initial status
    console.log('\n📊 Initial Status:');
    console.log('Active bots count:', botStarter.activeBots.size);
    console.log('Active bot IDs:', Array.from(botStarter.activeBots.keys()));
    
    // Test starting bot 2
    console.log('\n🚀 Starting Bot 2...');
    try {
        const result = await botStarter.startBot(1, 2);
        console.log('Start result:', result);
        
        // Wait a bit and check status
        setTimeout(() => {
            console.log('\n📊 Status after 3 seconds:');
            const allStatus = botStarter.getAllBotsStatus();
            console.log('All bots status:', JSON.stringify(allStatus, null, 2));
            
            const bot2Status = botStarter.getBotStatus(2);
            console.log('Bot 2 status:', bot2Status);
            
            // Test the keywords API
            console.log('\n🔍 Testing keywords API...');
            const axios = require('axios');
            axios.get('http://localhost:8000/api/webhook/bot-keywords/2')
                .then(response => {
                    console.log('Keywords API response:', {
                        success: response.data.success,
                        count: response.data.data?.length || 0,
                        keywords: response.data.data?.map(k => k.trigger_word) || []
                    });
                })
                .catch(error => {
                    console.error('Keywords API error:', error.message);
                });
                
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error starting bot:', error.message);
    }
}

testBotFix();
