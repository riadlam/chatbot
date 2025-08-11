const WhatsAppBot = require('../services/whatsappBot');
const laravelApi = require('../services/laravelApi');

class BotManager {
    constructor() {
        this.bots = new Map(); // shopId -> WhatsAppBot instance
        this.isRunning = false;
    }

    async start() {
        if (this.isRunning) {
            console.log('Bot manager is already running');
            return;
        }

        console.log('Starting WhatsApp Bot Manager...');
        this.isRunning = true;

        // 🔄 AUTO-RESTART EXISTING SESSIONS
        await this.autoRestartBots();

        // 🚫 TEMPORARILY DISABLED: Start health check loop
        // this.startHealthCheck();

        console.log('Bot manager started successfully');
    }

    async stop() {
        console.log('Stopping WhatsApp Bot Manager gracefully...');
        this.isRunning = false;

        // Stop all bots gracefully (don't destroy sessions)
        for (const [shopId, bot] of this.bots) {
            await this.stopBotGracefully(shopId);
        }

        console.log('Bot manager stopped gracefully');
    }

    async startBot(shopId) {
        try {
            console.log(`Starting bot for shop ${shopId}...`);

            // Check if bot already exists
            if (this.bots.has(shopId)) {
                console.log(`Bot for shop ${shopId} is already running`);
                return this.bots.get(shopId);
            }

            // Get shop info from Laravel API
            const shop = await laravelApi.getShop(shopId);
            if (!shop) {
                throw new Error(`Shop ${shopId} not found`);
            }

            // Create or get session
            let session = await laravelApi.getBotStatus(shopId);
            if (!session || !session.has_session) {
                session = await laravelApi.createSession(shopId);
            }

            // Create bot instance
            const bot = new WhatsAppBot(shopId, session.session_id);
            
            // Initialize bot
            await bot.initialize();

            // Store bot instance
            this.bots.set(shopId, bot);

            console.log(`Bot for shop ${shopId} started successfully`);
            return bot;

        } catch (error) {
            console.error(`Error starting bot for shop ${shopId}:`, error.message);
            throw error;
        }
    }

    async stopBot(shopId) {
        try {
            const bot = this.bots.get(shopId);
            if (!bot) {
                console.log(`No bot found for shop ${shopId}`);
                return;
            }

            await bot.destroy();
            this.bots.delete(shopId);

            console.log(`Bot for shop ${shopId} stopped successfully`);
        } catch (error) {
            console.error(`Error stopping bot for shop ${shopId}:`, error.message);
        }
    }

    async restartBot(shopId) {
        try {
            await this.stopBot(shopId);
            await this.startBot(shopId);
            console.log(`Bot for shop ${shopId} restarted successfully`);
        } catch (error) {
            console.error(`Error restarting bot for shop ${shopId}:`, error.message);
            throw error;
        }
    }

    getBot(shopId) {
        return this.bots.get(shopId);
    }

    getAllBots() {
        return Array.from(this.bots.entries()).map(([shopId, bot]) => ({
            shopId,
            isReady: bot.isReady(),
            isConnected: bot.isConnected
        }));
    }

    async startHealthCheck() {
        const healthCheckInterval = setInterval(async () => {
            if (!this.isRunning) {
                clearInterval(healthCheckInterval);
                return;
            }

            try {
                // Check Laravel API health
                const apiHealthy = await laravelApi.healthCheck();
                if (!apiHealthy) {
                    console.warn('Laravel API is not responding');
                }

                // Check bot health - only restart if bot is completely broken
                for (const [shopId, bot] of this.bots) {
                    if (!bot.isReady() && bot.client) {
                        console.warn(`Bot for shop ${shopId} is not ready, attempting restart...`);
                        try {
                            // Use the existing session ID instead of fetching from API
                            const existingSessionId = bot.sessionId;
                            if (existingSessionId) {
                                console.log(`🔄 Restarting bot for shop ${shopId} with existing session: ${existingSessionId}`);
                                
                                // Remove old bot instance
                                this.bots.delete(shopId);
                                
                                // Create new bot instance with existing session
                                const newBot = new WhatsAppBot(shopId, existingSessionId);
                                await newBot.initialize();
                                
                                // Store new bot instance
                                this.bots.set(shopId, newBot);
                                
                                console.log(`✅ Bot for shop ${shopId} restarted successfully`);
                            } else {
                                console.error(`❌ No session ID available for shop ${shopId}`);
                            }
                        } catch (error) {
                            console.error(`Failed to restart bot for shop ${shopId}:`, error.message);
                        }
                    }
                }
            } catch (error) {
                console.error('Health check error:', error.message);
            }
        }, 30000); // Check every 30 seconds
    }

