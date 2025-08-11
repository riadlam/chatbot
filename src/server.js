const express = require('express');
const cors = require('cors');
const BotStarter = require('./bot-starter.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize bot starter
const botStarter = new BotStarter();

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Check Laravel API connection
        const laravelApi = require('./services/laravelApi');
        const apiHealth = await laravelApi.healthCheck();
        
        res.json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            laravel_api: apiHealth ? 'connected' : 'disconnected',
            bot_manager: {
                isRunning: true,
                totalBots: 0,
                activeBots: botStarter.activeBots.size,
                bots: []
            }
        });
    } catch (error) {
        res.json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            laravel_api: 'disconnected',
            bot_manager: {
                isRunning: true,
                totalBots: 0,
                activeBots: botStarter.activeBots.size,
                bots: []
            }
        });
    }
});

// Bot start endpoint (called by Laravel)
app.post('/api/bot/start', async (req, res) => {
    const requestId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
        const { shop_id, bot_id, session_id } = req.body;
        
        console.log(`🔗 [${requestId}] [BOT_START] Received request from Laravel`, {
            shop_id,
            bot_id,
            session_id,
            request_body: req.body,
            headers: req.headers
        });
        
        if (!shop_id || !bot_id) {
            console.log(`❌ [${requestId}] [BOT_START] Missing required parameters`, {
                shop_id: !!shop_id,
                bot_id: !!bot_id,
                received_data: req.body
            });
            
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: shop_id and bot_id',
                received_data: req.body
            });
        }
        
        console.log(`🚀 [${requestId}] [BOT_START] Starting bot via BotStarter`, {
            shop_id,
            bot_id,
            session_id
        });
        
        // Start the bot
        const result = await botStarter.startBot(shop_id, bot_id);
        
        console.log(`📊 [${requestId}] [BOT_START] BotStarter result`, {
            success: result.success,
            sessionId: result.sessionId,
            alreadyRunning: result.alreadyRunning,
            error: result.error || null,
            full_result: result
        });
        
        const response = {
            success: result.success,
            message: result.success ? 'Bot started successfully' : result.error,
            session_id: result.sessionId,
            alreadyRunning: result.alreadyRunning || false
        };
        
        console.log(`✅ [${requestId}] [BOT_START] Sending response to Laravel`, response);
        
        res.json(response);
        
    } catch (error) {
        console.error(`❌ [${requestId}] [BOT_START] Error starting bot`, {
            error_message: error.message,
            error_stack: error.stack,
            request_body: req.body
        });
        
        res.status(500).json({
            success: false,
            message: 'Failed to start bot: ' + error.message,
            error_details: {
                message: error.message,
                stack: error.stack
            }
        });
    }
});

// Bot status endpoint
app.get('/api/bot/status/:botId', (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const status = botStarter.getBotStatus(botId);
        
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error getting bot status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get bot status: ' + error.message
        });
    }
});

// Stop bot endpoint
app.post('/api/bot/stop/:botId', async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        await botStarter.stopBot(botId);
        
        res.json({
            success: true,
            message: 'Bot stopped successfully'
        });
    } catch (error) {
        console.error('Error stopping bot:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to stop bot: ' + error.message
        });
    }
});

// Stop all bots endpoint
app.post('/api/bot/stop-all', async (req, res) => {
    try {
        await botStarter.stopAllBots();
        
        res.json({
            success: true,
            message: 'All bots stopped successfully'
        });
    } catch (error) {
        console.error('Error stopping all bots:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to stop all bots: ' + error.message
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await botStarter.stopAllBots();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down server...');
    await botStarter.stopAllBots();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Bot Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Bot start endpoint: http://localhost:${PORT}/api/bot/start`);
});

module.exports = app; 