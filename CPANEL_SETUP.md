# 🚀 cPanel Setup Guide for WhatsApp Bot

## ✅ **What We've Done:**

1. **Created `.htaccess` file** - Handles proxy routing
2. **Apache is already running** - No need for Nginx
3. **Bot service is running** - WhatsApp Bot is active

## 🎯 **Next Steps in cPanel:**

### **Step 1: Point Your Domain**
1. **Go to cPanel → Domains**
2. **Find `chatbot.soexplast.com`**
3. **Set Document Root to**: `/home/soexplast/public_html/chatwp/frontend/dist`
4. **Save the changes**

### **Step 2: Verify .htaccess**
The `.htaccess` file is already created in your frontend/dist folder.

### **Step 3: Test Your Setup**

```bash
# Test frontend
curl http://chatbot.soexplast.com

# Test bot health
curl http://chatbot.soexplast.com/health

# Test bot API
curl http://chatbot.soexplast.com/bot/health

# Test Laravel API
curl http://chatbot.soexplast.com/api/health
```

## 🔧 **How .htaccess Works:**

- **`/health`** → Proxies to `http://localhost:3000/health` (Your WhatsApp Bot)
- **`/bot/*`** → Proxies to `http://localhost:3000/*` (Bot API endpoints)
- **`/api/*`** → Proxies to `http://localhost:8000/api/*` (Laravel API)
- **`/*`** → Serves your Vue.js frontend files

## 🎯 **Expected Result:**

After cPanel setup:
- ✅ **`https://chatbot.soexplast.com`** → Your WhatsApp Bot dashboard
- ✅ **`https://chatbot.soexplast.com/health`** → Bot health status
- ✅ **`https://chatbot.soexplast.com/bot/*`** → Bot API endpoints
- ✅ **`https://chatbot.soexplast.com/api/*`** → Laravel API

## 🚨 **Important Notes:**

1. **Don't restart Apache** - cPanel manages it
2. **Keep your bot service running** - `sudo systemctl status whatsapp-bot`
3. **Frontend must be built** - Make sure `npm run build` was run
4. **Wait a few minutes** - DNS changes can take time

## 📋 **Troubleshooting:**

### **If .htaccess doesn't work:**
```bash
# Check if mod_rewrite is enabled
sudo httpd -M | grep rewrite

# Check Apache error logs
sudo tail -f /var/log/httpd/error_log
```

### **If domain doesn't work:**
- Check cPanel domain settings
- Verify document root path
- Wait for DNS propagation

## 🎉 **You're Almost There!**

Once you set the document root in cPanel:
- Your domain will serve the frontend
- .htaccess will proxy API calls to your services
- Everything will work through `https://chatbot.soexplast.com`

## ❓ **Questions:**

1. **Did you find the Domains section in cPanel?**
2. **What path did you set for the document root?**
3. **Any errors when saving the domain settings?**

Let me know what happens in cPanel! 🚀
