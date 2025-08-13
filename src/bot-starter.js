const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

class BotStarter {
    constructor() {
        this.apiBaseUrl = 'http://197.140.142.101:8000/api';
        this.activeBots = new Map();
        this.qrGenerationTimeouts = new Map();
        this.maxQrGenerationTime = 30000; // 30 seconds timeout
        this.maxConnectionTime = 60000; // 60 seconds timeout
        
        // Check for existing sessions on startup
        this.checkExistingSessions();
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

            // Check if bot is already running - STOP the existing one first
            if (this.activeBots.has(botId)) {
                this.log(`⚠️ [START_BOT] Bot is already running, stopping existing session`, 'WARN', botId, {
                    botId,
                    existingSessionId: this.activeBots.get(botId)?.sessionId || 'unknown'
                });
                
                // Stop the existing bot
                await this.stopBot(botId);
                
                // Wait a moment for cleanup
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Don't clean up old sessions - let them be
            this.log(`ℹ️ [START_BOT] Skipping session cleanup for bot ${botId}`, 'INFO', botId);

            // Create session in Laravel database
            await this.createSession(shopId, botId, sessionId);

            // Create WhatsApp client with fresh session
            this.log(`🔧 [START_BOT] Creating WhatsApp client`, 'INFO', botId, {
                sessionId,
                dataPath: path.join(__dirname, 'sessions')
            });
            
            const client = new Client({
                authStrategy: new LocalAuth({
                    clientId: sessionId,
                    dataPath: path.join(__dirname, 'sessions')
                }),
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
                        '--disable-features=VizDisplayCompositor'
                    ]
                }
            });

            // Set up event handlers
            client.on('qr', async (qr) => {
                this.log(`📱 [QR_EVENT] QR Code received`, 'INFO', botId, {
                    qrLength: qr ? qr.length : 0
                });
                
                try {
                    // Generate QR code image
                    const qrDir = path.join(__dirname, '..', 'laravel-backend', 'storage', 'qr-codes', sessionId);
                    await fs.ensureDir(qrDir);
                    const qrPath = path.join(qrDir, 'qr.png');
                    
                    await qrcode.toFile(qrPath, qr, {
                        errorCorrectionLevel: 'H',
                            type: 'image/png',
                        quality: 1.0,
                        margin: 2,
                        width: 256,
                        height: 256
                    });

                    // Update Laravel API with QR code
                    await this.updateQrCode(shopId, botId, qr, `qr-codes/${sessionId}/qr.png`);
                    
                    this.log(`✅ [QR_EVENT] QR Code saved successfully`, 'INFO', botId);
                    
                    // Set up QR generation timeout
                    if (this.qrGenerationTimeouts.has(botId)) {
                        clearTimeout(this.qrGenerationTimeouts.get(botId));
                    }
                    
                    const qrTimeout = setTimeout(() => {
                        this.log(`⏰ [QR_TIMEOUT] QR code timeout after ${this.maxQrGenerationTime}ms`, 'WARN', botId);
                        // Don't remove from activeBots if the bot is already connected
                        const botData = this.activeBots.get(botId);
                        if (botData && botData.client && botData.client.pupPage) {
                            this.log(`✅ [QR_TIMEOUT] Bot ${botId} is already connected, keeping in activeBots`, 'INFO', botId);
                        } else {
                            this.log(`🗑️ [QR_TIMEOUT] Removing bot ${botId} from activeBots due to timeout`, 'WARN', botId);
                            this.activeBots.delete(botId);
                        }
                    }, this.maxQrGenerationTime);
                    
                    this.qrGenerationTimeouts.set(botId, qrTimeout);
                    
                } catch (error) {
                    this.log(`❌ [QR_EVENT] Error handling QR code: ${error.message}`, 'ERROR', botId);
                    await this.updateSessionStatus(shopId, botId, 'error', null, `QR code generation failed: ${error.message}`);
                }
            });

