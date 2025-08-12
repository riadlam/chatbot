const BotStarter = require('./src/bot-starter.js');
const axios = require('axios');

// Test the auto-start QR code functionality with enhanced validation
async function testAutoStart() {
    console.log('🚀 Testing Auto-Start QR Code System with Enhanced Validation...\n');

    const botStarter = new BotStarter();
    const startTime = Date.now();

    try {
        // 1. Test starting a bot automatically
        console.log('1️⃣ Auto-starting bot for shop 1, bot 1...');
        const startResult = await botStarter.startBot(1, 1);
        console.log('Auto-start result:', startResult);

        if (startResult.success) {
            console.log('✅ Bot started successfully!');
            
            // 2. Monitor QR code generation with timeout
            console.log('\n2️⃣ Monitoring QR code generation (30 seconds max)...');
            let qrGenerated = false;
            let attempts = 0;
            const maxAttempts = 15; // 30 seconds total (2 second intervals)
            
            while (!qrGenerated && attempts < maxAttempts) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                try {
                    const statusResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                        timeout: 5000
                    });
                    
                    const status = statusResponse.data.data;
                    console.log(`Attempt ${attempts}: Status - ${status.session_status}, QR Available: ${status.qr_code_available}`);
                    
                    if (status.qr_code_available) {
                        qrGenerated = true;
                        console.log('✅ QR code generated successfully!');
                        
                        // Validate QR code
                        const qrResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/qr-code', {
                            timeout: 5000
                        });
                        
                        if (qrResponse.data.success && qrResponse.data.qr_code) {
                            console.log('✅ QR code validation passed!');
                            console.log(`QR code length: ${qrResponse.data.qr_code.length} characters`);
                        } else {
                            console.log('⚠️ QR code validation failed - no QR code data');
                        }
                        break;
                    }
                    
                    if (status.session_status === 'error') {
                        console.log('❌ Bot encountered an error:', status.error_message);
                        break;
                    }
                    
                } catch (error) {
                    console.log(`Attempt ${attempts}: API error - ${error.message}`);
                }
            }
            
            if (!qrGenerated) {
                console.log('⏰ QR code generation timeout or failed');
            }

            // 3. Check final bot status
            console.log('\n3️⃣ Final bot status check...');
            const finalStatus = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                timeout: 5000
            });
            console.log('Final status:', finalStatus.data);

            // 4. Performance metrics
            const totalTime = Date.now() - startTime;
            console.log(`\n⏱️ Total test time: ${totalTime}ms`);
            console.log(`📊 Bot status: ${botStarter.getBotStatus(1)}`);

        } else {
            console.log('❌ Failed to start bot:', startResult.error);
        }

        console.log('\n📱 Enhanced Frontend Flow:');
        console.log('1. User clicks "QR Code" button on bot card');
        console.log('2. Dialog opens and bot auto-starts with timeout protection');
        console.log('3. QR code generates with validation and error handling');
        console.log('4. Real-time status updates with detailed logging');
        console.log('5. Automatic cleanup on timeout or error');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        // Clean up
        console.log('\n🧹 Cleaning up...');
        await botStarter.stopAllBots();
        console.log('✅ Cleanup completed');
    }
}

// Run the test
testAutoStart(); 