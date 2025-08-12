const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

// 🚨 DEBUG MODE: Bot responds to ALL messages with dummy response
// TODO: Uncomment keyword matching logic when debugging is complete

class BotStarter {
    constructor() {
        this.apiBaseUrl = 'https://chatbot.soexplast.com/api';
        this.activeBots = new Map();
        this.qrGenerationTimeouts = new Map();
        this.maxQrGenerationTime = 30000; // 30 seconds timeout
        this.maxConnectionTime = 60000; // 60 seconds timeout
    }

    log(message, level = 'INFO', botId = null, data = null) {
        const timestamp = new Date().toISOString();
        const botPrefix = botId ? `[Bot ${botId}]` : '[BotStarter]';
        const logMessage = `${timestamp} ${level} ${botPrefix}: ${message}`;
        
        if (data) {
            console.log(logMessage, JSON.stringify(data, null, 2));
        } else {
            console.log(logMessage);
        }
    }

    async startBot(shopId, botId) {
        const startTime = Date.now();
        const sessionId = `bot_${botId}_${Date.now()}`;
        
        try {
            this.log(`🚀 [START_BOT] Starting bot process`, 'INFO', botId, {
                shopId,
                botId,
                sessionId,
                activeBotsCount: this.activeBots.size,
                existingBots: Array.from(this.activeBots.keys())
            });

            // Check if bot is already running
            if (this.activeBots.has(botId)) {
                this.log(`⚠️ [START_BOT] Bot is already running`, 'WARN', botId, {
                    botId,
                    existingSessionId: this.activeBots.get(botId)?.sessionId || 'unknown'
                });
                return { success: true, sessionId: `existing_${botId}`, alreadyRunning: true };
            }

            // Clean up any existing session data for this bot
            await this.cleanupOldSessions(botId);

            // Create session in Laravel database
            await this.createSession(shopId, botId, sessionId);

            // Create WhatsApp client with fresh session
            this.log(`🔧 [START_BOT] Creating WhatsApp client`, 'INFO', botId, {
                sessionId,
                dataPath: path.join(__dirname, 'sessions'),
                puppeteerArgs: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            });
            
            const client = new Client({
                authStrategy: new LocalAuth({
                    clientId: sessionId,
                    dataPath: path.join(__dirname, 'sessions')
                }),
                // Better connection settings
                connectionOptions: {
                    maxIdleTimeMs: 60000,
                    connectTimeoutMs: 60000,
                    qrMaxRetries: 5,
                    qrQualityOptions: {
                        quality: 0.8,
                        margin: 4
                    }
                },
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox', 
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-images',
                        '--disable-javascript',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-field-trial-config',
                        '--disable-ipc-flooding-protection',
                        '--enable-features=NetworkService,NetworkServiceLogging',
                        '--force-color-profile=srgb',
                        '--metrics-recording-only',
                        '--no-default-browser-check',
                        '--disable-default-apps',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--mute-audio',
                        '--no-first-run',
                        '--safebrowsing-disable-auto-update',
                        '--ignore-certificate-errors',
                        '--ignore-ssl-errors',
                        '--ignore-certificate-errors-spki-list',
                        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ],
                    timeout: 120000, // Increased to 2 minutes
                    protocolTimeout: 120000 // Increased to 2 minutes
                },
                webVersion: '2.2402.5',
                webVersionCache: {
                    type: 'local'
                }
            });

