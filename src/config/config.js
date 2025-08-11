require('dotenv').config();

module.exports = {
    // Laravel API Configuration
    laravel: {
        baseUrl: process.env.LARAVEL_API_URL || 'http://localhost:8000/api',
        timeout: 10000,
    },

    // WhatsApp Bot Configuration
    whatsapp: {
        sessionPath: process.env.SESSION_PATH || './sessions',
        qrPath: process.env.QR_PATH || './qr',
        puppeteer: {
            headless: process.env.PUPPETEER_HEADLESS !== 'false',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        }
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || './logs/bot.log',
    },

    // Bot Behavior Configuration
    bot: {
        maxRetries: 3,
        retryDelay: 5000,
        messageQueueDelay: 1000,
    }
}; 