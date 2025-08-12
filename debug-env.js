require('dotenv').config();
const axios = require('axios');

console.log('🔍 Environment Debug Script\n');
console.log('=' .repeat(50));

// Check environment variables
console.log('📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('LARAVEL_API_URL:', process.env.LARAVEL_API_URL);
console.log('PORT:', process.env.PORT);
console.log('HOST:', process.env.HOST);

// Check config
const config = require('./src/config/config');
console.log('\n⚙️ Config Values:');
console.log('Laravel Base URL:', config.laravel.baseUrl);
console.log('Server Port:', config.server.port);
console.log('Server Host:', config.server.host);

// Test API connection
console.log('\n🌐 Testing API Connection...');
const testUrl = config.laravel.baseUrl + '/health';
console.log('Testing URL:', testUrl);

axios.get(testUrl, { timeout: 10000 })
    .then(response => {
        console.log('✅ API Connection Successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    })
    .catch(error => {
        console.log('❌ API Connection Failed!');
        console.log('Error:', error.message);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
        }
    });