            // Set up event handlers
            client.on('qr', async (qr) => {
                // Add retry counter for QR generation
                if (!this.qrRetryCount) this.qrRetryCount = 0;
                this.qrRetryCount++;
                
                this.log(`📱 [QR_EVENT] QR Code received from WhatsApp (Attempt ${this.qrRetryCount})`, 'INFO', botId, {
                    qrLength: qr ? qr.length : 0,
                    qrType: typeof qr,
                    qrPreview: qr ? qr.substring(0, 50) + '...' : 'null',
                    sessionId,
                    attempt: this.qrRetryCount
                });
                
                try {
                    // Validate QR code - WhatsApp QR codes are typically strings with encrypted data
                    if (!qr || typeof qr !== 'string' || qr.length < 10) {
                        this.log(`❌ [QR_EVENT] Invalid QR code received (Attempt ${this.qrRetryCount})`, 'ERROR', botId, {
                            qr,
                            qrType: typeof qr,
                            qrLength: qr ? qr.length : 0,
                            isValid: !!(qr && typeof qr === 'string' && qr.length >= 10),
                            attempt: this.qrRetryCount
                        });
                        
                        // Only update status to error after multiple failed attempts
                        if (this.qrRetryCount >= 3) {
                            await this.updateSessionStatus(shopId, botId, 'error', null, `Invalid QR code received after ${this.qrRetryCount} attempts`);
                        }
                        return;
                    }

                    // WhatsApp Web.js QR codes are encrypted data, not URLs
                    // They typically start with numbers and contain base64-like data
                    this.log(`✅ [QR_EVENT] QR code validation passed`, 'DEBUG', botId, {
                        qrLength: qr.length,
                        qrType: typeof qr,
                        qrPreview: qr.substring(0, 100)
                    });
                    
                    // Generate QR code image
                    const qrDir = path.join(__dirname, '..', 'laravel-backend', 'storage', 'qr-codes', sessionId);
                    this.log(`📁 [QR_EVENT] Creating QR directory`, 'DEBUG', botId, {
                        qrDir,
                        sessionId
                    });
                    
                    await fs.ensureDir(qrDir);
                    const qrPath = path.join(qrDir, 'qr.png');
                    
                    this.log(`🖼️ [QR_EVENT] Generating QR image`, 'DEBUG', botId, {
                        qrPath,
                        qrCodeLength: qr.length,
                        qrCodeOptions: {
                            errorCorrectionLevel: 'M',
                            type: 'image/png',
                            quality: 0.92,
                            margin: 1
                        }
                    });
                    
                    // Generate QR code with better settings and timeout
                    const qrPromise = qrcode.toFile(qrPath, qr, {
                        errorCorrectionLevel: 'H', // Higher error correction
                        type: 'image/png',
                        quality: 1.0, // Maximum quality
                        margin: 2, // Slightly larger margin
                        width: 256, // Explicit width
                        height: 256 // Explicit height
                    });
                    
                    // Add timeout to QR generation
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('QR code generation timeout')), 30000); // 30 second timeout
                    });
                    
                    await Promise.race([qrPromise, timeoutPromise]);

                    // Verify QR code file was created
                    const qrExists = await fs.pathExists(qrPath);
                    if (!qrExists) {
                        throw new Error('QR code file was not created');
                    }

                    const qrStats = await fs.stat(qrPath);
                    this.log(`✅ [QR_EVENT] QR code file created successfully`, 'DEBUG', botId, {
                        qrPath,
                        fileSize: qrStats.size,
                        fileExists: qrExists,
                        fileCreated: new Date(qrStats.birthtime).toISOString()
                    });

                    // Update Laravel API with QR code
                    this.log(`🌐 [QR_EVENT] Updating Laravel API with QR code`, 'DEBUG', botId, {
                        shopId,
                        botId,
                        qrCodeLength: qr.length,
                        qrCodePath: `storage/qr-codes/${sessionId}/qr.png`
                    });
                    
                    await this.updateQrCode(shopId, botId, qr, `storage/qr-codes/${sessionId}/qr.png`);
                    
                    this.log(`✅ [QR_EVENT] QR Code saved and updated successfully`, 'INFO', botId, {
                        shopId,
                        botId,
                        sessionId,
                        qrCodeLength: qr.length,
                        qrCodePath: `storage/qr-codes/${sessionId}/qr.png`
                    });
                    
                    // Clear QR generation timeout
                    if (this.qrGenerationTimeouts.has(botId)) {
                        clearTimeout(this.qrGenerationTimeouts.get(botId));
                        this.qrGenerationTimeouts.delete(botId);
                        this.log(`⏰ [QR_EVENT] QR generation timeout cleared`, 'DEBUG', botId);
                    }
                } catch (error) {
                    this.log(`❌ [QR_EVENT] Error handling QR code`, 'ERROR', botId, {
                        errorMessage: error.message,
                        errorStack: error.stack,
                        qrLength: qr ? qr.length : 0,
                        sessionId
                    });
                    await this.updateSessionStatus(shopId, botId, 'error', null, `QR code generation failed: ${error.message}`);
                }
            });

            client.on('ready', async () => {
                this.log(`Bot is ready!`, 'INFO', botId);
                
                try {
                    const phoneNumber = client.info?.wid?.user;
                    
                    if (!phoneNumber) {
                        this.log(`No phone number received from WhatsApp`, 'WARN', botId);
                    } else {
                        this.log(`Connected with phone: ${phoneNumber}`, 'INFO', botId);
                    }
                    
                    // Update session status to connected
                    await this.updateSessionStatus(shopId, botId, 'connected', phoneNumber);
                    
                    // Clear any remaining timeouts
                    if (this.qrGenerationTimeouts.has(botId)) {
                        clearTimeout(this.qrGenerationTimeouts.get(botId));
                        this.qrGenerationTimeouts.delete(botId);
                    }
                    
                } catch (error) {
                    this.log(`Error in ready event: ${error.message}`, 'ERROR', botId);
                }
            });

            client.on('disconnected', async (reason) => {
                this.log(`Bot disconnected. Reason: ${reason}`, 'WARN', botId);
                await this.updateSessionStatus(shopId, botId, 'disconnected', null, reason);
                this.activeBots.delete(botId);
                
                // Clear timeouts
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
            });

            client.on('auth_failure', async (message) => {
                this.log(`Authentication failed: ${message}`, 'ERROR', botId);
                await this.updateSessionStatus(shopId, botId, 'error', null, `Authentication failed: ${message}`);
                this.activeBots.delete(botId);
            });

            // Handle incoming messages
            client.on('message', async (message) => {
                try {
                    this.log(`📨 [MESSAGE] Received message`, 'INFO', botId, {
                        from: message.from,
                        body: message.body,
                        type: message.type,
                        timestamp: message.timestamp,
                        isGroup: message.from.includes('@g.us')
                    });

                    // Skip group messages for now (can be enabled later)
                    if (message.from.includes('@g.us')) {
                        this.log(`📨 [MESSAGE] Skipping group message`, 'DEBUG', botId);
                        return;
                    }

                    // Skip messages from the bot itself
                    if (message.fromMe) {
                        this.log(`📨 [MESSAGE] Skipping own message`, 'DEBUG', botId);
                        return;
                    }

                    // SKIP DATABASE STORAGE - Just process and respond
                    this.log(`🔧 [DEBUG] Skipping database storage, processing message directly`, 'INFO', botId);

                    // Process the message and respond with dummy message
                    await this.processMessage(shopId, botId, message);

                } catch (error) {
                    this.log(`❌ [MESSAGE] Error handling message: ${error.message}`, 'ERROR', botId, {
                        error: error.message,
                        stack: error.stack
                    });
                }
            });

            // Set up QR generation timeout
            const qrTimeout = setTimeout(async () => {
                this.log(`QR generation timeout after ${this.maxQrGenerationTime}ms`, 'ERROR', botId);
                await this.updateSessionStatus(shopId, botId, 'error', null, 'QR code generation timeout');
                this.activeBots.delete(botId);
            }, this.maxQrGenerationTime);
            
            this.qrGenerationTimeouts.set(botId, qrTimeout);

            // Initialize the client
            this.log(`Initializing WhatsApp client...`, 'INFO', botId);
            await client.initialize();
            
            // Store the client
            this.activeBots.set(botId, client);

            this.log(`Bot started successfully`, 'INFO', botId);
            return { success: true, sessionId };

        } catch (error) {
            this.log(`Error starting bot: ${error.message}`, 'ERROR', botId);
            
            // Clean up on error
            if (this.qrGenerationTimeouts.has(botId)) {
                clearTimeout(this.qrGenerationTimeouts.get(botId));
                this.qrGenerationTimeouts.delete(botId);
            }
            
            await this.updateSessionStatus(shopId, botId, 'error', null, error.message);
            return { success: false, error: error.message };
        }
    }

    async updateQrCode(shopId, botId, qrCode, qrCodePath) {
        try {
            this.log(`Updating QR code in Laravel API`, 'DEBUG', botId);
            
            const response = await axios.post(`${this.apiBaseUrl}/webhook/qr-code`, {
                shop_id: shopId,
                qr_code: qrCode,
                qr_code_path: qrCodePath
            }, {
                timeout: 10000 // 10 second timeout
            });
            
            this.log(`QR code updated successfully in Laravel`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`Error updating QR code: ${error.message}`, 'ERROR', botId);
            throw error;
        }
    }

    async createSession(shopId, botId, sessionId) {
        try {
            this.log(`Creating session in Laravel database`, 'DEBUG', botId, {
                shopId,
                botId,
                sessionId
            });
            
            const response = await axios.post(`${this.apiBaseUrl}/webhook/create-session`, {
                shop_id: shopId,
                bot_id: botId,
                session_id: sessionId,
                status: 'connecting'
            }, {
                timeout: 10000 // 10 second timeout
            });
            
            this.log(`Session created successfully in Laravel`, 'INFO', botId, {
                sessionId,
                response: response.data
            });
            return response.data;
        } catch (error) {
            this.log(`Error creating session: ${error.message}`, 'ERROR', botId);
            // Don't throw error, continue with bot startup
            return null;
        }
    }

    async updateSessionStatus(shopId, botId, status, phoneNumber = null, errorMessage = null) {
        try {
            this.log(`Updating session status: ${status}`, 'DEBUG', botId);
            
            const response = await axios.post(`${this.apiBaseUrl}/webhook/session-status`, {
                shop_id: shopId,
                status: status,
                phone_number: phoneNumber,
                error_message: errorMessage
            }, {
                timeout: 10000 // 10 second timeout
            });
            
            this.log(`Session status updated successfully: ${status}`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`Error updating session status: ${error.message}`, 'ERROR', botId);
            throw error;
        }
    }

    async storeMessage(shopId, botId, message) {
        try {
            this.log(`💾 [STORE] Storing message in database`, 'DEBUG', botId, {
                from: message.from,
                body: message.body,
                type: message.type
            });

            const response = await axios.post(`${this.apiBaseUrl}/webhook/message`, {
                shop_id: shopId,
                whatsapp_number: message.from,
                customer_name: message._data?.notifyName || 'Unknown',
                message_content: message.body,
                direction: 'inbound',
                message_type: message.type,
                media_url: message.hasMedia ? await this.getMediaUrl(message) : null,
                message_id: message.id._serialized,
                is_bot_response: false
            }, {
                timeout: 10000
            });

            this.log(`💾 [STORE] Message stored successfully`, 'INFO', botId, {
                messageId: response.data.id
            });

            return response.data;
        } catch (error) {
            this.log(`❌ [STORE] Error storing message: ${error.message}`, 'ERROR', botId);
            throw error;
        }
    }

    async processMessage(shopId, botId, message) {
        try {
            this.log(`🔍 [PROCESS] Processing message for debugging`, 'DEBUG', botId, {
                messageBody: message.body,
                from: message.from
            });

            // Get bot keywords from Laravel API
            const keywords = await this.getBotKeywords(shopId, botId);
            
            if (!keywords || keywords.length === 0) {
                this.log(`🔍 [PROCESS] No keywords configured for bot`, 'INFO', botId);
                // Send default response when no keywords are configured
                const defaultResponseData = {
                    id: 'default_response',
                    keywords: ['default'],
                    message_data: {
                        id: 'default_msg',
                        type: 'text',
                        message: 'Thank you for your message! We will get back to you soon.'
                    },
                    response: 'Thank you for your message! We will get back to you soon.'
                };
                await this.sendResponse(shopId, botId, message, defaultResponseData);
                return;
            }

            this.log(`🔍 [PROCESS] Loaded ${keywords.length} keywords for bot`, 'INFO', botId, {
                keywords: keywords.map(k => ({
                    id: k.id,
                    keywords: k.keywords,
                    is_contain: k.is_contain,
                    response: k.response
                }))
            });

            const messageText = message.body.toLowerCase().trim();
            let responseSent = false;

            this.log(`🔍 [PROCESS] Processing message: "${messageText}" with ${keywords.length} keywords`, 'INFO', botId);

            // Check each keyword
            for (const keywordData of keywords) {
                const keywordKeywords = keywordData.keywords || [];
                const isContain = keywordData.is_contain !== false; // Default to true if not specified
                
                this.log(`🔍 [PROCESS] Checking keyword group`, 'DEBUG', botId, {
                    keywordData: keywordData,
                    keywords: keywordKeywords,
                    messageText: messageText,
                    isContain: isContain
                });
                
                for (const keyword of keywordKeywords) {
                    this.log(`🔍 [PROCESS] Checking keyword: "${keyword}" against message: "${messageText}" (isContain: ${isContain})`, 'DEBUG', botId);
                    
                    let isMatch = false;
                    
                    if (isContain) {
                        // Contains mode: check if any word in the keyword phrase is in the message
                        const keywordWords = keyword.toLowerCase().split(/\s+/);
                        isMatch = keywordWords.some(word => messageText.includes(word));
                    } else {
                        // Exact mode: check if the exact keyword phrase is in the message
                        isMatch = messageText.includes(keyword.toLowerCase());
                    }
                    
                    if (isMatch) {
                        this.log(`✅ [PROCESS] Keyword match found: "${keyword}" (mode: ${isContain ? 'contains' : 'exact'})`, 'INFO', botId, {
                            matchedKeyword: keyword,
                            messageText: messageText,
                            response: keywordData.response,
                            matchingMode: isContain ? 'contains' : 'exact'
                        });

                        // Send response
                        await this.sendResponse(shopId, botId, message, keywordData);
                        responseSent = true;
                        break; // Send only first match
                    }
                }
                
                if (responseSent) break; // Stop after first response
            }

            if (!responseSent) {
                this.log(`🔍 [PROCESS] No keyword matches found, sending default response`, 'INFO', botId);
                // Send default response when no keywords match
                const defaultResponseData = {
                    id: 'no_match_response',
                    keywords: ['default'],
                    message_data: {
                        id: 'no_match_msg',
                        type: 'text',
                        message: 'Thank you for your message! We will get back to you soon.'
                    },
                    response: 'Thank you for your message! We will get back to you soon.'
                };
                await this.sendResponse(shopId, botId, message, defaultResponseData);
            }

        } catch (error) {
            this.log(`❌ [PROCESS] Error processing message: ${error.message}`, 'ERROR', botId);
        }
    }

    async getBotKeywords(shopId, botId) {
        try {
            this.log(`🔍 [KEYWORDS] Fetching keywords for shop ${shopId}`, 'DEBUG', botId);

            // Get shop keywords from webhook endpoint (no authentication required)
            const keywordsResponse = await axios.get(`${this.apiBaseUrl}/webhook/shop-keywords/${shopId}`, {
                timeout: 10000
            });

            if (!keywordsResponse.data.success) {
                this.log(`🔍 [KEYWORDS] No keywords found for shop ${shopId}`, 'DEBUG', botId);
                return [];
            }

            const keywords = keywordsResponse.data.data;
            this.log(`🔍 [KEYWORDS] Found ${keywords.length} keywords for shop ${shopId}`, 'DEBUG', botId, { keywords });

            // Process keywords into the format expected by the bot
            const keywordData = [];
            
            for (const keyword of keywords) {
                // Create keyword data structure that matches what the bot expects
                keywordData.push({
                    id: keyword.id,
                    keywords: [keyword.trigger_word],
                    message_data: {
                        id: keyword.id,
                        type: 'text',
                        message: { text: keyword.response_message }
                    },
                    response: keyword.response_message,
                    is_contain: keyword.is_contain // Pass the is_contain property
                });
            }

            this.log(`🔍 [KEYWORDS] Processed ${keywordData.length} keyword-message pairs`, 'DEBUG', botId);
            return keywordData;

        } catch (error) {
            this.log(`❌ [KEYWORDS] Error fetching keywords: ${error.message}`, 'ERROR', botId);
            return [];
        }
    }

    extractResponseFromMessage(message) {
        try {
            this.log(`🔍 [RESPONSE] Extracting response from message`, 'DEBUG', null, {
                messageType: message.type,
                messageStructure: JSON.stringify(message.message, null, 2)
            });
            
            if (message.type === 'text') {
                // For text messages, extract the text content
                if (message.message && typeof message.message === 'object') {
                    // Try different possible structures
                    if (message.message.text) {
                        return message.message.text;
                    } else if (message.message.messageText) {
                        return message.message.messageText;
                    } else if (message.message.message && message.message.message.text) {
                        return message.message.message.text;
                    } else if (message.message.message && message.message.message.messageText) {
                        return message.message.message.messageText;
                    } else if (typeof message.message === 'string') {
                        return message.message;
                    }
                } else if (typeof message.message === 'string') {
                    return message.message;
                }
            }
            
            // For other message types, return a default response
            return 'Thank you for your message!';
        } catch (error) {
            this.log(`❌ [RESPONSE] Error extracting response: ${error.message}`, 'ERROR');
            return 'Thank you for your message!';
        }
    }

    async sendResponse(shopId, botId, originalMessage, keywordData) {
        try {
            this.log(`📤 [RESPONSE] Sending response`, 'INFO', botId, {
                to: originalMessage.from,
                keywordData: keywordData
            });

            const client = this.activeBots.get(botId);
            if (!client) {
                this.log(`❌ [RESPONSE] Bot client not found`, 'ERROR', botId);
                return;
            }

            // Get the response message from keyword data
            const responseMessage = this.getResponseMessage(keywordData);
            
            if (!responseMessage) {
                this.log(`❌ [RESPONSE] No response message found in keyword data`, 'ERROR', botId);
                return;
            }

            // Send the message
            await client.sendMessage(originalMessage.from, responseMessage);

            this.log(`✅ [RESPONSE] Response sent successfully`, 'INFO', botId, {
                to: originalMessage.from,
                responseLength: responseMessage.length
            });

            // SKIP DATABASE STORAGE - Response sent successfully
            this.log(`🔧 [DEBUG] Skipping database storage for bot response`, 'INFO', botId);

        } catch (error) {
            this.log(`❌ [RESPONSE] Error sending response: ${error.message}`, 'ERROR', botId);
        }
    }

    getResponseMessage(keywordData) {
        // Extract response message from keyword data
        if (keywordData.message_data && keywordData.message_data.message) {
            const messageData = keywordData.message_data.message;
            
            if (typeof messageData === 'string') {
                return messageData;
            } else if (messageData.messageText) {
                return messageData.messageText;
            } else if (messageData.response) {
                return messageData.response;
            }
        }
        
        // Fallback to direct response field
        if (keywordData.response) {
            return keywordData.response;
        }

        return null;
    }

    async storeBotResponse(shopId, botId, toNumber, responseMessage, keywordId) {
        try {
            this.log(`💾 [STORE_RESPONSE] Storing bot response`, 'DEBUG', botId);

            const response = await axios.post(`${this.apiBaseUrl}/webhook/message`, {
                shop_id: shopId,
                whatsapp_number: toNumber,
                customer_name: 'Bot Response',
                message_content: responseMessage,
                direction: 'outbound',
                message_type: 'text',
                media_url: null,
                message_id: `bot_response_${Date.now()}`,
                is_bot_response: true
                // Removed keyword_id as it references the wrong table
            }, {
                timeout: 10000
            });

            this.log(`💾 [STORE_RESPONSE] Bot response stored successfully`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`❌ [STORE_RESPONSE] Error storing bot response: ${error.message}`, 'ERROR', botId);
        }
    }

    async getMediaUrl(message) {
        try {
            if (message.hasMedia) {
                const media = await message.downloadMedia();
                // For now, return a placeholder. In production, you'd upload to a storage service
                return `data:${media.mimetype};base64,${media.data}`;
            }
            return null;
        } catch (error) {
            this.log(`❌ [MEDIA] Error getting media URL: ${error.message}`, 'ERROR');
            return null;
        }
    }

    async cleanupOldSessions(botId) {
        try {
            const sessionsDir = path.join(__dirname, 'sessions');
            
            if (await fs.pathExists(sessionsDir)) {
                const sessionFiles = await fs.readdir(sessionsDir);
                const botSessionPrefix = `bot_${botId}_`;
                
                for (const file of sessionFiles) {
                    if (file.startsWith(botSessionPrefix)) {
                        const filePath = path.join(sessionsDir, file);
                        this.log(`🧹 [CLEANUP] Removing old session: ${file}`, 'INFO', botId, {
                            filePath
                        });
                        await fs.remove(filePath);
                    }
                }
            }
        } catch (error) {
            this.log(`Error cleaning up old sessions: ${error.message}`, 'ERROR', botId);
        }
    }

    async stopBot(botId) {
        const client = this.activeBots.get(botId);
        if (client) {
            try {
                this.log(`Stopping bot...`, 'INFO', botId);
                await client.destroy();
                this.activeBots.delete(botId);
                
                // Clear timeouts
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
                
                this.log(`Bot stopped successfully`, 'INFO', botId);
            } catch (error) {
                this.log(`Error stopping bot: ${error.message}`, 'ERROR', botId);
            }
        } else {
            this.log(`Bot not found in active bots`, 'WARN', botId);
        }
    }

    async stopAllBots() {
        this.log(`Stopping all bots (${this.activeBots.size} active)`, 'INFO');
        
        const stopPromises = [];
        for (const [botId, client] of this.activeBots) {
            stopPromises.push(this.stopBot(botId));
        }
        
        await Promise.allSettled(stopPromises);
        this.log(`All bots stopped`, 'INFO');
    }

    // Get bot status
    getBotStatus(botId) {
        const client = this.activeBots.get(botId);
        return {
            isActive: !!client,
            hasTimeout: this.qrGenerationTimeouts.has(botId),
            activeBotsCount: this.activeBots.size
        };
    }
}

