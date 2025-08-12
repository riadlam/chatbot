#!/bin/bash

echo "🚀 Installing WhatsApp Bot Service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

# Copy service file to systemd directory
echo "📁 Copying service file..."
cp whatsapp-bot.service /etc/systemd/system/

# Reload systemd
echo "🔄 Reloading systemd..."
systemctl daemon-reload

# Enable service
echo "✅ Enabling service..."
systemctl enable whatsapp-bot

# Start service
echo "🚀 Starting service..."
systemctl start whatsapp-bot

# Check status
echo "📊 Service status:"
systemctl status whatsapp-bot --no-pager

echo ""
echo "🎉 WhatsApp Bot Service installed successfully!"
echo ""
echo "📋 Useful commands:"
echo "  Start:   sudo systemctl start whatsapp-bot"
echo "  Stop:    sudo systemctl stop whatsapp-bot"
echo "  Restart: sudo systemctl restart whatsapp-bot"
echo "  Status:  sudo systemctl status whatsapp-bot"
echo "  Logs:    sudo journalctl -u whatsapp-bot -f"
echo ""
echo "✅ The bot will now start automatically on boot!"
