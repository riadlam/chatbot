const BotStarter = require('./src/bot-starter.js');

async function testStartBot2() {
    const botStarter = new BotStarter();
    
    console.log('🚀 Testing Bot 2 startup...');
    
    try {
        // Start bot 2 (assuming shop ID 1)
        const result = await botStarter.startBot(1, 2);
        console.log('Start result:', result);
        
        // Wait a bit and check status
        setTimeout(() => {
            console.log('\n📊 Bot status after 5 seconds:');
            console.log('Active bots count:', botStarter.activeBots.size);
            console.log('Active bot IDs:', Array.from(botStarter.activeBots.keys()));
            
            const bot2Status = botStarter.getBotStatus(2);
            console.log('Bot 2 Status:', bot2Status);
        }, 5000);
        
    } catch (error) {
        console.error('❌ Error starting bot:', error.message);
    }
}

testStartBot2();
