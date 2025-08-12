const axios = require('axios');

async function addTestKeywords() {
    console.log('🔧 Adding test keywords to bot_keywords table...');
    
    const testKeywords = [
        { trigger_word: 'hello', exact_match: false, priority: 1 },
        { trigger_word: 'hi', exact_match: false, priority: 1 },
        { trigger_word: 'help', exact_match: false, priority: 2 },
        { trigger_word: 'support', exact_match: false, priority: 2 },
        { trigger_word: 'price', exact_match: false, priority: 3 },
        { trigger_word: 'contact', exact_match: false, priority: 3 }
    ];
    
    try {
        for (const keyword of testKeywords) {
            const response = await axios.post('https://chatbot.soexplast.com/api/webhook/keyword', {
                shop_id: 2,
                trigger_word: keyword.trigger_word,
                response_message: 'hi', // Static response
                exact_match: keyword.exact_match,
                priority: keyword.priority,
                is_active: true
            });
            
            console.log(`✅ Added keyword: "${keyword.trigger_word}"`);
        }
        
        console.log('🎉 All test keywords added successfully!');
        console.log('💡 Now test the bot with messages like: hello, hi, help, support, price, contact');
        
    } catch (error) {
        console.error('❌ Error adding keywords:', error.response?.data || error.message);
    }
}

addTestKeywords(); 