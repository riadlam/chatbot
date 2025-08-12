const axios = require('axios');

async function resetSession() {
    console.log('🔄 Resetting session for shop 2...');
    
    try {
        // Reset session status in Laravel
        const response = await axios.post('https://chatbot.soexplast.com/api/webhook/reset-session', {
            shop_id: 2
        });
        
        console.log('✅ Session reset successfully:', response.data.message);
        console.log('💡 Now restart your bot server to start fresh.');
        
    } catch (error) {
        console.error('❌ Error resetting session:', error.response?.data || error.message);
    }
}

resetSession(); 