const axios = require('axios');

async function testBotStartShop2() {
    console.log('🧪 Testing Bot Start for Shop 2...\n');
    
    try {
        // Test 1: Start bot for shop 2, bot 2
        console.log('1️⃣ Starting bot for shop 2, bot 2...');
        const startResponse = await axios.post('http://localhost:3000/api/bot/start', {
            shop_id: 2,
            bot_id: 2,
            session_id: 'test_session_shop2'
        });
        
        console.log('✅ Bot start response:', startResponse.data);
        
        // Test 2: Wait a bit for session creation
        console.log('\n2️⃣ Waiting for session creation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test 3: Check if session was created for shop 2
        console.log('\n3️⃣ Checking database for sessions...');
        const { exec } = require('child_process');
        
        exec('cd laravel-backend && php check-sessions.php', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Error checking sessions:', error);
                return;
            }
            console.log('📊 Database sessions:');
            console.log(stdout);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data);
        console.error('Error details:', error.message);
    }
}

// Run the function
testBotStartShop2().then(() => {
    console.log('\n✅ Bot start test for shop 2 completed!');
    setTimeout(() => process.exit(0), 2000);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 