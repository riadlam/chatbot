# 🚀 WhatsApp Bot Service Installation

## 📁 **Files Created:**

1. **`whatsapp-bot.service`** - Systemd service configuration
2. **`install-service.sh`** - Automatic installation script
3. **`SERVICE_INSTALLATION.md`** - This guide

## 🚀 **Quick Installation (Recommended):**

### **Option 1: Automatic Installation**
```bash
# Make script executable
chmod +x install-service.sh

# Run as root
sudo ./install-service.sh
```

### **Option 2: Manual Installation**
```bash
# Copy service file
sudo cp whatsapp-bot.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable whatsapp-bot
sudo systemctl start whatsapp-bot
```

## ✅ **After Installation:**

### **Check Service Status:**
```bash
sudo systemctl status whatsapp-bot
```

### **Test Bot Health:**
```bash
curl http://localhost:3000/health
```

## 🎯 **What This Gives You:**

- ✅ **Bot runs automatically** - No need to keep terminal open
- ✅ **Auto-restart** - If it crashes, it restarts automatically
- ✅ **Start on boot** - Works even after server reboots
- ✅ **Background service** - Runs independently of your SSH session

## 📋 **Service Management Commands:**

```bash
# Start the bot
sudo systemctl start whatsapp-bot

# Stop the bot
sudo systemctl stop whatsapp-bot

# Restart the bot
sudo systemctl restart whatsapp-bot

# Check status
sudo systemctl status whatsapp-bot

# View logs
sudo journalctl -u whatsapp-bot -f
```

## 🚨 **Important Notes:**

- **Don't run `node src/index.js` manually anymore**
- **Use the systemctl commands above instead**
- **The bot will keep running after you log out**
- **Service starts automatically when server boots**

## 🎉 **You're Done!**

After running the installation, your WhatsApp Bot will be running as a proper production service that:
- Starts automatically on boot
- Restarts if it crashes
- Runs in the background
- Doesn't depend on your SSH session

Run `sudo ./install-service.sh` and you're all set! 🚀
