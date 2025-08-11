const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const botManager = require('./controllers/botManager');
const laravelApi = require('./services/laravelApi');

class WhatsAppBotApp {
    constructor() {
        this.app = express();
        this.server = null;
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet());
        
        // CORS middleware
        this.app.use(cors());
        
        // Logging middleware
        this.app.use(morgan('combined'));
        
        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', async (req, res) => {
            try {
                const apiHealth = await laravelApi.healthCheck();
                const botStatus = botManager.getStatus();
                
                res.json({
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    laravel_api: apiHealth ? 'connected' : 'disconnected',
                    bot_manager: botStatus
                });
            } catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error.message
                });
            }
        });

        // Bot management endpoints
        this.app.post('/bots/:shopId/start', async (req, res) => {
            try {
                const { shopId } = req.params;
                await botManager.startBot(parseInt(shopId));
                res.json({ message: `Bot for shop ${shopId} started successfully` });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // API endpoint for Laravel (compatibility)
        this.app.post('/api/bot/start', async (req, res) => {
            try {
                const { shop_id, bot_id, session_id } = req.body;
                
                if (!shop_id || !bot_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Missing required parameters: shop_id and bot_id'
                    });
                }
                
                // Use bot-starter directly instead of bot manager
                const BotStarter = require('./bot-starter.js');
                const botStarter = new BotStarter();
                
                const result = await botStarter.startBot(shop_id, bot_id);
                
                res.json({
                    success: result.success,
                    message: result.success ? 'Bot started successfully' : result.error,
                    session_id: result.sessionId || session_id
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to start bot: ' + error.message
                });
            }
        });

        this.app.post('/bots/:shopId/stop', async (req, res) => {
            try {
                const { shopId } = req.params;
                await botManager.stopBot(parseInt(shopId));
                res.json({ message: `Bot for shop ${shopId} stopped successfully` });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/bots/:shopId/restart', async (req, res) => {
            try {
                const { shopId } = req.params;
                await botManager.restartBot(parseInt(shopId));
                res.json({ message: `Bot for shop ${shopId} restarted successfully` });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/bots/status', (req, res) => {
            res.json(botManager.getStatus());
        });

        // Manual message sending endpoint
        this.app.post('/bots/:shopId/send', async (req, res) => {
            try {
                const { shopId } = req.params;
                const { whatsapp_number, message, message_type = 'text' } = req.body;

                if (!whatsapp_number || !message) {
                    return res.status(400).json({ error: 'whatsapp_number and message are required' });
                }

                const bot = botManager.getBot(parseInt(shopId));
                if (!bot || !bot.isReady()) {
                    return res.status(400).json({ error: 'Bot is not ready' });
                }

                // Send message using WhatsApp client
                const chat = await bot.client.getChatById(whatsapp_number);
                await chat.sendMessage(message);

                res.json({ message: 'Message sent successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error('Unhandled error:', err);
            res.status(500).json({ error: 'Internal server error' });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Endpoint not found' });
        });
    }

    async start() {
        try {
            console.log('Starting WhatsApp Bot Application...');

            // Check Laravel API connection
            const apiHealthy = await laravelApi.healthCheck();
            if (!apiHealthy) {
                console.warn('Warning: Laravel API is not accessible');
            } else {
                console.log('Laravel API connection established');
            }

            // Start bot manager
            await botManager.start();

            // Start Express server
            this.server = this.app.listen(config.server.port, config.server.host, () => {
                console.log(`🚀 WhatsApp Bot Server running on http://${config.server.host}:${config.server.port}`);
                console.log(`📊 Health check available at http://${config.server.host}:${config.server.port}/health`);
            });

            // Graceful shutdown handling
            this.setupGracefulShutdown();

        } catch (error) {
            console.error('Failed to start application:', error);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            
            try {
                // Stop bot manager gracefully (preserves sessions)
                await botManager.stop();
                
                // Close server
                if (this.server) {
                    this.server.close(() => {
                        console.log('HTTP server closed');
                        process.exit(0);
                    });
                } else {
                    process.exit(0);
                }
            } catch (error) {
                console.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }

    async stop() {
        try {
            await botManager.stop();
            
            if (this.server) {
                this.server.close();
            }
            
            console.log('Application stopped');
        } catch (error) {
            console.error('Error stopping application:', error);
        }
    }
}

// Start the application
const app = new WhatsAppBotApp();
app.start().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
}); 