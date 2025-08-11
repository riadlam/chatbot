const BotStarter = require('./src/bot-starter.js');
const axios = require('axios');

// Test the complete dynamic QR code system
async function testDynamicQR() {
    console.log('🚀 Testing Dynamic QR Code System...\n');

    const botStarter = new BotStarter();

    try {
        // 1. Test starting a bot
        console.log('1️⃣ Starting bot for shop 1, bot 1...');
        const startResult = await botStarter.startBot(1, 1);
        console.log('Start result:', startResult);

        // 2. Wait a bit for QR code generation
        console.log('\n2️⃣ Waiting for QR code generation...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 3. Check bot status via API
        console.log('\n3️⃣ Checking bot status via API...');
        const statusResponse = await axios.get('http://localhost:8000/api/shops/1/bots/1/status');
        console.log('Bot status:', statusResponse.data);

        // 4. Get QR code via API
        console.log('\n4️⃣ Getting QR code via API...');
        const qrResponse = await axios.get('http://localhost:8000/api/shops/1/bots/1/qr-code');
        console.log('QR code response:', qrResponse.data);

        console.log('\n✅ Test completed successfully!');
        console.log('\n📱 To test the complete flow:');
        console.log('1. Start your Laravel backend: php artisan serve');
        console.log('2. Start your Vue.js frontend: npm run dev');
        console.log('3. Run this script: node test-dynamic-qr.js');
        console.log('4. Open the frontend and click "QR Code" on a bot');
        console.log('5. Click "Start Bot" to generate a real QR code');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        // Clean up
        await botStarter.stopAllBots();
        console.log('\n🧹 Cleaned up all bots');
    }
}

// Run the test
testDynamicQR(); 