            client.on('ready', async () => {
                this.log(`✅ Bot is ready!`, 'INFO', botId);
                
                // Clear QR timeout since we're connected
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
                
                try {
                    const phoneNumber = client.info?.wid?.user;
                    this.log(`📱 Connected with phone: ${phoneNumber}`, 'INFO', botId);
                    
                    // Update session status to connected
                    await this.updateSessionStatus(shopId, botId, 'connected', phoneNumber);
                    
                } catch (error) {
                    this.log(`❌ Error in ready event: ${error.message}`, 'ERROR', botId);
                }
            });

            client.on('disconnected', async (reason) => {
                this.log(`❌ Bot disconnected. Reason: ${reason}`, 'WARN', botId);
                
                // Clear timeouts
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
                
                await this.updateSessionStatus(shopId, botId, 'disconnected', null, reason);
                
                // Remove from active bots - NO AUTO-RESTART
                this.log(`🗑️ [DISCONNECT] Removing bot ${botId} from active bots - no auto-restart`, 'INFO', botId);
                this.activeBots.delete(botId);
            });

            client.on('auth_failure', async (message) => {
                this.log(`❌ Authentication failed: ${message}`, 'ERROR', botId);
                
                // Clear timeouts
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
                
                await this.updateSessionStatus(shopId, botId, 'error', null, `Authentication failed: ${message}`);
                this.activeBots.delete(botId);
            });

            // Handle incoming messages
            client.on('message', async (message) => {
                try {
                    this.log(`📨 [MESSAGE] Received message`, 'INFO', botId, {
                        from: message.from,
                        body: message.body,
                        type: message.type
                    });

                    // Skip group messages and own messages
                    if (message.from.includes('@g.us') || message.fromMe) {
                        return;
                    }

                    // Process the message
                    await this.processMessage(shopId, botId, message);

                } catch (error) {
                    this.log(`❌ [MESSAGE] Error handling message: ${error.message}`, 'ERROR', botId);
                }
            });

            // Store the client immediately after creation to prevent race conditions
            this.activeBots.set(botId, {
                client: client,
                sessionId: sessionId,
                shopId: shopId,
                startTime: startTime
            });
            
            this.log(`📝 [START_BOT] Bot ${botId} stored in activeBots before initialization`, 'INFO', botId);
            
            // Initialize the client with timeout
            this.log(`🚀 Initializing WhatsApp client...`, 'INFO', botId);
            
            // Set up connection timeout
            const connectionTimeout = setTimeout(() => {
                this.log(`⏰ [TIMEOUT] Connection timeout after ${this.maxConnectionTime}ms`, 'WARN', botId);
                // Don't remove from activeBots if the bot is already connected
                const botData = this.activeBots.get(botId);
                if (botData && botData.client && botData.client.pupPage) {
                    this.log(`✅ [TIMEOUT] Bot ${botId} is already connected, keeping in activeBots`, 'INFO', botId);
                } else {
                    this.log(`🗑️ [TIMEOUT] Removing bot ${botId} from activeBots due to timeout`, 'WARN', botId);
                    this.activeBots.delete(botId);
                }
            }, this.maxConnectionTime);
            
            try {
                await client.initialize();
                clearTimeout(connectionTimeout);
            } catch (error) {
                clearTimeout(connectionTimeout);
                // Remove from activeBots if initialization fails
                this.activeBots.delete(botId);
                throw error;
            }

            // Verify the bot was stored correctly
            const storedBot = this.activeBots.get(botId);
            if (!storedBot || !storedBot.client) {
                throw new Error('Failed to store bot client in activeBots map');
            }

            this.log(`✅ Bot started successfully and stored in activeBots`, 'INFO', botId, {
                activeBotsCount: this.activeBots.size,
                storedBotId: botId,
                hasClient: !!storedBot.client
            });
            
