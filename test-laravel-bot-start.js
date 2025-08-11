const axios = require('axios');

async function testLaravelBotStart() {
    console.log('🧪 Testing Laravel Bot Start...\n');
    
    try {
        // Test 1: Call Laravel bot start endpoint
        console.log('1️⃣ Calling Laravel bot start endpoint...');
        const startResponse = await axios.post('http://localhost:8000/api/shops/1/bots/1/start', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Laravel bot start response:', startResponse.data);
        
        // Test 2: Wait a bit for session creation
        console.log('\n2️⃣ Waiting for session creation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test 3: Check if session was created
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
        
        // Test 4: Check bot status
        console.log('\n4️⃣ Checking bot status...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await axios.get('http://localhost:8000/api/shops/1/bots/1/status', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Bot status response:', statusResponse.data);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data);
        console.error('Error details:', error.message);
    }
}

// Run the function
testLaravelBotStart().then(() => {
    console.log('\n✅ Laravel bot start test completed!');
    setTimeout(() => process.exit(0), 2000);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 