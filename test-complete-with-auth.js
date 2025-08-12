const axios = require('axios');

async function testCompleteWithAuth() {
    console.log('🔍 Testing Complete Flow with Authentication...\n');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    let authToken = null;
    
    try {
        // Step 1: Login to get token
        console.log('1️⃣ Getting authentication token...');
        const loginResponse = await axios.post('https://chatbot.soexplast.com/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        authToken = loginResponse.data.data.token;
        console.log('✅ Authentication successful');
        
        // Step 2: Check if Node.js server is running
        console.log('\n2️⃣ Checking Node.js bot server...');
        try {
            const nodeHealth = await axios.get('http://localhost:3000/health', {
                timeout: 5000
            });
            console.log('✅ Node.js bot server is accessible');
            console.log('   Active bots:', nodeHealth.data.activeBots);
        } catch (error) {
            console.log('❌ Node.js bot server not accessible:', error.message);
            console.log('   Please start Node.js server: npm run bot-server');
            return;
        }
        
        // Step 3: Start bot via Laravel API (with authentication)
        console.log('\n3️⃣ Starting bot via Laravel API...');
        console.log('   This will trigger the complete flow...');
        
        const laravelResponse = await axios.post('https://chatbot.soexplast.com/api/shops/1/bots/1/start', {}, {
            timeout: 15000,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Laravel bot start response:', laravelResponse.data);
        
        // Step 4: Monitor the process
        console.log('\n4️⃣ Monitoring bot status (60 seconds)...');
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                const statusResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                    timeout: 5000,
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Accept': 'application/json'
                    }
                });
                
                const status = statusResponse.data.data;
                console.log(`   Attempt ${attempts}: Status=${status.session_status}, QR=${status.qr_code_available}, Connected=${status.is_connected}`);
                
                if (status.qr_code_available) {
                    console.log('🎉 QR code generated successfully!');
                    break;
                }
                
                if (status.session_status === 'error') {
                    console.log('❌ Bot encountered an error:', status.error_message);
                    break;
                }
                
                if (status.is_connected) {
                    console.log('🎉 Bot connected successfully!');
                    break;
                }
                
            } catch (error) {
                console.log(`   Attempt ${attempts}: API error - ${error.message}`);
            }
        }
        
        // Step 5: Final status check
        console.log('\n5️⃣ Final status check...');
        try {
            const finalStatus = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                timeout: 5000,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            
            console.log('Final status:', finalStatus.data.data);
        } catch (error) {
            console.log('Final status check failed:', error.message);
        }
        
        // Step 6: Performance metrics
        const totalTime = Date.now() - startTime;
        console.log(`\n⏱️ Total test time: ${totalTime}ms`);
        
        console.log('\n📋 Next Steps:');
        console.log('1. Check Laravel logs: Get-Content laravel-backend/storage/logs/laravel.log -Tail 20');
        console.log('2. Check Node.js server console output');
        console.log('3. Look for any error messages in the logs');
        console.log('4. Verify database has the session data');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
        
        console.log('\n🔧 Debugging Steps:');
        console.log('1. Check if Laravel is running: https://chatbot.soexplast.com');
        console.log('2. Check if Node.js server is running: http://localhost:3000/health');
        console.log('3. Check Laravel logs: Get-Content laravel-backend/storage/logs/laravel.log -Tail 20');
        console.log('4. Check Node.js server console for errors');
    }
}

testCompleteWithAuth(); 