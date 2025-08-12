#!/bin/bash

echo "🚀 Starting WhatsApp Bot Production Services..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    kill $NODE_PID $LARAVEL_PID 2>/dev/null
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start Node.js Bot Server
echo "📱 Starting Node.js Bot Server..."
cd /home/soexplast/public_html/chatwp
node src/index.js &
NODE_PID=$!

# Wait a moment for Node.js to start
sleep 3

# Start Laravel API Server
echo "🔧 Starting Laravel API Server..."
cd /home/soexplast/public_html/chatwp/laravel-backend
php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

echo "✅ All services started!"
echo "📱 Bot Server: http://0.0.0.0:3000"
echo "🔧 Laravel API: http://0.0.0.0:8000"
echo "🌐 Frontend: https://chatbot.soexplast.com"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait
