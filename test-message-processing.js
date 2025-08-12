const axios = require('axios');

async function testMessageProcessing() {
    console.log('🧪 Testing Message Processing...\n');
    
    try {
        // Test 1: Get keywords for bot 2
        console.log('1️⃣ Getting keywords for bot 2...');
        const keywordsResponse = await axios.get('https://chatbot.soexplast.com/api/webhook/bot-keywords/2', {
            timeout: 10000
        });
        
        console.log('✅ Keywords response:', JSON.stringify(keywordsResponse.data, null, 2));
        
        // Test 2: Simulate message processing
        console.log('\n2️⃣ Simulating message processing...');
        
        const keywords = keywordsResponse.data.data;
        const testMessages = [
            'hello',
            'hi there',
            'Hello world',
            'HELLO',
            'random message',
            'help me',
            'thanks'
        ];
        
        console.log('Test messages:');
        testMessages.forEach(msg => {
            console.log(`- "${msg}"`);
        });
        
        console.log('\nKeyword matching simulation:');
        
        for (const testMessage of testMessages) {
            const messageText = testMessage.toLowerCase().trim();
            let matchFound = false;
            
            for (const keyword of keywords) {
                const keywordText = keyword.keyword.toLowerCase();
                
                if (messageText.includes(keywordText)) {
                    console.log(`✅ MATCH: "${testMessage}" matches keyword "${keyword.keyword}"`);
                    console.log(`   Response message: ${JSON.stringify(keyword.message, null, 2)}`);
                    matchFound = true;
                    break;
                }
            }
            
            if (!matchFound) {
                console.log(`❌ NO MATCH: "${testMessage}"`);
            }
        }
        
    } catch (error) {
        console.log('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testMessageProcessing(); 