            return { success: true, sessionId };

        } catch (error) {
            this.log(`❌ Error starting bot: ${error.message}`, 'ERROR', botId);
            await this.updateSessionStatus(shopId, botId, 'error', null, error.message);
            return { success: false, error: error.message };
        }
    }

    async updateQrCode(shopId, botId, qrCode, qrCodePath) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/webhook/qr-code`, {
                shop_id: shopId,
                qr_code: qrCode,
                qr_code_path: qrCodePath
            }, {
                timeout: 10000
            });
            
            this.log(`✅ QR code updated successfully`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`❌ Error updating QR code: ${error.message}`, 'ERROR', botId);
            throw error;
        }
    }

    async createSession(shopId, botId, sessionId) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/webhook/create-session`, {
                shop_id: shopId,
                bot_id: botId,
                session_id: sessionId,
                status: 'connecting'
            }, {
                timeout: 10000
            });
            
            this.log(`✅ Session created successfully`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`❌ Error creating session: ${error.message}`, 'ERROR', botId);
            return null;
        }
    }

    async updateSessionStatus(shopId, botId, status, phoneNumber = null, errorMessage = null) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/webhook/session-status`, {
                shop_id: shopId,
                status: status,
                phone_number: phoneNumber,
                error_message: errorMessage
            }, {
                timeout: 10000
            });

            this.log(`✅ Session status updated: ${status}`, 'INFO', botId);
            return response.data;
        } catch (error) {
            this.log(`❌ Error updating session status: ${error.message}`, 'ERROR', botId);
            throw error;
        }
    }

    async processMessage(shopId, botId, message) {
        try {
            this.log(`🔍 [PROCESS] Processing message`, 'DEBUG', botId, {
                messageBody: message.body,
                from: message.from
            });

            // Check if bot client is available
            let botData = this.activeBots.get(botId);
            this.log(`🔍 [PROCESS] Bot data check:`, 'DEBUG', botId, {
                hasBotData: !!botData,
                hasClient: !!(botData && botData.client),
                activeBotsCount: this.activeBots.size,
                activeBotIds: Array.from(this.activeBots.keys())
            });
            
            // If bot is not in activeBots but we have a message, try to find the client
            if (!botData || !botData.client) {
                this.log(`⚠️ [PROCESS] Bot not in activeBots map, checking for orphaned client`, 'WARN', botId);
                
                // Try to find the client from the message object
                if (message._client && message._client.pupPage) {
                    this.log(`🔧 [PROCESS] Found orphaned client, re-adding to activeBots`, 'INFO', botId);
                    
                    // Re-add the bot to activeBots
                    botData = {
                        client: message._client,
                        sessionId: `recovered_${botId}_${Date.now()}`,
                        shopId: shopId,
                        startTime: Date.now()
                    };
                    
                    this.activeBots.set(botId, botData);
                    this.log(`✅ [PROCESS] Bot ${botId} re-added to activeBots`, 'INFO', botId);
                } else {
                    // Try to find the client from the message's client property
                    const messageClient = message.client || message._client;
                    if (messageClient && messageClient.pupPage) {
                        this.log(`🔧 [PROCESS] Found client in message.client, re-adding to activeBots`, 'INFO', botId);
                        
                        botData = {
                            client: messageClient,
                            sessionId: `recovered_${botId}_${Date.now()}`,
                            shopId: shopId,
                            startTime: Date.now()
                        };
                        
                        this.activeBots.set(botId, botData);
                        this.log(`✅ [PROCESS] Bot ${botId} re-added to activeBots from message.client`, 'INFO', botId);
                    } else {
                        this.log(`❌ [PROCESS] Bot client not available for processing`, 'ERROR', botId);
                        this.log(`🔍 [PROCESS] Message client check:`, 'DEBUG', botId, {
                            hasMessageClient: !!messageClient,
                            hasPupPage: !!(messageClient && messageClient.pupPage),
                            messageKeys: Object.keys(message || {}),
                            clientKeys: messageClient ? Object.keys(messageClient) : []
                        });
                        return;
                    }
                }
            }

            // Get bot keywords from Laravel API
            const keywords = await this.getBotKeywords(shopId, botId);
            
            if (!keywords || keywords.length === 0) {
                this.log(`🔍 [PROCESS] No keywords configured for bot`, 'INFO', botId);
                // Send default response
                const defaultResponseData = {
                    id: 'default_response',
                    trigger_word: 'default',
                    response_message: 'Thank you for your message! We will get back to you soon.',
                    duration: 8 // Default duration for default response
                };
                await this.sendResponse(shopId, botId, message, defaultResponseData);
                return;
            }

            const messageText = message.body.toLowerCase().trim();
            let responseSent = false;

            // Check each keyword
            for (const keywordData of keywords) {
                const triggerWord = keywordData.trigger_word || keywordData.keyword || '';
                const isContain = keywordData.is_contain === 1 || keywordData.is_contain === true; // API returns 1 for contains, 0 for exact
                
                // Skip empty keywords
                if (!triggerWord || triggerWord.trim() === '') {
                    this.log(`⚠️ [PROCESS] Skipping empty keyword`, 'WARN', botId);
                    continue;
                }
                
                this.log(`🔍 [PROCESS] Checking keyword: "${triggerWord}" (is_contain: ${isContain})`, 'DEBUG', botId);
                
                let isMatch = false;
                
                if (isContain) {
                    // Contains mode: check if the keyword is contained in the message
                    isMatch = messageText.includes(triggerWord.toLowerCase());
                } else {
                    // Exact mode: check if the message exactly matches the keyword
                    isMatch = messageText === triggerWord.toLowerCase();
                }
                
                if (isMatch) {
                    this.log(`✅ [PROCESS] Keyword match found: "${triggerWord}" (mode: ${isContain ? 'contains' : 'exact'})`, 'INFO', botId);
                        await this.sendResponse(shopId, botId, message, keywordData);
                        responseSent = true;
                    break;
                    }
            }

            if (!responseSent) {
                this.log(`🔍 [PROCESS] No keyword matches found, sending default response`, 'INFO', botId);
                const defaultResponseData = {
                    id: 'no_match_response',
                    trigger_word: 'default',
                    response_message: 'Thank you for your message! We will get back to you soon.',
                    duration: 8 // Default duration for no match response
                };
                await this.sendResponse(shopId, botId, message, defaultResponseData);
            }

        } catch (error) {
            this.log(`❌ [PROCESS] Error processing message: ${error.message}`, 'ERROR', botId);
        }
    }

    async getBotKeywords(shopId, botId) {
        try {
            const keywordsResponse = await axios.get(`${this.apiBaseUrl}/webhook/bot-keywords/${botId}`, {
                timeout: 10000
            });

            if (!keywordsResponse.data.success) {
                this.log(`⚠️ [KEYWORDS] API returned success: false`, 'WARN', botId);
                return [];
            }

            const keywords = keywordsResponse.data.data || [];
            this.log(`🔍 [KEYWORDS] Found ${keywords.length} keywords`, 'DEBUG', botId);
            
            // Debug: Log the actual keyword data structure
            if (keywords.length > 0) {
                this.log(`🔍 [KEYWORDS] Sample keyword data:`, 'DEBUG', botId, keywords[0]);
            }
            
            return keywords;

        } catch (error) {
            this.log(`❌ [KEYWORDS] Error fetching keywords: ${error.message}`, 'ERROR', botId);
            return [];
        }
    }

    async sendResponse(shopId, botId, originalMessage, keywordData) {
        try {
            this.log(`📤 [RESPONSE] Sending response`, 'INFO', botId);

            const botData = this.activeBots.get(botId);
            if (!botData || !botData.client) {
                this.log(`❌ [RESPONSE] Bot client not found`, 'ERROR', botId);
                return;
            }
            const client = botData.client;

            // Debug: Log the entire keywordData to see what we're working with
            this.log(`🔍 [RESPONSE] Full keywordData:`, 'DEBUG', botId, keywordData);

            // Get the response message and type
            const responseMessage = keywordData.response_message || keywordData.message?.message || keywordData.response || 'Thank you for your message!';
            const messageType = keywordData.message_type || keywordData.message?.type || 'text';
            const images = keywordData.images || [];
            
            // Debug: Log the extracted values
            this.log(`🔍 [RESPONSE] Extracted values:`, 'DEBUG', botId, {
                responseMessage,
                messageType,
                images,
                imagesLength: images.length,
                hasImages: images.length > 0
            });
            
            // Get duration from keyword data (default to 8 seconds if not specified)
            const duration = keywordData.duration || 8;
            
            this.log(`⏱️ [RESPONSE] Waiting ${duration} seconds before sending response`, 'INFO', botId, {
                duration,
                messageType,
                hasImages: images.length > 0,
                imageCount: images.length
            });
            
            // Wait for the specified duration before sending the response
            const startTime = Date.now();
            this.log(`⏱️ [RESPONSE] Starting ${duration} second delay...`, 'INFO', botId);
            
            await new Promise(resolve => setTimeout(resolve, duration * 1000));
            
            const endTime = Date.now();
            const actualDelay = Math.round((endTime - startTime) / 1000);
            this.log(`✅ [RESPONSE] Delay completed (${actualDelay}s), now sending ${messageType} message`, 'INFO', botId, {
                messageType,
                hasImages: images.length > 0,
                imageCount: images.length,
                requestedDelay: duration,
                actualDelay: actualDelay
            });
            
            // Debug: Log the condition check
            this.log(`🔍 [RESPONSE] Condition check: messageType=${messageType}, images.length=${images.length}`, 'DEBUG', botId);
            
            if (messageType === 'image' && images.length > 0) {
                this.log(`🖼️ [RESPONSE] Sending image response with ${images.length} images`, 'INFO', botId);
                // Send images first
                for (const imageUrl of images) {
                    try {
                        this.log(`🖼️ [RESPONSE] Processing image: ${imageUrl}`, 'DEBUG', botId);
                        // Download the image and send it
                        const media = await this.downloadImage(imageUrl);
                        await client.sendMessage(originalMessage.from, media, { caption: responseMessage });
                        this.log(`✅ [RESPONSE] Image sent successfully: ${imageUrl}`, 'INFO', botId);
                    } catch (error) {
                        this.log(`❌ [RESPONSE] Failed to send image ${imageUrl}: ${error.message}`, 'ERROR', botId);
                        // Fallback to text message
                        await client.sendMessage(originalMessage.from, responseMessage);
                    }
                }
            } else {
                this.log(`📝 [RESPONSE] Sending text response (messageType: ${messageType}, hasImages: ${images.length > 0})`, 'INFO', botId);
                // Send text message
                await client.sendMessage(originalMessage.from, responseMessage);
            }

            this.log(`✅ [RESPONSE] Response sent successfully`, 'INFO', botId);

        } catch (error) {
            this.log(`❌ [RESPONSE] Error sending response: ${error.message}`, 'ERROR', botId);
        }
    }

    async downloadImage(imageUrl) {
        try {
            // Convert Laravel storage URL to full URL if needed
            let fullUrl = imageUrl;
            
            if (imageUrl.startsWith('/storage/')) {
                // Extract filename from /storage/images/filename.ext
                const filename = imageUrl.replace('/storage/images/', '');
                fullUrl = `http://197.140.142.101:8000/api/images/${filename}`;
            } else if (imageUrl.includes('/storage/')) {
                // Handle full URLs that contain /storage/ path
                // Extract filename from http://domain/storage/images/filename.ext
                const filename = imageUrl.split('/storage/')[1];
                fullUrl = `http://197.140.142.101:8000/api/images/${filename}`;
            } else if (!imageUrl.startsWith('http')) {
                // If it's a relative path without /storage/, assume it's a storage path
                const filename = imageUrl.replace('images/', '');
                fullUrl = `http://197.140.142.101:8000/api/images/${filename}`;
            }
            
            // Debug: Log the URL conversion
            this.log(`🔍 [DOWNLOAD] URL conversion: ${imageUrl} → ${fullUrl}`, 'DEBUG');
            
            this.log(`📥 [DOWNLOAD] Downloading image: ${fullUrl}`, 'INFO');
            
            // Download the image
            const response = await axios.get(fullUrl, {
                responseType: 'arraybuffer',
                timeout: 10000
            });

            // Create a buffer from the response
            const buffer = Buffer.from(response.data);
            
            // Determine MIME type from URL or response headers
            let mimeType = 'image/jpeg'; // default
            if (fullUrl.toLowerCase().includes('.png')) {
                mimeType = 'image/png';
            } else if (fullUrl.toLowerCase().includes('.gif')) {
                mimeType = 'image/gif';
            } else if (fullUrl.toLowerCase().includes('.webp')) {
                mimeType = 'image/webp';
            } else if (response.headers['content-type']) {
                mimeType = response.headers['content-type'];
            }
            
            // Create a MessageMedia object
            const { MessageMedia } = require('whatsapp-web.js');
            return new MessageMedia(mimeType, buffer.toString('base64'));
            
        } catch (error) {
            this.log(`❌ [DOWNLOAD] Failed to download image: ${error.message}`, 'ERROR');
            throw error;
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
                        await fs.remove(filePath);
                        this.log(`🧹 [CLEANUP] Removed old session: ${file}`, 'INFO', botId);
                    }
                }
            }
        } catch (error) {
            this.log(`❌ Error cleaning up old sessions: ${error.message}`, 'ERROR', botId);
        }
    }

    async stopBot(botId) {
        const botData = this.activeBots.get(botId);
        if (botData && botData.client) {
            try {
                this.log(`🛑 Stopping bot...`, 'INFO', botId);
                await botData.client.destroy();
                this.activeBots.delete(botId);
                
                // Clear timeouts
                if (this.qrGenerationTimeouts.has(botId)) {
                    clearTimeout(this.qrGenerationTimeouts.get(botId));
                    this.qrGenerationTimeouts.delete(botId);
                }
                
                this.log(`✅ Bot stopped successfully`, 'INFO', botId);
            } catch (error) {
                this.log(`❌ Error stopping bot: ${error.message}`, 'ERROR', botId);
            }
        } else {
            this.log(`⚠️ Bot not found in active bots`, 'WARN', botId);
        }
    }

    async stopAllBots() {
        this.log(`🛑 Stopping all bots (${this.activeBots.size} active)`, 'INFO');
        
        const stopPromises = [];
        for (const [botId, botData] of this.activeBots) {
            stopPromises.push(this.stopBot(botId));
        }
        
        await Promise.allSettled(stopPromises);
        
        // Clear all remaining timeouts
        for (const [botId, timeout] of this.qrGenerationTimeouts) {
            clearTimeout(timeout);
        }
        this.qrGenerationTimeouts.clear();
        
        this.log(`✅ All bots stopped`, 'INFO');
    }

    async checkExistingSessions() {
        try {
            this.log(`🔍 [STARTUP] Checking for existing sessions...`, 'INFO');
            
            const sessionsDir = path.join(__dirname, 'sessions');
            if (await fs.pathExists(sessionsDir)) {
                const sessionFiles = await fs.readdir(sessionsDir);
                this.log(`🔍 [STARTUP] Found ${sessionFiles.length} session files`, 'INFO');
                
                // Look for bot session files
                for (const file of sessionFiles) {
                    if (file.startsWith('bot_') && file.includes('_')) {
                        const parts = file.split('_');
                        if (parts.length >= 2) {
                            const botId = parseInt(parts[1]);
                            if (!isNaN(botId)) {
                                this.log(`🔍 [STARTUP] Found session for bot ${botId}: ${file}`, 'INFO');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            this.log(`❌ [STARTUP] Error checking existing sessions: ${error.message}`, 'ERROR');
        }
    }

    getBotStatus(botId) {
        const botData = this.activeBots.get(botId);
        return {
            isActive: !!botData && !!botData.client,
            hasTimeout: this.qrGenerationTimeouts.has(botId),
            activeBotsCount: this.activeBots.size,
            sessionId: botData?.sessionId || null,
            shopId: botData?.shopId || null,
            startTime: botData?.startTime || null
        };
    }

    getAllBotsStatus() {
        const status = {
            totalBots: this.activeBots.size,
            activeBots: [],
            timeouts: Array.from(this.qrGenerationTimeouts.keys())
        };
        
        for (const [botId, botData] of this.activeBots) {
            status.activeBots.push({
                botId: botId,
                sessionId: botData.sessionId,
                shopId: botData.shopId,
                startTime: botData.startTime,
                hasClient: !!botData.client,
                isReady: !!(botData.client && botData.client.pupPage)
            });
        }
        
        return status;
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
