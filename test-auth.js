const axios = require('axios');

async function testAuth() {
    console.log('🔐 Testing Authentication...\n');
    
    try {
        // Step 1: Register a test user
        console.log('1️⃣ Registering test user...');
        const registerResponse = await axios.post('https://chatbot.soexplast.com/api/auth/register', {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123'
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ User registered successfully');
        console.log('Response:', registerResponse.data);
        
        // Step 2: Login to get token
        console.log('\n2️⃣ Logging in to get token...');
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
        
        console.log('✅ Login successful');
        const token = loginResponse.data.data.token;
        console.log('Token:', token ? 'Received' : 'Not received');
        
        // Step 3: Test authenticated endpoint
        console.log('\n3️⃣ Testing authenticated endpoint...');
        const authResponse = await axios.get('https://chatbot.soexplast.com/api/auth/user', {
            timeout: 10000,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Authenticated endpoint works');
        console.log('User data:', authResponse.data);
        
        // Step 4: Test bot endpoint with authentication
        console.log('\n4️⃣ Testing bot endpoint with authentication...');
        const botResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1', {
            timeout: 10000,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Bot endpoint works with authentication');
        console.log('Bot data:', botResponse.data);
        
        console.log('\n🎉 Authentication test completed successfully!');
        console.log('\n📋 Token for future tests:', token);
        
    } catch (error) {
        console.error('❌ Authentication test failed:');
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Laravel is running: php artisan serve');
        console.log('2. Check if database migrations are run: php artisan migrate');
        console.log('3. Verify the API routes are working');
    }
}

testAuth(); 