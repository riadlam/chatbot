const BotStarter = require('./src/bot-starter.js');

async function debugBotStatus() {
    const botStarter = new BotStarter();
    
    console.log('🔍 Debugging Bot Status...');
    console.log('Active bots count:', botStarter.activeBots.size);
    console.log('Active bot IDs:', Array.from(botStarter.activeBots.keys()));
    
    // Check status for bot ID 2 (from the logs)
    const bot2Status = botStarter.getBotStatus(2);
    console.log('\nBot 2 Status:', bot2Status);
    
    // Check all active bots
    for (const [botId, botData] of botStarter.activeBots) {
        console.log(`\nBot ${botId}:`);
        console.log('  Session ID:', botData.sessionId);
        console.log('  Shop ID:', botData.shopId);
        console.log('  Start Time:', new Date(botData.startTime).toISOString());
        console.log('  Has Client:', !!botData.client);
        console.log('  Client Ready:', botData.client?.pupPage ? 'Yes' : 'No');
    }
}

debugBotStatus();
