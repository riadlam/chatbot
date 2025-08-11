// bots/bot.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const SESSION_PATH = path.join(__dirname, '../sessions');
const QR_PATH = path.join(__dirname, '../qr');

function createBot(clientId) {
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId,
            dataPath: SESSION_PATH
        })
    });

    client.on('qr', async qr => {
        const qrFile = path.join(QR_PATH, `${clientId}.png`);
        await qrcode.toFile(qrFile, qr);
        console.log(`[${clientId}] QR saved at ${qrFile}`);
    });

    client.on('ready', () => {
        console.log(`[${clientId}] WhatsApp bot is ready`);
    });

    client.on('message', async msg => {
        console.log(`[${clientId}] ${msg.from}: ${msg.body}`);
        msg.reply(`Hello from ${clientId}!`);
    });

    client.initialize();

    return client;
}

module.exports = createBot;
