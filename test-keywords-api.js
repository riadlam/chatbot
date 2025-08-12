const axios = require('axios');

async function testKeywordsAPI() {
    try {
        console.log('🔍 Testing keywords API...');
        
        // Test bot ID 2 (from the logs)
        const response = await axios.get('https://chatbot.soexplast.com/api/webhook/bot-keywords/2', {
            timeout: 10000
        });
        
        console.log('✅ API Response:');
        console.log('Status:', response.status);
        console.log('Success:', response.data.success);
        console.log('Data length:', response.data.data?.length || 0);
        
        if (response.data.data && response.data.data.length > 0) {
            console.log('\n📋 Keywords data:');
            response.data.data.forEach((keyword, index) => {
                console.log(`\nKeyword ${index + 1}:`);
                console.log('  ID:', keyword.id);
                console.log('  trigger_word:', keyword.trigger_word);
                console.log('  keyword:', keyword.keyword);
                console.log('  response_message:', keyword.response_message);
                console.log('  message_type:', keyword.message_type);
                console.log('  is_contain:', keyword.is_contain);
                console.log('  images:', keyword.images);
            });
        } else {
            console.log('❌ No keywords found');
        }
        
    } catch (error) {
        console.error('❌ Error testing keywords API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testKeywordsAPI();
