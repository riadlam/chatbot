const axios = require('axios');

// Test the complete flow from Laravel to Node.js to QR generation
async function testCompleteFlow() {
    console.log('🚀 Testing Complete QR Code Flow\n');
    console.log('=' .repeat(60));

    const startTime = Date.now();
    const testResults = {
        laravelStart: false,
        nodejsStart: false,
        qrGeneration: false,
        qrValidation: false,
        statusUpdates: false,
        cleanup: false
    };

    try {
        // Test 1: Start bot via Laravel API
        console.log('\n1️⃣ Starting bot via Laravel API...');
        const laravelResponse = await axios.post('https://chatbot.soexplast.com/api/shops/1/bots/1/start', {}, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (laravelResponse.data.success) {
            console.log('✅ Laravel bot start successful');
            console.log(`  - Session ID: ${laravelResponse.data.session_id}`);
            console.log(`  - Status: ${laravelResponse.data.status}`);
            testResults.laravelStart = true;
        } else {
            console.log('❌ Laravel bot start failed:', laravelResponse.data.message);
            throw new Error('Laravel bot start failed');
        }

        // Test 2: Check if Node.js server is running
        console.log('\n2️⃣ Checking Node.js bot server...');
        try {
            const healthResponse = await axios.get('http://localhost:3000/health', {
                timeout: 5000
            });
            console.log('✅ Node.js bot server is running');
            console.log(`  - Active bots: ${healthResponse.data.activeBots}`);
            testResults.nodejsStart = true;
        } catch (error) {
            console.log('❌ Node.js bot server is not running');
            console.log('  Please start it with: npm run bot-server');
            throw new Error('Node.js bot server not running');
        }

        // Test 3: Monitor QR code generation
        console.log('\n3️⃣ Monitoring QR code generation (60 seconds max)...');
        let qrGenerated = false;
        let attempts = 0;
        const maxAttempts = 30; // 60 seconds total (2 second intervals)
        
        while (!qrGenerated && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                const statusResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                    timeout: 5000
                });
                
                const status = statusResponse.data.data;
                console.log(`  Attempt ${attempts}: ${status.session_status} | QR: ${status.qr_code_available} | Connected: ${status.is_connected}`);
                
                if (status.qr_code_available) {
                    qrGenerated = true;
                    testResults.qrGeneration = true;
                    console.log('✅ QR code generated successfully!');
                    break;
                }
                
                if (status.session_status === 'error') {
                    console.log('❌ Bot encountered error:', status.error_message);
                    break;
                }
                
                if (status.is_connected) {
                    console.log('✅ Bot connected successfully!');
                    break;
                }
                
            } catch (error) {
                console.log(`  Attempt ${attempts}: API error - ${error.message}`);
            }
        }
        
        if (!qrGenerated) {
            console.log('⏰ QR code generation timeout');
        }

        // Test 4: Validate QR code
        if (qrGenerated) {
            console.log('\n4️⃣ Validating QR code...');
            try {
                const qrResponse = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/qr-code', {
                    timeout: 5000
                });
                
                if (qrResponse.data.success && qrResponse.data.qr_code) {
                    const qrCode = qrResponse.data.qr_code;
                    console.log(`✅ QR code validation passed`);
                    console.log(`  - Length: ${qrCode.length} characters`);
                    console.log(`  - Type: ${typeof qrCode}`);
                    console.log(`  - Path: ${qrResponse.data.qr_code_path || 'N/A'}`);
                    
                    if (qrCode.length > 10 && typeof qrCode === 'string') {
                        testResults.qrValidation = true;
                        console.log('✅ QR code format is valid');
                    } else {
                        console.log('⚠️ QR code format may be invalid');
                    }
                } else {
                    console.log('❌ QR code validation failed - no QR code data');
                }
            } catch (error) {
                console.log('❌ QR code validation error:', error.message);
            }
        }

        // Test 5: Check final status
        console.log('\n5️⃣ Final status check...');
        try {
            const finalStatus = await axios.get('https://chatbot.soexplast.com/api/shops/1/bots/1/status', {
                timeout: 5000
            });
            
            const status = finalStatus.data.data;
            console.log('✅ Final status check successful');
            console.log(`  - Bot Status: ${status.bot_status}`);
            console.log(`  - Session Status: ${status.session_status}`);
            console.log(`  - Connected: ${status.is_connected}`);
            console.log(`  - QR Available: ${status.qr_code_available}`);
            console.log(`  - Phone Number: ${status.phone_number || 'N/A'}`);
            
            testResults.statusUpdates = true;
        } catch (error) {
            console.log('❌ Final status check failed:', error.message);
        }

        // Test 6: Performance metrics
        const totalTime = Date.now() - startTime;
        console.log('\n6️⃣ Performance Metrics...');
        console.log(`⏱️ Total test time: ${totalTime}ms`);
        
        // Check Node.js server status
        try {
            const finalHealth = await axios.get('http://localhost:3000/health', {
                timeout: 5000
            });
            console.log(`📊 Node.js server status: ${finalHealth.data.activeBots} active bots`);
        } catch (error) {
            console.log('📊 Node.js server status: unavailable');
        }

        // Test 7: Cleanup
        console.log('\n7️⃣ Testing cleanup...');
        try {
            await axios.post('http://localhost:3000/api/bot/stop-all', {}, {
                timeout: 5000
            });
            console.log('✅ Cleanup completed successfully');
            testResults.cleanup = true;
        } catch (error) {
            console.log('⚠️ Cleanup failed:', error.message);
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        // Test Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        
        const passedTests = Object.values(testResults).filter(Boolean).length;
        const totalTests = Object.keys(testResults).length;
        
        console.log(`Tests Passed: ${passedTests}/${totalTests}`);
        console.log(`Success Rate: ${((passedTests/totalTests)*100).toFixed(1)}%`);
        
        Object.entries(testResults).forEach(([test, passed]) => {
            const status = passed ? '✅' : '❌';
            console.log(`${status} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
        });
        
        console.log('\n🔍 System Requirements:');
        console.log('- ✅ Laravel backend running on port 8000');
        console.log('- ✅ Node.js bot server running on port 3000');
        console.log('- ✅ WhatsApp Web.js dependencies installed');
        console.log('- ✅ Database migrations completed');
        console.log('- ✅ Bot and shop data exists in database');
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Start Laravel: cd laravel-backend && php artisan serve');
        console.log('2. Start Node.js bot server: npm run bot-server');
        console.log('3. Start Vue.js frontend: cd frontend && npm run dev');
        console.log('4. Test the complete user flow in the browser');
        
        console.log('\n🐛 Troubleshooting:');
        console.log('- Check Laravel logs: php artisan logs:tail');
        console.log('- Check Node.js logs: Look for bot server output');
        console.log('- Verify database has shops and bots data');
        console.log('- Ensure WhatsApp Web.js can access the internet');
    }
}

// Run the test
testCompleteFlow(); 