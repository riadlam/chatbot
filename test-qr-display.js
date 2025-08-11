const axios = require('axios');

async function testQrDisplay() {
    console.log('🧪 Testing QR Code Display...\n');
    
    try {
        // Test 1: Get bot status from Laravel
        console.log('1️⃣ Getting bot status from Laravel...');
        const statusResponse = await axios.get('http://localhost:8000/api/shops/1/bots/1/status', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Bot status response:', JSON.stringify(statusResponse.data, null, 2));
        
        if (statusResponse.data.success && statusResponse.data.data) {
            const status = statusResponse.data.data;
            
            console.log('\n📊 Bot Status Details:');
            console.log('- QR Code Available:', status.qr_code_available);
            console.log('- QR Code Path:', status.qr_code_path);
            console.log('- Session Status:', status.session_status);
            console.log('- Is Connected:', status.is_connected);
            
            // Test 2: If QR code is available, test the URL construction
            if (status.qr_code_available && status.qr_code_path) {
                console.log('\n2️⃣ Testing QR code URL construction...');
                
                // Frontend URL construction logic
                const qrPathParts = status.qr_code_path.split('/');
                const sessionId = qrPathParts[2]; // This is what frontend does
                const frontendUrl = `http://localhost:8000/api/qr-code/${sessionId}/qr.png`;
                
                console.log('- Original QR Path:', status.qr_code_path);
                console.log('- Path Parts:', qrPathParts);
                console.log('- Session ID (index 2):', sessionId);
                console.log('- Frontend URL:', frontendUrl);
                
                // Test 3: Test if the constructed URL works
                console.log('\n3️⃣ Testing constructed URL...');
                try {
                    const qrResponse = await axios.get(frontendUrl, {
                        responseType: 'arraybuffer'
                    });
                    
                    console.log('✅ QR code URL works!');
                    console.log('- Status:', qrResponse.status);
                    console.log('- Content Length:', qrResponse.data.length);
                    console.log('- Content Type:', qrResponse.headers['content-type']);
                    
                } catch (error) {
                    console.log('❌ QR code URL failed:', error.response?.status, error.response?.statusText);
                }
                
                // Test 4: Test the actual file path
                console.log('\n4️⃣ Testing actual file path...');
                const actualUrl = `http://localhost:8000/api/qr-code/bot_1_1754524728295/qr.png`;
                try {
                    const actualResponse = await axios.get(actualUrl, {
                        responseType: 'arraybuffer'
                    });
                    
                    console.log('✅ Actual QR code URL works!');
                    console.log('- Status:', actualResponse.status);
                    console.log('- Content Length:', actualResponse.data.length);
                    
                } catch (error) {
                    console.log('❌ Actual QR code URL failed:', error.response?.status, error.response?.statusText);
                }
                
            } else {
                console.log('\n⚠️ QR code not available yet');
                console.log('- QR Code Available:', status.qr_code_available);
                console.log('- Session Status:', status.session_status);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data);
        console.error('Error details:', error.message);
    }
}

// Run the function
testQrDisplay().then(() => {
    console.log('\n✅ QR display test completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
}); 