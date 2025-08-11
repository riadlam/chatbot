const axios = require('axios');

async function testQrGeneration() {
    console.log('🧪 Testing QR Code Generation...\n');
    
    try {
        // Test 1: Check if Laravel API is accessible
        console.log('1️⃣ Testing Laravel API connection...');
        const healthResponse = await axios.get('http://localhost:8000/api/health');
        console.log('✅ Laravel API is running:', healthResponse.data);
        
        // Test 2: Check if Node.js bot server is accessible
        console.log('\n2️⃣ Testing Node.js bot server connection...');
        const botHealthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Bot server is running:', botHealthResponse.data);
        
        // Test 3: Directly call Node.js bot server to start a bot
        console.log('\n3️⃣ Testing direct bot start via Node.js server...');
        
        const startBotResponse = await axios.post('http://localhost:3000/api/bot/start', {
            shop_id: 1,
            bot_id: 1
        });
        
        console.log('✅ Bot start response:', startBotResponse.data);
        
        if (startBotResponse.data.success) {
            console.log('✅ Bot started successfully, waiting for QR code generation...');
            
            // Test 4: Wait and check if QR code is generated via webhook
            console.log('\n4️⃣ Waiting for QR code generation (30 seconds)...');
            
            for (let i = 0; i < 15; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log(`⏳ Waiting... (${(i + 1) * 2}/30 seconds)`);
                
                // Check if QR code file exists in the expected location
                const fs = require('fs');
                const path = require('path');
                const qrDir = path.join(__dirname, 'laravel-backend', 'storage', 'qr-codes');
                
                if (fs.existsSync(qrDir)) {
                    const qrFiles = fs.readdirSync(qrDir);
                    if (qrFiles.length > 0) {
                        console.log('✅ Found QR code directories:', qrFiles);
                        
                        // Check the most recent QR code directory
                        const latestQrDir = qrFiles[qrFiles.length - 1];
                        const qrFilePath = path.join(qrDir, latestQrDir, 'qr.png');
                        
                        if (fs.existsSync(qrFilePath)) {
                            const stats = fs.statSync(qrFilePath);
                            console.log('✅ QR code file found!');
                            console.log('📁 File path:', qrFilePath);
                            console.log('📏 File size:', stats.size, 'bytes');
                            console.log('🕒 Created:', stats.birthtime);
                            
                            // Test 5: Try to access QR code via Laravel API
                            console.log('\n5️⃣ Testing QR code access via Laravel API...');
                            const qrCodeUrl = `http://localhost:8000/api/qr-code/${latestQrDir}/qr.png`;
                            console.log('🔗 QR Code URL:', qrCodeUrl);
                            
                            try {
                                const qrResponse = await axios.get(qrCodeUrl, { responseType: 'arraybuffer' });
                                console.log('✅ QR code file is accessible via API');
                                console.log('📏 API response size:', qrResponse.data.length, 'bytes');
                                
                                // Test 6: Check if QR code content is valid
                                console.log('\n6️⃣ Validating QR code content...');
                                if (qrResponse.data.length > 1000) {
                                    console.log('✅ QR code file appears to be valid (size > 1KB)');
                                } else {
                                    console.log('⚠️ QR code file seems too small, might be invalid');
                                }
                                
                                return; // Success, exit the loop
                            } catch (qrError) {
                                console.log('❌ QR code file not accessible via API:', qrError.message);
                            }
                        }
                    }
                }
            }
            
            console.log('❌ QR code generation timeout after 30 seconds');
        } else {
            console.log('❌ Bot start failed:', startBotResponse.data.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testQrGeneration().then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
}).catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
}); 