// Export the class
module.exports = BotStarter;

// If this file is run directly, start a test bot
if (require.main === module) {
    const botStarter = new BotStarter();
    
}

// Export the class
module.exports = BotStarter;

// If this file is run directly, start a test bot
if (require.main === module) {
    const botStarter = new BotStarter();
    
    // Test with shop ID 1 and bot ID 1
    botStarter.startBot(1, 1).then(result => {
        console.log('Test bot start result:', result);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down bots...');
        await botStarter.stopAllBots();
        process.exit(0);
    });
}



    async updateSessionStatus(shopId, botId, status, phoneNumber = null, errorMessage = null) {

        try {

            this.log(`Updating session status: ${status}`, 'DEBUG', botId);

            

            const response = await axios.post(`${this.apiBaseUrl}/webhook/session-status`, {

                shop_id: shopId,

                status: status,

                phone_number: phoneNumber,

                error_message: errorMessage

            }, {

                timeout: 10000 // 10 second timeout

            });

            

            this.log(`Session status updated successfully: ${status}`, 'INFO', botId);

            return response.data;

        } catch (error) {

            this.log(`Error updating session status: ${error.message}`, 'ERROR', botId);

            throw error;

        }

    }



    async storeMessage(shopId, botId, message) {

        try {

            this.log(`💾 [STORE] Storing message in database`, 'DEBUG', botId, {

                from: message.from,

                body: message.body,

                type: message.type

            });



            const response = await axios.post(`${this.apiBaseUrl}/webhook/message`, {

                shop_id: shopId,

                whatsapp_number: message.from,

                customer_name: message._data?.notifyName || 'Unknown',

                message_content: message.body,

                direction: 'inbound',

                message_type: message.type,

                media_url: message.hasMedia ? await this.getMediaUrl(message) : null,

                message_id: message.id._serialized,

                is_bot_response: false

            }, {

                timeout: 10000

            });



            this.log(`💾 [STORE] Message stored successfully`, 'INFO', botId, {

                messageId: response.data.id

            });



            return response.data;

        } catch (error) {

            this.log(`❌ [STORE] Error storing message: ${error.message}`, 'ERROR', botId);

            throw error;

        }

    }



    async processMessage(shopId, botId, message) {

        try {

            this.log(`🔍 [PROCESS] Processing message for debugging`, 'DEBUG', botId, {

                messageBody: message.body,

                from: message.from

            });



            // Get bot keywords from Laravel API

            const keywords = await this.getBotKeywords(shopId, botId);

            

            if (!keywords || keywords.length === 0) {

                this.log(`🔍 [PROCESS] No keywords configured for bot`, 'INFO', botId);

                // Send default response when no keywords are configured

                const defaultResponseData = {

                    id: 'default_response',

                    keywords: ['default'],

                    message_data: {

                        id: 'default_msg',

                        type: 'text',

                        message: 'Thank you for your message! We will get back to you soon.'

                    },

                    response: 'Thank you for your message! We will get back to you soon.'

                };

                await this.sendResponse(shopId, botId, message, defaultResponseData);

                return;

            }



            const messageText = message.body.toLowerCase().trim();

            let responseSent = false;



            this.log(`🔍 [PROCESS] Processing message: "${messageText}" with ${keywords.length} keywords`, 'INFO', botId);



            // Check each keyword

            for (const keywordData of keywords) {

                const keywordKeywords = keywordData.keywords || [];

                

                this.log(`🔍 [PROCESS] Checking keyword group`, 'DEBUG', botId, {

                    keywordData: keywordData,

                    keywords: keywordKeywords,

                    messageText: messageText

                });

                

                for (const keyword of keywordKeywords) {

                    this.log(`🔍 [PROCESS] Checking keyword: "${keyword}" against message: "${messageText}"`, 'DEBUG', botId);

                    

                    if (messageText.includes(keyword.toLowerCase())) {

                        this.log(`✅ [PROCESS] Keyword match found: "${keyword}"`, 'INFO', botId, {

                            matchedKeyword: keyword,

                            messageText: messageText,

                            response: keywordData.response

                        });



                        // Send response

                        await this.sendResponse(shopId, botId, message, keywordData);

                        responseSent = true;

                        break; // Send only first match

                    }

                }

                

                if (responseSent) break; // Stop after first response

            }



            if (!responseSent) {

                this.log(`🔍 [PROCESS] No keyword matches found, sending default response`, 'INFO', botId);

                // Send default response when no keywords match

                const defaultResponseData = {

                    id: 'no_match_response',

                    keywords: ['default'],

                    message_data: {

                        id: 'no_match_msg',

                        type: 'text',

                        message: 'Thank you for your message! We will get back to you soon.'

                    },

                    response: 'Thank you for your message! We will get back to you soon.'

                };

                await this.sendResponse(shopId, botId, message, defaultResponseData);

            }



        } catch (error) {

            this.log(`❌ [PROCESS] Error processing message: ${error.message}`, 'ERROR', botId);

        }

    }



    async getBotKeywords(shopId, botId) {

        try {

            this.log(`🔍 [KEYWORDS] Fetching keywords for shop ${shopId}`, 'DEBUG', botId);



            // Get shop keywords from webhook endpoint (no authentication required)

            const keywordsResponse = await axios.get(`${this.apiBaseUrl}/webhook/shop-keywords/${shopId}`, {

                timeout: 10000

            });



            if (!keywordsResponse.data.success) {

                this.log(`🔍 [KEYWORDS] No keywords found for shop ${shopId}`, 'DEBUG', botId);

                return [];

            }



            const keywords = keywordsResponse.data.data;

            this.log(`🔍 [KEYWORDS] Found ${keywords.length} keywords for shop ${shopId}`, 'DEBUG', botId, { keywords });



            // Process keywords into the format expected by the bot

            const keywordData = [];

            

            for (const keyword of keywords) {

                // Create keyword data structure that matches what the bot expects

                keywordData.push({

                    id: keyword.id,

                    keywords: [keyword.trigger_word],

                    message_data: {

                        id: keyword.id,

                        type: 'text',

                        message: { text: keyword.response_message }

                    },

                    response: keyword.response_message

                });

            }



            this.log(`🔍 [KEYWORDS] Processed ${keywordData.length} keyword-message pairs`, 'DEBUG', botId);

            return keywordData;



        } catch (error) {

            this.log(`❌ [KEYWORDS] Error fetching keywords: ${error.message}`, 'ERROR', botId);

            return [];

        }

    }



    extractResponseFromMessage(message) {

        try {

            this.log(`🔍 [RESPONSE] Extracting response from message`, 'DEBUG', null, {

                messageType: message.type,

                messageStructure: JSON.stringify(message.message, null, 2)

            });

            

            if (message.type === 'text') {

                // For text messages, extract the text content

                if (message.message && typeof message.message === 'object') {

                    // Try different possible structures

                    if (message.message.text) {

                        return message.message.text;

                    } else if (message.message.messageText) {

                        return message.message.messageText;

                    } else if (message.message.message && message.message.message.text) {

                        return message.message.message.text;

                    } else if (message.message.message && message.message.message.messageText) {

                        return message.message.message.messageText;

                    } else if (typeof message.message === 'string') {

                        return message.message;

                    }

                } else if (typeof message.message === 'string') {

                    return message.message;

                }

            }

            

            // For other message types, return a default response

            return 'Thank you for your message!';

        } catch (error) {

            this.log(`❌ [RESPONSE] Error extracting response: ${error.message}`, 'ERROR');

            return 'Thank you for your message!';

        }

    }



    async sendResponse(shopId, botId, originalMessage, keywordData) {

        try {

            this.log(`📤 [RESPONSE] Sending response`, 'INFO', botId, {

                to: originalMessage.from,

                keywordData: keywordData

            });



            const client = this.activeBots.get(botId);

            if (!client) {

                this.log(`❌ [RESPONSE] Bot client not found`, 'ERROR', botId);

                return;

            }



            // Get the response message from keyword data

            const responseMessage = this.getResponseMessage(keywordData);

            

            if (!responseMessage) {

                this.log(`❌ [RESPONSE] No response message found in keyword data`, 'ERROR', botId);

                return;

            }



            // Send the message

            await client.sendMessage(originalMessage.from, responseMessage);



            this.log(`✅ [RESPONSE] Response sent successfully`, 'INFO', botId, {

                to: originalMessage.from,

                responseLength: responseMessage.length

            });



            // SKIP DATABASE STORAGE - Response sent successfully

            this.log(`🔧 [DEBUG] Skipping database storage for bot response`, 'INFO', botId);



        } catch (error) {

            this.log(`❌ [RESPONSE] Error sending response: ${error.message}`, 'ERROR', botId);

        }

    }



    getResponseMessage(keywordData) {

        // Extract response message from keyword data

        if (keywordData.message_data && keywordData.message_data.message) {

            const messageData = keywordData.message_data.message;

            

            if (typeof messageData === 'string') {

                return messageData;

            } else if (messageData.messageText) {

                return messageData.messageText;

            } else if (messageData.response) {

                return messageData.response;

            }

        }

        

        // Fallback to direct response field

        if (keywordData.response) {

            return keywordData.response;

        }



        return null;

    }



    async storeBotResponse(shopId, botId, toNumber, responseMessage, keywordId) {

        try {

            this.log(`💾 [STORE_RESPONSE] Storing bot response`, 'DEBUG', botId);



            const response = await axios.post(`${this.apiBaseUrl}/webhook/message`, {

                shop_id: shopId,

                whatsapp_number: toNumber,

                customer_name: 'Bot Response',

                message_content: responseMessage,

                direction: 'outbound',

                message_type: 'text',

                media_url: null,

                message_id: `bot_response_${Date.now()}`,

                is_bot_response: true

                // Removed keyword_id as it references the wrong table

            }, {

                timeout: 10000

            });



            this.log(`💾 [STORE_RESPONSE] Bot response stored successfully`, 'INFO', botId);

            return response.data;

        } catch (error) {

            this.log(`❌ [STORE_RESPONSE] Error storing bot response: ${error.message}`, 'ERROR', botId);

        }

    }



    async getMediaUrl(message) {

        try {

            if (message.hasMedia) {

                const media = await message.downloadMedia();

                // For now, return a placeholder. In production, you'd upload to a storage service

                return `data:${media.mimetype};base64,${media.data}`;

            }

            return null;

        } catch (error) {

            this.log(`❌ [MEDIA] Error getting media URL: ${error.message}`, 'ERROR');

            return null;

        }

    }



    async cleanupOldSessions(botId) {

        try {

            const sessionsDir = path.join(__dirname, 'sessions');

            

            if (await fs.pathExists(sessionsDir)) {

                const sessionFiles = await fs.readdir(sessionsDir);

                const botSessionPrefix = `bot_${botId}_`;

                

                for (const file of sessionFiles) {

                    if (file.startsWith(botSessionPrefix)) {

                        const filePath = path.join(sessionsDir, file);

                        this.log(`🧹 [CLEANUP] Removing old session: ${file}`, 'INFO', botId, {

                            filePath

                        });

                        await fs.remove(filePath);

                    }

                }

            }

        } catch (error) {

            this.log(`Error cleaning up old sessions: ${error.message}`, 'ERROR', botId);

        }

    }



    async stopBot(botId) {

        const client = this.activeBots.get(botId);

        if (client) {

            try {

                this.log(`Stopping bot...`, 'INFO', botId);

                await client.destroy();

                this.activeBots.delete(botId);

                

                // Clear timeouts

                if (this.qrGenerationTimeouts.has(botId)) {

                    clearTimeout(this.qrGenerationTimeouts.get(botId));

                    this.qrGenerationTimeouts.delete(botId);

                }

                

                this.log(`Bot stopped successfully`, 'INFO', botId);

            } catch (error) {

                this.log(`Error stopping bot: ${error.message}`, 'ERROR', botId);

            }

        } else {

            this.log(`Bot not found in active bots`, 'WARN', botId);

        }

    }



    async stopAllBots() {

        this.log(`Stopping all bots (${this.activeBots.size} active)`, 'INFO');

        

        const stopPromises = [];

        for (const [botId, client] of this.activeBots) {

            stopPromises.push(this.stopBot(botId));

        }

        

        await Promise.allSettled(stopPromises);

        this.log(`All bots stopped`, 'INFO');

    }



    // Get bot status

    getBotStatus(botId) {

        const client = this.activeBots.get(botId);

        return {

            isActive: !!client,

            hasTimeout: this.qrGenerationTimeouts.has(botId),

            activeBotsCount: this.activeBots.size

        };

    }

}



// Export the class

module.exports = BotStarter;



// If this file is run directly, start a test bot

if (require.main === module) {

    const botStarter = new BotStarter();

    

    // Test with shop ID 1 and bot ID 1

    botStarter.startBot(1, 1).then(result => {

        console.log('Test bot start result:', result);

    });



    // Handle graceful shutdown

    process.on('SIGINT', async () => {

        console.log('Shutting down bots...');

        await botStarter.stopAllBots();

        process.exit(0);

    });

} 
