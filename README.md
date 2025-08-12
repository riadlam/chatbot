# 🚀 SaaS WhatsApp Bot Platform

A complete SaaS platform for managing multiple WhatsApp bots with Laravel backend and Node.js bot engine.

## 📋 Features

- **Multi-tenant Architecture**: Support for multiple shops/businesses
- **Keyword-based Auto-Responses**: Configure custom keywords and responses
- **Message History**: Complete conversation tracking and analytics
- **QR Code Management**: Automatic QR code generation and storage
- **Real-time Status**: Monitor bot connection status
- **RESTful API**: Full Laravel API for frontend integration
- **Scalable Design**: Handle multiple bot instances simultaneously

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Laravel API   │    │  Node.js Bots   │
│   (Vue/React)   │◄──►│   (Backend)     │◄──►│   (Bot Engine)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   MySQL DB      │
                       │   (Data Store)  │
                       └─────────────────┘
```

## 📁 Project Structure

```
whatsapp-bot/
├── laravel-backend/          # Laravel API Backend
│   ├── app/
│   │   ├── Models/           # Database models
│   │   └── Http/Controllers/ # API controllers
│   ├── database/migrations/  # Database migrations
│   └── routes/api.php        # API routes
├── src/                      # Node.js Bot Engine
│   ├── config/              # Configuration files
│   ├── services/            # Core services
│   ├── controllers/         # Bot management
│   └── index.js             # Main application
├── sessions/                # WhatsApp sessions
├── qr/                      # QR code images
└── package.json             # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- PHP 8.1+
- MySQL 8.0+
- Composer
- npm

### 1. Laravel Backend Setup

```bash
cd laravel-backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=whatsapp_bot
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start Laravel server
php artisan serve
```

### 2. Node.js Bot Engine Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "LARAVEL_API_URL=https://chatbot.soexplast.com/api" > .env

# Start the bot engine
npm start
```

### 3. Test the Setup

```bash
# Check Laravel API health
curl https://chatbot.soexplast.com/api/shops

# Check Node.js bot health
curl http://localhost:3000/health
```

## 📊 API Endpoints

### Shops Management
- `GET /api/shops` - List all shops
- `POST /api/shops` - Create new shop
- `GET /api/shops/{id}` - Get shop details
- `PUT /api/shops/{id}` - Update shop
- `DELETE /api/shops/{id}` - Delete shop

### Keywords Management
- `GET /api/shops/{id}/keywords` - List shop keywords
- `POST /api/shops/{id}/keywords` - Create keyword
- `PUT /api/shops/{id}/keywords/{keywordId}` - Update keyword
- `DELETE /api/shops/{id}/keywords/{keywordId}` - Delete keyword

### Messages & Analytics
- `GET /api/shops/{id}/messages` - Get messages
- `GET /api/shops/{id}/conversations` - Get conversations
- `GET /api/shops/{id}/analytics` - Get analytics

### WhatsApp Bot Control
- `POST /api/shops/{id}/whatsapp/sessions` - Create session
- `GET /api/shops/{id}/whatsapp/status` - Get bot status
- `POST /api/shops/{id}/whatsapp/send` - Send message

### Node.js Bot Engine
- `GET /health` - Health check
- `POST /bots/{shopId}/start` - Start bot
- `POST /bots/{shopId}/stop` - Stop bot
- `GET /bots/status` - Get all bots status

## 🔧 Configuration

### Environment Variables

```env
# Laravel API
LARAVEL_API_URL=https://chatbot.soexplast.com/api

# Server
PORT=3000
HOST=localhost

# WhatsApp Bot
SESSION_PATH=./sessions
QR_PATH=./qr
PUPPETEER_HEADLESS=true

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/bot.log
```

## 📝 Usage Examples

### 1. Create a Shop

```bash
curl -X POST https://chatbot.soexplast.com/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Store",
    "description": "Online retail store",
    "email": "store@example.com"
  }'
```

### 2. Add Keywords

```bash
curl -X POST https://chatbot.soexplast.com/api/shops/1/keywords \
  -H "Content-Type: application/json" \
  -d '{
    "trigger_word": "hello",
    "response_message": "Hi! Welcome to our store. How can I help you?",
    "priority": 10,
    "exact_match": false
  }'
```

### 3. Start Bot

```bash
curl -X POST http://localhost:3000/bots/1/start
```

### 4. Check Bot Status

```bash
curl http://localhost:3000/bots/status
```

## 🗄️ Database Schema

### Shops Table
- `id` - Primary key
- `name` - Shop name
- `slug` - URL-friendly name
- `description` - Shop description
- `status` - active/inactive/pending
- `settings` - JSON configuration

### Keywords Table
- `id` - Primary key
- `shop_id` - Foreign key to shops
- `trigger_word` - Keyword to match
- `response_message` - Auto-response
- `priority` - Matching priority
- `exact_match` - Exact or contains match

### Messages Table
- `id` - Primary key
- `shop_id` - Foreign key to shops
- `whatsapp_number` - Customer number
- `message_content` - Message text
- `direction` - inbound/outbound
- `is_bot_response` - Bot or human response

### WhatsApp Sessions Table
- `id` - Primary key
- `shop_id` - Foreign key to shops
- `session_id` - Unique session identifier
- `status` - connecting/connected/disconnected/error
- `qr_code` - QR code data
- `phone_number` - Connected WhatsApp number

## 🔒 Security Features

- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention
- Rate limiting (can be added)

## 📈 Monitoring & Analytics

- Real-time bot status
- Message analytics
- Conversation tracking
- Error logging
- Health checks

## 🚀 Deployment

### Production Setup

1. **Laravel Backend**
   ```bash
   # Set production environment
   APP_ENV=production
   APP_DEBUG=false
   
   # Optimize for production
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Node.js Bot Engine**
   ```bash
   # Use PM2 for process management
   npm install -g pm2
   pm2 start src/index.js --name whatsapp-bot
   pm2 startup
   pm2 save
   ```

3. **Database**
   - Use production MySQL/PostgreSQL
   - Set up regular backups
   - Configure connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ using Laravel, Node.js, and WhatsApp Web.js** 