// Test script to verify API functionality
const axios = require('axios');

async function testAPI() {
    try {
        console.log('Testing Laravel API...');
        
        // Test health endpoint
        const healthResponse = await axios.get('http://localhost:8000/api/shops');
        console.log('Shops API Response:', healthResponse.data);
        
        if (healthResponse.data.success && healthResponse.data.data.length > 0) {
            const shopId = healthResponse.data.data[0].id;
            console.log('Found shop ID:', shopId);
            
            // Test bots endpoint
            const botsResponse = await axios.get(`http://localhost:8000/api/shops/${shopId}/bots`);
            console.log('Bots API Response:', botsResponse.data);
            
            // Test debug endpoint
            const debugResponse = await axios.get(`http://localhost:8000/api/shops/${shopId}/bots/debug`);
            console.log('Debug API Response:', debugResponse.data);
        } else {
            console.log('No shops found');
        }
        
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
    }
}

testAPI(); 