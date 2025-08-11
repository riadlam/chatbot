const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');
const laravelApi = require('./laravelApi');

class WhatsAppBot {
    constructor(shopId, sessionId) {
        this.shopId = shopId;
        this.sessionId = sessionId;
        this.client = null;
        this.keywords = [];
        this.isConnected = false;
        this.retryCount = 0;
        this.sessionRestored = false; // New property to track session restoration
    }

    async initialize() {
        try {
            console.log(`[Shop ${this.shopId}] Initializing WhatsApp bot with session: ${this.sessionId}`);

            // Create session directories
            await this.createDirectories();
            
            // Check if session already exists and is valid
            const sessionExists = await this.checkExistingSession();
            
            if (sessionExists) {
                console.log(`[Shop ${this.shopId}] 🎯 Found existing session, attempting to restore...`);
            } else {
                console.log(`[Shop ${this.shopId}] 🆕 No existing session found, will create new one`);
            }
            
            // Create WhatsApp client with session recovery
            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: this.sessionId,
                    dataPath: config.whatsapp.sessionPath
                }),
                puppeteer: {
                    ...config.whatsapp.puppeteer,
                    // Add more options for better session handling
                    args: [
                        ...config.whatsapp.puppeteer.args,
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu'
                    ]
                },
                // 🆕 IMPROVED SESSION RECOVERY OPTIONS
                restartOnAuthFail: true,
                takeoverOnConflict: true,
                qrMaxRetries: sessionExists ? 0 : 5, // Don't retry QR if session exists
                authTimeoutMs: sessionExists ? 30000 : 60000, // Shorter timeout for existing sessions
                qrQualityOptions: {
                    quality: 0.8,
                    margin: 4,
                    scale: 4,
                    width: 800
                }
            });

            // Set up event handlers
            this.setupEventHandlers();

            // Initialize the client
            console.log(`[Shop ${this.shopId}] Starting client initialization...`);
            await this.client.initialize();

            console.log(`[Shop ${this.shopId}] WhatsApp bot initialized successfully`);
        } catch (error) { 
            console.error(`[Shop ${this.shopId}] Error initializing bot:`, error.message);
            await this.handleError(error);
        }
    }

    async createDirectories() {
        const sessionDir = path.join(config.whatsapp.sessionPath, this.sessionId);
        const qrDir = path.join(config.whatsapp.qrPath, this.sessionId);

        await fs.ensureDir(sessionDir);
        await fs.ensureDir(qrDir);
    }

    setupEventHandlers() {
        // QR Code Event
        this.client.on('qr', async (qr) => {
            console.log(`[Shop ${this.shopId}] QR Code received`);
            
            // 🆕 Only update QR code if this is a new session, not a restoration
            if (!this.sessionRestored) {
                try {
                    // Generate QR code image
                    const qrPath = path.join(config.whatsapp.qrPath, this.sessionId, 'qr.png');
                    await qrcode.toFile(qrPath, qr);

                    // Update Laravel API
                    await laravelApi.updateQrCode(this.shopId, qr, qrPath);
                    
                    console.log(`[Shop ${this.shopId}] QR Code saved and updated (new session)`);
                } catch (error) {
                    console.error(`[Shop ${this.shopId}] Error handling QR code:`, error.message);
                }
            } else {
                console.log(`[Shop ${this.shopId}] QR Code received but skipping update (session restoration)`);
            }
        });

        // Ready Event
        this.client.on('ready', async () => {
            console.log(`[Shop ${this.shopId}] 🟢 WhatsApp bot is ready!`);
            
            try {
                this.isConnected = true;
                this.retryCount = 0;

                // Get phone number
                const phoneNumber = this.client.info?.wid?.user;
                console.log(`[Shop ${this.shopId}] 📱 Connected with phone: ${phoneNumber}`);

                // Update session status
                await laravelApi.updateSessionStatus(this.shopId, 'connected', phoneNumber);
                console.log(`[Shop ${this.shopId}] ✅ Session status updated to connected`);

                // Load keywords
                await this.loadKeywords();
                console.log(`[Shop ${this.shopId}] ✅ Keywords loaded: ${this.keywords.length} keywords`);

                console.log(`[Shop ${this.shopId}] 🎉 Bot fully ready and listening for messages!`);
            } catch (error) {
                console.error(`[Shop ${this.shopId}] ❌ Error in ready event:`, error.message);
            }
        });

        // 🆕 ADD AUTHENTICATED EVENT FOR SESSION RESTORATION
        this.client.on('authenticated', () => {
            console.log(`[Shop ${this.shopId}] 🔐 Session authenticated successfully`);
            this.sessionRestored = true;
        });

        // Message Event
        this.client.on('message', async (message) => {
            try {
                await this.handleIncomingMessage(message);
            } catch (error) {
                console.error(`[Shop ${this.shopId}] Error handling message:`, error.message);
            }
        });

        // Disconnected Event
        this.client.on('disconnected', async (reason) => {
            console.log(`[Shop ${this.shopId}] Bot disconnected: ${reason}`);
            
            try {
                this.isConnected = false;
                await laravelApi.updateSessionStatus(this.shopId, 'disconnected');
            } catch (error) {
                console.error(`[Shop ${this.shopId}] Error handling disconnection:`, error.message);
            }
        });

        // Authentication Failure Event
        this.client.on('auth_failure', async (message) => {
            console.error(`[Shop ${this.shopId}] Authentication failed: ${message}`);
            
            try {
                await laravelApi.updateSessionStatus(this.shopId, 'error', null, message);
            } catch (error) {
                console.error(`[Shop ${this.shopId}] Error handling auth failure:`, error.message);
            }
        });
    }

    async loadKeywords() {
        try {
            console.log(`[Shop ${this.shopId}] 🔍 Loading keywords from Laravel...`);
            
            // Add a default response in case loading fails
            const defaultKeywords = [{
                id: 'default_response',
                trigger_word: 'default',
                response_message: 'Thank you for your message! We will get back to you soon.',
                message_type: 'text',
                exact_match: false,
                is_active: true,
                priority: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                message: {
                    type: 'text',
                    content: 'Thank you for your message! We will get back to you soon.'
                }
            }];
            
            // Try to fetch keywords with retry logic (handled in laravelApi)
            let keywords = [];
            try {
                keywords = await laravelApi.getShopKeywords(this.shopId);
                if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
                    console.warn(`[Shop ${this.shopId}] ⚠️ No keywords found, using default response`);
                    this.keywords = defaultKeywords;
                    return this.keywords;
                }
            } catch (error) {
                console.error(`[Shop ${this.shopId}] ❌ Failed to load keywords, using default response:`, error.message);
                this.keywords = defaultKeywords;
                return this.keywords;
            }
            
            // Process the loaded keywords
            this.keywords = keywords.map(keyword => {
                // Extract message content and type from the keyword data
                let messageContent = '';
                let messageType = 'text';
                
                // If response_message is a string, use it directly (this is our target format)
                if (keyword.response_message && typeof keyword.response_message === 'string') {
                    messageContent = keyword.response_message;
                }
                // For backward compatibility, check other formats
                else if (keyword.message_data && keyword.message_data.message) {
                    // Format: {"type":"text","message":{"text":"custom message"}}
                    if (keyword.message_data.message.text) {
                        messageContent = keyword.message_data.message.text;
                        messageType = keyword.message_data.type || 'text';
                    }
                    // Format: {"message":"custom message"}
                    else if (typeof keyword.message_data.message === 'string') {
                        messageContent = keyword.message_data.message;
                        messageType = keyword.message_data.type || 'text';
                    }
                }
                // Check for direct message field (backward compatibility)
                else if (keyword.message) {
                    // Format: {"type":"text","message":{"text":"custom message"}}
                    if (keyword.message.message && keyword.message.message.text) {
                        messageContent = keyword.message.message.text;
                        messageType = keyword.message.type || 'text';
                    }
                    // Format: {"message":"custom message"}
                    else if (typeof keyword.message.message === 'string') {
                        messageContent = keyword.message.message;
                        messageType = keyword.message.type || 'text';
                    }
                    // Format: "custom message" (direct string)
                    else if (typeof keyword.message === 'string') {
                        messageContent = keyword.message;
                    }
                }
                
                // Fallback to response_message if available
                if (!messageContent && keyword.response_message) {
                    messageContent = keyword.response_message;
                }
                // Fallback to message_content if available
                if (!messageContent && keyword.message_content) {
                    messageContent = keyword.message_content;
                }
                // Final fallback
                if (!messageContent) {
                    messageContent = keyword.trigger_word 
                        ? `Response to: ${keyword.trigger_word}`
                        : 'Thank you for your message!';
                }
                
                // Log the processed keyword for debugging
                console.log(`[Shop ${this.shopId}] 🔍 Processed keyword:`, {
                    trigger_word: keyword.trigger_word,
                    message_content: messageContent,
                    message_type: messageType,
                    source: keyword.message_data ? 'message_data' : 
                           (keyword.message ? 'message' : 'fallback')
                });
                
                // Create the processed keyword with simplified structure
                const processedKeyword = {
                    id: keyword.id || `keyword_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    trigger_word: keyword.trigger_word || '',
                    response_message: messageContent || 'Thank you for your message!',
                    message_type: keyword.message_type || messageType,
                    is_contain: keyword.is_contain !== undefined ? Boolean(keyword.is_contain) : true, // Use is_contain from database
                    exact_match: keyword.is_contain !== undefined ? !Boolean(keyword.is_contain) : false, // Backward compatibility
                    is_active: keyword.is_active !== undefined ? Boolean(keyword.is_active) : true,
                    priority: typeof keyword.priority === 'number' ? keyword.priority : 0,
                    created_at: keyword.created_at || new Date().toISOString(),
                    updated_at: keyword.updated_at || new Date().toISOString(),
                    // Store message data as a simple object with type and content
                    message: {
                        type: keyword.message_type || messageType,
                        content: messageContent || 'Thank you for your message!',
                        // Include any additional message data
                        ...(keyword.message_data || {})
                    }
                };
                
                return processedKeyword;
            });
            
            console.log(`[Shop ${this.shopId}] ✅ Loaded ${this.keywords.length} keywords from database`);
            
            // Log each keyword for debugging
            this.keywords.forEach((keyword, index) => {
                const messageType = keyword.message_type || 'text';
                const preview = keyword.response_message 
                    ? `"${keyword.response_message.substring(0, 50)}${keyword.response_message.length > 50 ? '...' : ''}"` 
                    : '[No message]';
                    
                console.log(
                    `[Shop ${this.shopId}] 📝 Keyword ${index + 1}: "${keyword.trigger_word}" ` +
                    `(type: ${messageType}, contains: ${keyword.is_contain}, active: ${keyword.is_active}) -> ${preview}`
                );
            });
            
            return this.keywords;
        } catch (error) {
            console.error(`[Shop ${this.shopId}] ❌ Error loading keywords:`, error.message);
            console.error(error.stack);
            this.keywords = [];
            return [];
        }
    }

    async handleIncomingMessage(message) {
        let messageId = message.id?._serialized || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const from = message.from || 'unknown';
        const messageType = this.getMessageType(message);
        let mediaUrl = null;
        
        try {
            console.log(`[Shop ${this.shopId}] 📥 Received ${messageType} message from ${from}`);
            
            // Download media if present
            if (message.hasMedia) {
                try {
                    mediaUrl = await this.downloadMedia(message);
                    console.log(`[Shop ${this.shopId}] ✅ Downloaded media: ${mediaUrl || 'Failed to download'}`);
                } catch (mediaError) {
                    console.error(`[Shop ${this.shopId}] ❌ Error downloading media:`, mediaError.message);
                }
            }
            
            // Prepare message data for storage
            // Extract plain text message content
            let messageContent = message.body || '[Media message]';
            
            const messageData = {
                shop_id: this.shopId,
                whatsapp_number: from,
                customer_name: message._data?.notifyName || null,
                message_content: messageContent, // Store as plain text
                direction: 'inbound',
                message_type: messageType,
                media_url: mediaUrl,
                message_id: messageId,
                is_bot_response: false,
                keyword_id: null
            };

            // Store the incoming message in the database
            try {
                await laravelApi.storeMessage(messageData);
                console.log(`[Shop ${this.shopId}] ✅ Message stored in database`);
            } catch (dbError) {
                console.error(`[Shop ${this.shopId}] ❌ Error storing message in database:`, dbError.message);
                // Continue processing even if database storage fails
            }

            // Skip processing if this is a bot's own message or from a group
            if (message.fromMe || message.id?.fromMe) {
                console.log(`[Shop ${this.shopId}] ⏩ Skipping bot's own message`);
                return;
            }
            
            // Check for keyword matches (always returns a response, even if it's a default one)
            const matchedKeyword = this.findMatchingKeyword(message.body || '');
            
            // Log the matched keyword
            console.log(`[Shop ${this.shopId}] 🎯 Matched keyword: "${matchedKeyword.trigger_word}" ` +
                       `(type: ${matchedKeyword.message_type || 'text'})`);
            
            // Send the response
            await this.sendBotResponse(message, matchedKeyword);

            console.log(`[Shop ${this.shopId}] ✅ Successfully processed message from ${from}`);
            
        } catch (error) {
            console.error(`[Shop ${this.shopId}] ❌ Error handling incoming message (${messageType} from ${from}):`, error.message);
            
            // Try to send an error message to the user
            try {
                await message.reply('Sorry, there was an error processing your message. Please try again later.');
            } catch (replyError) {
                console.error(`[Shop ${this.shopId}] ❌ Failed to send error message:`, replyError.message);
            }
            
            // Log the error to the database
            try {
                await laravelApi.storeMessage({
                    shop_id: this.shopId,
                    whatsapp_number: from,
                    customer_name: message._data?.notifyName || null,
                    message_content: `[ERROR] ${error.message}`,
                    direction: 'outbound',
                    message_type: 'error',
                    message_id: `error_${Date.now()}`,
                    is_bot_response: true
                });
            } catch (dbError) {
                console.error(`[Shop ${this.shopId}] ❌ Failed to log error to database:`, dbError.message);
            }
        }
    }

    findMatchingKeyword(messageText) {
        const lowerMessage = messageText.toLowerCase();
        
        // 🔍 SEARCH FOR KEYWORDS IN BOT_KEYWORDS TABLE
        const sortedKeywords = [...this.keywords].sort((a, b) => b.priority - a.priority);
        
        for (const keyword of sortedKeywords) {
            if (!keyword.is_active) continue;
            
            const lowerKeyword = keyword.trigger_word.toLowerCase();
            let isMatch = false;
            
            if (keyword.is_contain) {
                // Contains mode: "hello riad" contains "hello" ✅
                isMatch = lowerMessage.includes(lowerKeyword);
            } else {
                // Exact mode: "hello riad" !== "hello" ❌
                isMatch = (lowerMessage === lowerKeyword);
            }
            
            if (isMatch) {
                console.log(`[Shop ${this.shopId}] 🎯 ${keyword.is_contain ? 'Contains' : 'Exact'} keyword matched: "${keyword.trigger_word}"`);
                
                // Get the associated message from the keyword
                const message = keyword.message;
                if (!message) {
                    console.log(`[Shop ${this.shopId}] ⚠️ No message found for keyword: "${keyword.trigger_word}"`);
                    continue; // Skip to next keyword if no message is found
                }
                
                // The response message is already in the keyword.response_message field
                let responseMessage = keyword.response_message || 'Thank you for your message!';
                
                // Handle different message formats
                if (message.message) {
                    // Format: {"type":"text","message":{"text":"custom message"}}
                    if (message.message.text) {
                        responseMessage = message.message.text;
                    } 
                    // Format: {"message":"custom message"}
                    else if (typeof message.message === 'string') {
                        responseMessage = message.message;
                    }
                    // Format: "custom message" (direct string)
                    else if (typeof message === 'string') {
                        responseMessage = message;
                    }
                }
                
                // Fallback to response_message if available
                if (keyword.response_message) {
                    responseMessage = keyword.response_message;
                }
                
                return {
                    trigger_word: keyword.trigger_word,
                    response_message: responseMessage,
                    id: keyword.id,
                    is_active: true,
                    message_type: message.type,
                    message_data: message.message || {}
                };
            }
        }
        
        // ❌ NO KEYWORD MATCH - RETURN DEFAULT MESSAGE
        console.log(`[Shop ${this.shopId}] ❌ No keyword match found for: "${messageText}"`);
        return {
            trigger_word: 'no_match',
            response_message: 'Thank you for your message! We will get back to you soon.',
            id: 'no_match',
            is_active: true,
            message_type: 'text',
            message_data: {}
        };
    }

    async sendBotResponse(originalMessage, keyword) {
        const messageId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const to = originalMessage.from;
        const messageType = keyword.message_type || 'text';
        const messageData = keyword.message_data || {};
        let responseSent = false;
        let responseContent = keyword.response_message || 'Thank you for your message!';
        
        try {
            console.log(`[Shop ${this.shopId}] 📤 Sending ${messageType} response to ${to}`);
            
            // Send the appropriate response based on message type
            switch (messageType.toLowerCase()) {
                case 'image':
                    if (messageData.url) {
                        await originalMessage.reply('', { 
                            media: messageData.url, 
                            caption: messageData.caption || '',
                            sendMediaAsDocument: messageData.as_document || false
                        });
                        responseSent = true;
                    }
                    break;
                    
                case 'document':
                    if (messageData.url) {
                        await originalMessage.reply('', { 
                            media: messageData.url, 
                            filename: messageData.filename || 'document.pdf', 
                            caption: messageData.caption || '',
                            sendMediaAsDocument: true
                        });
                        responseSent = true;
                    }
                    break;
                    
                case 'video':
                    if (messageData.url) {
                        await originalMessage.reply('', { 
                            media: messageData.url, 
                            caption: messageData.caption || '',
                            sendVideoAsGif: messageData.as_gif || false
                        });
                        responseSent = true;
                    }
                    break;
                    
                case 'audio':
                    if (messageData.url) {
                        await originalMessage.reply('', { 
                            media: messageData.url,
                            sendAudioAsVoice: messageData.as_voice || false
                        });
                        responseSent = true;
                    }
                    break;
                    
                case 'location':
                    if (messageData.latitude && messageData.longitude) {
                        await originalMessage.reply('', { 
                            location: { 
                                lat: parseFloat(messageData.latitude), 
                                lng: parseFloat(messageData.longitude),
                                name: messageData.name || 'Location',
                                address: messageData.address || ''
                            } 
                        });
                        responseSent = true;
                        responseContent = `Location: ${messageData.name || ''} ${messageData.address || ''}`.trim();
                    }
                    break;
                    
                case 'button':
                    if (messageData.buttons && Array.isArray(messageData.buttons)) {
                        const buttons = messageData.buttons.map(btn => ({
                            id: btn.id || `btn_${Math.random().toString(36).substr(2, 6)}`,
                            text: btn.text || 'Button'
                        }));
                        
                        await originalMessage.reply('', {
                            body: messageData.text || 'Please select an option:',
                            buttons: buttons,
                            title: messageData.title,
                            footer: messageData.footer
                        });
                        responseSent = true;
                        responseContent = `[Button Message] ${messageData.text || ''}`.trim();
                    }
                    break;
                    
                case 'list':
                    if (messageData.sections && Array.isArray(messageData.sections)) {
                        await originalMessage.reply('', {
                            title: messageData.title || 'Menu',
                            text: messageData.text || 'Please select an option:',
                            buttonText: messageData.buttonText || 'View Options',
                            sections: messageData.sections.map(section => ({
                                title: section.title,
                                rows: section.rows.map(row => ({
                                    title: row.title,
                                    description: row.description,
                                    rowId: row.id || `row_${Math.random().toString(36).substr(2, 6)}`
                                }))
                            }))
                        });
                        responseSent = true;
                        responseContent = `[List Message] ${messageData.text || ''}`.trim();
                    }
                    break;
                    
                case 'text':
                default:
                    // For text or any other type, send as text
                    await originalMessage.reply(responseContent);
                    responseSent = true;
            }
            
            // If no response was sent with the specific type, send a text response
            if (!responseSent) {
                console.log(`[Shop ${this.shopId}] ⚠️ Could not send ${messageType} response, falling back to text`);
                await originalMessage.reply(responseContent);
            }
            
            // Prepare metadata with additional information (kept as JSON)
            const metadata = {
                message_type: messageType,
                keyword_id: keyword.id,
                trigger_word: keyword.trigger_word,
                message_data: messageData
            };
            
            // Store the sent message in the database with plain text content
            const messageDataForDb = {
                shop_id: this.shopId,
                whatsapp_number: to,
                customer_name: originalMessage._data?.notifyName || null,
                message_content: responseContent, // This is already a plain string
                direction: 'outbound',
                message_type: messageType,
                media_url: messageData.url || null,
                message_id: messageId,
                is_bot_response: true,
                keyword_id: keyword.id || null,
                metadata: JSON.stringify(metadata) // Keep metadata as JSON string
            };

            try {
                await laravelApi.storeMessage(messageDataForDb);
                console.log(`[Shop ${this.shopId}] ✅ Bot response stored in database`);
            } catch (dbError) {
                console.error(`[Shop ${this.shopId}] ❌ Error storing bot response in database:`, dbError.message);
            }
            
            return { success: true, messageId };
            
        } catch (error) {
            console.error(`[Shop ${this.shopId}] ❌ Error sending ${messageType} response to ${to}:`, error.message);
            
            // Try to send a generic error message if the original message sending failed
            try {
                await originalMessage.reply('Sorry, I encountered an error processing your request. Please try again later.');
                
                // Log the error response
                await laravelApi.storeMessage({
                    shop_id: this.shopId,
                    whatsapp_number: to,
                    message_content: `[ERROR] ${error.message || 'Failed to send message'}`,
                    direction: 'outbound',
                    message_type: 'error',
                    message_id: `error_${messageId}`,
                    is_bot_response: true,
                    metadata: JSON.stringify({
                        error: error.message,
                        stack: error.stack,
                        original_type: messageType,
                        keyword_id: keyword.id,
                        trigger_word: keyword.trigger_word
                    })
                });
                
            } catch (fallbackError) {
                console.error(`[Shop ${this.shopId}] ❌ Failed to send error message:`, fallbackError.message);
                
                // Try to log the error to the database
                try {
                    await laravelApi.storeMessage({
                        shop_id: this.shopId,
                        whatsapp_number: to,
                        message_content: `[ERROR] Failed to send ${keyword.message_type || 'text'} response: ${error.message}`,
                        direction: 'outbound',
                        message_type: 'error',
                        message_id: `error_${Date.now()}`,
                        is_bot_response: true,
                        keyword_id: keyword.id
                    });
                } catch (dbError) {
                    console.error(`[Shop ${this.shopId}] Failed to log error to database:`, dbError.message);
                }
            }
            
            return { 
                success: false, 
                error: error.message,
                messageId: `error_${messageId}`
            };
        }
    }

    getMessageType(message) {
        if (message.hasMedia) {
            if (message.type === 'image') return 'image';
            if (message.type === 'document') return 'document';
            if (message.type === 'audio') return 'audio';
            if (message.type === 'video') return 'video';
            if (message.type === 'location') return 'location';
        }
        return 'text';
    }

    async downloadMedia(message) {
        try {
            const media = await message.downloadMedia();
            const fileName = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${media.mimetype.split('/')[1]}`;
            const filePath = path.join(config.whatsapp.qrPath, this.sessionId, fileName);
            
            await fs.writeFile(filePath, media.data, 'base64');
            return filePath;
        } catch (error) {
            console.error(`[Shop ${this.shopId}] Error downloading media:`, error.message);
            return null;
        }
    }

    async handleError(error) {
        console.error(`[Shop ${this.shopId}] Bot error:`, error.message);
        
        try {
            await laravelApi.updateSessionStatus(this.shopId, 'error', null, error.message);
        } catch (apiError) {
            console.error(`[Shop ${this.shopId}] Error updating status:`, apiError.message);
        }
    }

    async destroy() {
        try {
            if (this.client) {
                // Don't destroy, just logout to preserve session
                if (this.isConnected) {
                    await this.client.logout();
                    console.log(`[Shop ${this.shopId}] Bot logged out gracefully`);
                } else {
                    await this.client.destroy();
                    console.log(`[Shop ${this.shopId}] Bot destroyed (not connected)`);
                }
            }
        } catch (error) {
            console.error(`[Shop ${this.shopId}] Error destroying bot:`, error.message);
        }
    }

    isReady() {
        return this.client && this.isConnected;
    }

    // 🆕 ADD METHOD TO CHECK EXISTING SESSION
    async checkExistingSession() {
        try {
            const sessionDir = path.join(config.whatsapp.sessionPath, this.sessionId);
            const sessionExists = await fs.pathExists(sessionDir);
            
            if (sessionExists) {
                const files = await fs.readdir(sessionDir);
                // Check if session has authentication data
                const hasAuthData = files.some(file => 
                    file.includes('session') || 
                    file.includes('auth') || 
                    file.includes('tokens')
                );
                
                console.log(`[Shop ${this.shopId}] Session directory exists: ${sessionExists}, has auth data: ${hasAuthData}`);
                return hasAuthData;
            }
            
            return false;
        } catch (error) {
            console.error(`[Shop ${this.shopId}] Error checking existing session:`, error.message);
            return false;
        }
    }
}

module.exports = WhatsAppBot; 