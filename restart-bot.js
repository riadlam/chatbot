const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Bot Restart Script\n');

function startBot() {
    console.log('🚀 Starting bot...');
    
    const botProcess = spawn('node', ['start-simple-bot.js'], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    botProcess.on('close', (code) => {
        console.log(`\n🛑 Bot process exited with code ${code}`);
        console.log('🔄 Restarting in 3 seconds...\n');
        
        setTimeout(() => {
            startBot();
        }, 3000);
    });
    
    botProcess.on('error', (error) => {
        console.error('❌ Error starting bot:', error);
        console.log('🔄 Restarting in 5 seconds...\n');
        
        setTimeout(() => {
            startBot();
        }, 5000);
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

startBot(); 