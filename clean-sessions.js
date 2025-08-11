const fs = require('fs-extra');
const path = require('path');

async function cleanSessions() {
    console.log('🧹 Cleaning up old session directories...');
    
    const sessionsPath = path.join(__dirname, 'src', 'sessions');
    const qrPath = path.join(__dirname, 'src', 'qr-codes');
    
    try {
        // Check if sessions directory exists
        if (await fs.pathExists(sessionsPath)) {
            const sessions = await fs.readdir(sessionsPath);
            console.log(`Found ${sessions.length} session directories`);
            
            // Keep only the most recent session for each shop
            const shopSessions = {};
            
            for (const session of sessions) {
                if (session.startsWith('session-bot_')) {
                    const parts = session.split('_');
                    const shopId = parts[1];
                    const timestamp = parts[2];
                    
                    if (!shopSessions[shopId] || timestamp > shopSessions[shopId].timestamp) {
                        shopSessions[shopId] = { session, timestamp };
                    }
                }
            }
            
            // Remove old sessions
            for (const session of sessions) {
                if (session.startsWith('session-bot_')) {
                    const parts = session.split('_');
                    const shopId = parts[1];
                    const timestamp = parts[2];
                    
                    if (shopSessions[shopId] && shopSessions[shopId].session !== session) {
                        console.log(`🗑️ Removing old session: ${session}`);
                        await fs.remove(path.join(sessionsPath, session));
                    }
                }
            }
        }
        
        // Clean up QR codes
        if (await fs.pathExists(qrPath)) {
            const qrSessions = await fs.readdir(qrPath);
            console.log(`Found ${qrSessions.length} QR code directories`);
            
            // Keep only the most recent QR codes for each shop
            const shopQRCodes = {};
            
            for (const qrSession of qrSessions) {
                if (qrSession.startsWith('bot_')) {
                    const parts = qrSession.split('_');
                    const shopId = parts[1];
                    const timestamp = parts[2];
                    
                    if (!shopQRCodes[shopId] || timestamp > shopQRCodes[shopId].timestamp) {
                        shopQRCodes[shopId] = { qrSession, timestamp };
                    }
                }
            }
            
            // Remove old QR codes
            for (const qrSession of qrSessions) {
                if (qrSession.startsWith('bot_')) {
                    const parts = qrSession.split('_');
                    const shopId = parts[1];
                    const timestamp = parts[2];
                    
                    if (shopQRCodes[shopId] && shopQRCodes[shopId].qrSession !== qrSession) {
                        console.log(`🗑️ Removing old QR codes: ${qrSession}`);
                        await fs.remove(path.join(qrPath, qrSession));
                    }
                }
            }
        }
        
        console.log('✅ Session cleanup completed!');
        console.log('💡 Now restart your bot server to use clean sessions.');
        
    } catch (error) {
        console.error('❌ Error cleaning sessions:', error.message);
    }
}

cleanSessions(); 