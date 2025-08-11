// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create the bot client
const client = new Client({
  authStrategy: new LocalAuth(), // Will save session under /.wwebjs_auth/
});

// Show QR on terminal
client.on('qr', (qr) => {
  console.log('Scan this QR with your WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Confirm ready
client.on('ready', () => {
  console.log('✅ Bot is ready!');
});

// Reply to any message
client.on('message', (message) => {
  console.log(`Message from ${message.from}: ${message.body}`);
  message.reply('👋 Hello from my dummy bot!');
});

// Start the bot
client.initialize();
