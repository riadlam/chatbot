#!/bin/bash

echo "🚀 Rebuilding Frontend with Updated API Configuration..."

cd /home/soexplast/public_html/chatwp/frontend

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

echo "✅ Frontend rebuilt successfully!"
echo "🌐 Your app is now accessible at: https://app.soexplast.com"
echo "🤖 Bot API accessible at: https://chatbot.soexplast.com/health"
echo "🔧 Laravel API accessible at: https://api.soexplast.com"
