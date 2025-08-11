const axios = require('axios');

async function addBotKeywords() {
    console.log('🔧 Adding Bot Keywords to Correct Tables...\n');
    
    try {
        // Test bot message data
        const testBotMessages = [
            {
                bot_id: 1,
                type: 'text',
                message: {
                    text: 'Hello! Welcome to our WhatsApp bot. How can I help you today?'
                }
            },
            {
                bot_id: 1,
                type: 'text',
                message: {
                    text: 'Thank you for contacting us! Our team will get back to you soon.'
                }
            },
            {
                bot_id: 1,
                type: 'text',
                message: {
                    text: 'You can reach us at support@example.com or call us at +1234567890'
                }
            }
        ];

        console.log('📝 Adding bot messages...');
        
        for (const messageData of testBotMessages) {
            try {
                console.log(`Adding message: ${messageData.message.text.substring(0, 50)}...`);
                
                const response = await axios.post('http://localhost:8000/api/shops/1/bots/1/messages', messageData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('✅ Message added successfully:', response.data.message);
                
            } catch (error) {
                console.log('❌ Failed to add message:', error.response?.status);
                console.log('This is expected if you\'re not authenticated. You can add messages through the frontend instead.');
                break;
            }
        }
        
        console.log('\n📱 Manual Setup Instructions:');
        console.log('Since direct API access requires authentication, please:');
        console.log('');
        console.log('1. Open your frontend dashboard');
        console.log('2. Go to "Keywords" section');
        console.log('3. Add these test keywords manually:');
        console.log('');
        console.log('   Bot Message 1:');
        console.log('   - Type: text');
        console.log('   - Message: "Hello! Welcome to our WhatsApp bot. How can I help you today?"');
        console.log('   - Keywords: hello, hi, hey, start');
        console.log('');
        console.log('   Bot Message 2:');
        console.log('   - Type: text');
        console.log('   - Message: "Thank you for contacting us! Our team will get back to you soon."');
        console.log('   - Keywords: help, support, assist');
        console.log('');
        console.log('   Bot Message 3:');
        console.log('   - Type: text');
        console.log('   - Message: "You can reach us at support@example.com or call us at +1234567890"');
        console.log('   - Keywords: contact, email, phone, call');
        console.log('');
        console.log('4. Save each message and keyword group');
        console.log('5. Test by sending messages to your WhatsApp bot');
        
        console.log('\n🔍 Current Bot Structure:');
        console.log('- bot_messages table: Stores the response messages');
        console.log('- bot_keywords table: Links keywords to bot_messages');
        console.log('- messages table: Stores all WhatsApp conversations');
        console.log('- The bot checks bot_keywords and responds with bot_messages');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the function
addBotKeywords().then(() => {
    console.log('\n✅ Bot keyword setup instructions completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 