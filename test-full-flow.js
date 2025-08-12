// Test script to verify the full flow
const axios = require('axios');

const API_BASE = 'https://chatbot.soexplast.com/api';

async function testFullFlow() {
    try {
        console.log('=== Testing Full Flow ===');
        
        // Step 1: Login user
        console.log('\n1. Logging in user...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        
        console.log('Login response:', loginResponse.data);
        
        if (loginResponse.data.success) {
            const token = loginResponse.data.data.token;
            console.log('Got token:', token.substring(0, 20) + '...');
            
            // Test authenticated endpoints
            await testAuthenticatedEndpoints(token);
        } else {
            console.log('Login failed');
        }
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

async function testAuthenticatedEndpoints(token) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    try {
        // Step 2: Get shops
        console.log('\n2. Getting shops...');
        const shopsResponse = await axios.get(`${API_BASE}/shops`, { headers });
        console.log('Shops response:', shopsResponse.data);
        
        let shopId;
        if (shopsResponse.data.success && shopsResponse.data.data.length > 0) {
            shopId = shopsResponse.data.data[0].id;
            console.log('Using existing shop ID:', shopId);
        } else {
            // Step 3: Create a shop
            console.log('\n3. Creating shop...');
            const createShopResponse = await axios.post(`${API_BASE}/shops`, {
                name: 'Test Shop',
                description: 'A test shop for debugging',
                phone_number: '+1234567890',
                email: 'shop@example.com'
            }, { headers });
            
            console.log('Create shop response:', createShopResponse.data);
            
            if (createShopResponse.data.success) {
                shopId = createShopResponse.data.data.id;
                console.log('Created shop ID:', shopId);
            }
        }
        
        if (shopId) {
            // Step 4: Get bots for the shop
            console.log('\n4. Getting bots...');
            const botsResponse = await axios.get(`${API_BASE}/shops/${shopId}/bots`, { headers });
            console.log('Bots response:', botsResponse.data);
            
            // Step 5: Create a bot
            console.log('\n5. Creating bot...');
            const createBotResponse = await axios.post(`${API_BASE}/shops/${shopId}/bots`, {
                bot_type: 'customer-support',
                description: 'A test customer support bot',
                status: 'active'
            }, { headers });
            
            console.log('Create bot response:', createBotResponse.data);
            
            if (createBotResponse.data.success) {
                const botId = createBotResponse.data.data.id;
                console.log('Created bot ID:', botId);
                
                // Step 6: Get bots again to verify
                console.log('\n6. Getting bots again...');
                const botsResponse2 = await axios.get(`${API_BASE}/shops/${shopId}/bots`, { headers });
                console.log('Bots response after creation:', botsResponse2.data);
                
                // Step 7: Test debug endpoint
                console.log('\n7. Testing debug endpoint...');
                const debugResponse = await axios.get(`${API_BASE}/shops/${shopId}/bots/debug`, { headers });
                console.log('Debug response:', debugResponse.data);
            }
        }
        
    } catch (error) {
        console.error('Authenticated endpoint error:', error.response?.data || error.message);
    }
}

testFullFlow(); 