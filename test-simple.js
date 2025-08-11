const axios = require('axios');

async function testSimple() {
    console.log('🔍 Simple Test...\n');
    
    try {
        // Step 1: Login to get token
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        const token = loginResponse.data.data.token;
        console.log('✅ Login successful');
        
        // Step 2: Test bot start
        console.log('\n2️⃣ Testing bot start...');
        const startResponse = await axios.post('http://localhost:8000/api/shops/1/bots/1/start', {}, {
            timeout: 20000,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Bot start response:', startResponse.data);
        
        // Step 3: Check status
        console.log('\n3️⃣ Checking status...');
        const statusResponse = await axios.get('http://localhost:8000/api/shops/1/bots/1/status', {
            timeout: 10000,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Status response:', statusResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
    }
}

testSimple(); 