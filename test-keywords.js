const axios = require('axios');

async function testKeywords() {
    console.log('🧪 Testing Bot Keywords...\n');
    
    try {
        // Test 1: Add keywords via webhook
        console.log('📝 Test 1: Adding keywords via webhook...');
        
        const testKeywords = [
            {
                shop_id: 1,
                trigger_word: 'hello',
                response_message: 'Hello! Welcome to our WhatsApp bot. How can I help you today?',
                exact_match: false,
                priority: 1,
                is_active: true
            },
            {
                shop_id: 1,
                trigger_word: 'help',
                response_message: 'Thank you for contacting us! Our team will get back to you soon.',
                exact_match: false,
                priority: 1,
                is_active: true
            },
            {
                shop_id: 1,
                trigger_word: 'contact',
                response_message: 'You can reach us at support@example.com or call us at +1234567890',
                exact_match: false,
                priority: 1,
                is_active: true
            }
        ];
        
        for (const keywordData of testKeywords) {
            try {
                const response = await axios.post('https://chatbot.soexplast.com/api/webhook/keyword', keywordData, {
                    timeout: 10000
                });
                
                console.log(`✅ Added keyword "${keywordData.trigger_word}": ${response.data.message}`);
            } catch (error) {
                console.log(`❌ Failed to add keyword "${keywordData.trigger_word}":`, error.response?.data?.message || error.message);
            }
        }
        
        // Test 2: Fetch keywords from webhook
        console.log('\n📤 Test 2: Fetching keywords from webhook...');
        
        try {
            const keywordsResponse = await axios.get('https://chatbot.soexplast.com/api/webhook/shop-keywords/1', {
                timeout: 10000
            });
            
            if (keywordsResponse.data.success) {
                console.log(`✅ Found ${keywordsResponse.data.data.length} keywords:`);
                keywordsResponse.data.data.forEach(keyword => {
                    console.log(`   - "${keyword.trigger_word}" → "${keyword.response_message}"`);
                });
            } else {
                console.log('❌ No keywords found or error occurred');
            }
        } catch (error) {
            console.log('❌ Failed to fetch keywords:', error.response?.data?.message || error.message);
        }
        
        // Test 3: Test bot keyword processing
        console.log('\n🤖 Test 3: Testing bot keyword processing...');
        
        try {
            const botResponse = await axios.get('http://localhost:3000/health', {
                timeout: 5000
            });
            
            if (botResponse.data.status === 'ok') {
                console.log('✅ Bot server is running');
                console.log('📱 Now you can test by:');
                console.log('   1. Start a bot from the frontend');
                console.log('   2. Scan the QR code');
                console.log('   3. Send messages like "hello", "help", "contact"');
                console.log('   4. The bot should respond with different messages for each keyword');
            } else {
                console.log('❌ Bot server is not responding correctly');
            }
        } catch (error) {
            console.log('❌ Bot server is not running:', error.message);
            console.log('💡 Start the bot server with: node src/index.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
testKeywords().then(() => {
    console.log('\n✅ Keyword testing completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 