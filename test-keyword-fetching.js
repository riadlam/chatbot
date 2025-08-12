const axios = require('axios');

async function testKeywordFetching() {
    console.log('🧪 Testing Keyword Fetching...\n');
    
    try {
        // Test 1: Check if we can access the keywords endpoint
        console.log('1️⃣ Testing keywords endpoint...');
        try {
            const keywordsResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/keywords', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('✅ Keywords endpoint accessible:', keywordsResponse.data);
        } catch (error) {
            console.log('❌ Keywords endpoint error:', error.response?.status, error.response?.data);
        }

        // Test 2: Check if we can access the messages endpoint
        console.log('\n2️⃣ Testing messages endpoint...');
        try {
            const messagesResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/messages', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('✅ Messages endpoint accessible:', messagesResponse.data);
        } catch (error) {
            console.log('❌ Messages endpoint error:', error.response?.status, error.response?.data);
        }

        // Test 3: Check if there are any bot_messages in the database
        console.log('\n3️⃣ Testing direct database check...');
        try {
            const botMessagesResponse = await axios.get('https://chatbot.soexplast.com/api/webhook/bot-messages/1', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('✅ Bot messages found:', botMessagesResponse.data);
        } catch (error) {
            console.log('❌ Bot messages error:', error.response?.status, error.response?.data);
        }

        // Test 4: Check if there are any bot_keywords in the database
        console.log('\n4️⃣ Testing bot keywords check...');
        try {
            const botKeywordsResponse = await axios.get('https://chatbot.soexplast.com/api/webhook/bot-keywords/1', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('✅ Bot keywords found:', botKeywordsResponse.data);
        } catch (error) {
            console.log('❌ Bot keywords error:', error.response?.status, error.response?.data);
        }

        console.log('\n📊 Summary:');
        console.log('- The bot needs to fetch keywords and messages to respond');
        console.log('- If endpoints return 401/403, the bot cannot access the data');
        console.log('- We need to create webhook endpoints that don\'t require authentication');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the function
testKeywordFetching().then(() => {
    console.log('\n✅ Keyword fetching test completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 