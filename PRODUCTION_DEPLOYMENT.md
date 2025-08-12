# 🚀 WhatsApp Bot Production Deployment Guide

## ✅ **What I've Fixed:**

1. **Updated `src/config/config.js`** - Changed server host from `localhost` to `0.0.0.0`
2. **Created `.env` file** - Production environment variables
3. **Updated `src/server.js`** - Fixed hardcoded localhost URLs
4. **Updated `laravel-backend/.env`** - Production Laravel settings
5. **Created `laravel-backend/config/cors.php`** - CORS configuration
6. **Created `start-production.sh`** - Production startup script

## 🔧 **Current Configuration:**

- **Bot Server**: Runs on `0.0.0.0:3000` (accessible from anywhere)
- **Laravel API**: Runs on `0.0.0.0:8000` (accessible from anywhere)
- **Frontend**: Points to `https://chatbot.soexplast.com`
- **API URLs**: All point to your production domain

## 🚀 **How to Start Production Services:**

### **Option 1: Use the Startup Script (Recommended)**
```bash
cd /home/soexplast/public_html/chatwp
./start-production.sh
```

### **Option 2: Manual Start**
```bash
# Terminal 1: Start Node.js Bot
cd /home/soexplast/public_html/chatwp
node src/index.js

# Terminal 2: Start Laravel API
cd /home/soexplast/public_html/chatwp/laravel-backend
php artisan serve --host=0.0.0.0 --port=8000
```

## 🎯 **Expected Output:**

### **Node.js Bot Server:**
```
Starting WhatsApp Bot Application...
✅ Laravel API connection established
Starting WhatsApp Bot Manager...
🔄 Auto-restarting existing bot sessions...
✅ Auto-restart completed. Active bots: 0
Bot manager started successfully
🚀 WhatsApp Bot Server running on http://0.0.0.0:3000
📊 Health check available at http://0.0.0.0:3000/health
```

### **Laravel API Server:**
```
Starting Laravel development server...
```

## 🔍 **Test Your Deployment:**

### **Test 1: Bot Server Health**
```bash
curl http://localhost:3000/health
```

### **Test 2: Laravel API Health**
```bash
curl http://localhost:8000/api/health
```

### **Test 3: Frontend Access**
Visit: `https://chatbot.soexplast.com`

## 📋 **What Each Service Does:**

- **Node.js Bot Server (Port 3000)**: Handles WhatsApp connections and bot logic
- **Laravel API (Port 8000)**: Manages database, users, and provides API endpoints
- **Frontend (Port 80/443)**: User interface for managing bots

## ⚠️ **Important Notes:**

1. **Keep both services running** - Don't close the terminals
2. **Use `0.0.0.0`** - This allows external connections (not just localhost)
3. **Production mode** - Debug is disabled, errors are hidden from users
4. **CORS enabled** - Frontend can communicate with API

## 🛠️ **Troubleshooting:**

### **If Bot can't connect to Laravel:**
- Make sure Laravel API is running on port 8000
- Check if port 8000 is accessible: `netstat -tlnp | grep 8000`

### **If Frontend can't connect to API:**
- Check CORS configuration in `laravel-backend/config/cors.php`
- Verify API is running and accessible

### **If services won't start:**
- Check if ports are already in use: `netstat -tlnp | grep :3000`
- Kill existing processes: `pkill -f "node src/index.js"`

## 🎉 **You're Ready!**

Your WhatsApp Bot is now configured for production with:
- ✅ No more localhost URLs
- ✅ Proper production environment
- ✅ CORS configuration
- ✅ Startup script
- ✅ All services pointing to your domain

Run `./start-production.sh` and your bot will be live! 🚀