    async loadActiveShops() {
        try {
            // This would typically fetch all active shops from Laravel API
            // For now, we'll return an empty array
            return [];
        } catch (error) {
            console.error('Error loading active shops:', error.message);
            return [];
        }
    }

    async autoStartBots() {
        try {
            const activeShops = await this.loadActiveShops();
            
            for (const shop of activeShops) {
                if (shop.status === 'active' && shop.isSubscriptionActive) {
                    await this.startBot(shop.id);
                }
            }

            console.log(`Auto-started ${activeShops.length} bots`);
        } catch (error) {
            console.error('Error auto-starting bots:', error.message);
        }
    }

    // 🆕 ADD GRACEFUL STOP METHOD
    async stopBotGracefully(shopId) {
        try {
            const bot = this.bots.get(shopId);
            if (!bot) {
                console.log(`No bot found for shop ${shopId}`);
                return;
            }

            // Just logout, don't destroy session
            if (bot.client && bot.isConnected) {
                await bot.client.logout();
                console.log(`Bot for shop ${shopId} logged out gracefully`);
            }
            
            this.bots.delete(shopId);
        } catch (error) {
            console.error(`Error stopping bot for shop ${shopId}:`, error.message);
        }
    }

    // 🆕 ADD AUTO-RESTART METHOD
    async autoRestartBots() {
        try {
            console.log('🔄 Auto-restarting existing bot sessions...');
            
            // Get all active shops with WhatsApp sessions from Laravel
            const activeShops = await laravelApi.getActiveShops();
            
            for (const shop of activeShops) {
                try {
                    // Check if shop has WhatsApp session data
                    if (shop.whatsapp_session && shop.whatsapp_session.session_id) {
                        console.log(`🔄 Auto-restarting bot for shop ${shop.id} with session: ${shop.whatsapp_session.session_id}`);
                        
                        // Clean up any existing bot instance
                        if (this.bots.has(shop.id)) {
                            console.log(`🧹 Cleaning up existing bot for shop ${shop.id}`);
                            this.bots.delete(shop.id);
                        }
                        
                        // Create bot instance with existing session
                        const bot = new WhatsAppBot(shop.id, shop.whatsapp_session.session_id);
                        
                        // Initialize bot (this will check for existing session)
                        await bot.initialize();

                        // Store bot instance
                        this.bots.set(shop.id, bot);

                        console.log(`✅ Bot for shop ${shop.id} auto-restarted successfully`);
                        
                        // 🆕 Wait a bit for session restoration
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                    } else {
                        console.log(`⚠️ Shop ${shop.id} has no valid WhatsApp session, skipping...`);
                    }
                } catch (error) {
                    console.error(`❌ Error auto-restarting bot for shop ${shop.id}:`, error.message);
                }
            }
            
            console.log(`✅ Auto-restart completed. Active bots: ${this.bots.size}`);
        } catch (error) {
            console.error('❌ Error in auto-restart:', error.message);
        }
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            totalBots: this.bots.size,
            activeBots: Array.from(this.bots.values()).filter(bot => bot.isReady()).length,
            bots: this.getAllBots()
        };
    }
}

module.exports = new BotManager(); 