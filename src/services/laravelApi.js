const axios = require('axios');
const config = require('../config/config');

class LaravelApiService {
    constructor() {
        this.api = axios.create({
            baseURL: config.laravel.baseUrl,
            timeout: config.laravel.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    }

    // Shop Management
    async getShop(shopId) {
        try {
            const response = await this.api.get(`/shops/${shopId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching shop ${shopId}:`, error.message);
            throw error;
        }
    }

    async getShopKeywords(shopId, retryCount = 3, retryDelay = 2000) {
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
                const response = await this.api.get(`/webhook/shop-keywords/${shopId}`, {
                    timeout: 30000, // 30 seconds timeout for keywords endpoint
                    headers: {
                        'X-Attempt': attempt,
                        'X-Retry-Attempts': retryCount
                    }
                });
                
                if (response.data && response.data.data) {
                    console.log(`✅ [KEYWORDS] Successfully fetched ${response.data.data.length} keywords for shop ${shopId}`);
                    return response.data.data;
                }
                
                console.warn(`⚠️ [KEYWORDS] No keywords data in response for shop ${shopId} (attempt ${attempt}/${retryCount})`);
                
            } catch (error) {
                const isLastAttempt = attempt === retryCount;
                const errorMsg = `❌ [KEYWORDS] Error fetching keywords for shop ${shopId} (attempt ${attempt}/${retryCount}): ${error.message}`;
                
                if (isLastAttempt) {
                    console.error(errorMsg);
                    console.error('Error details:', {
                        code: error.code,
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        url: error.config?.url
                    });
                } else {
                    console.warn(errorMsg);
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                    continue;
                }
            }
        }
        
        console.error(`❌ [KEYWORDS] Failed to fetch keywords for shop ${shopId} after ${retryCount} attempts`);
        return []; // Return empty array as fallback
    }

    // Session Management
    async createSession(shopId) {
        try {
            const response = await this.api.post(`/shops/${shopId}/whatsapp/sessions`);
            return response.data.session;
        } catch (error) {
            console.error(`Error creating session for shop ${shopId}:`, error.message);
            throw error;
        }
    }

    async updateQrCode(shopId, qrCode, qrCodePath = null) {
        try {
            const response = await this.api.post('/webhook/qr-code', {
                shop_id: shopId,
                qr_code: qrCode,
                qr_code_path: qrCodePath
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating QR code for shop ${shopId}:`, error.message);
            throw error;
        }
    }

    async updateSessionStatus(shopId, status, phoneNumber = null, errorMessage = null) {
        try {
            const response = await this.api.post('/webhook/session-status', {
                shop_id: shopId,
                status,
                phone_number: phoneNumber,
                error_message: errorMessage
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating session status for shop ${shopId}:`, error.message);
            throw error;
        }
    }

    // Message Management
    async storeMessage(messageData) {
        try {
            const response = await this.api.post('/webhook/message', messageData);
            return response.data;
        } catch (error) {
            console.error('Error storing message:', error.message);
            throw error;
        }
    }

    async getShopMessages(shopId, limit = 50) {
        try {
            const response = await this.api.get(`/shops/${shopId}/messages?per_page=${limit}`);
            return response.data.data || [];
        } catch (error) {
            console.error(`Error fetching messages for shop ${shopId}:`, error.message);
            return [];
        }
    }

    // Bot Status
    async getBotStatus(shopId) {
        try {
            const response = await this.api.get(`/shops/${shopId}/whatsapp/status`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching bot status for shop ${shopId}:`, error.message);
            return null;
        }
    }

    // Health Check
    async healthCheck() {
        try {
            const response = await this.api.get('/health');
            return response.data.status === 'ok';
        } catch (error) {
            console.error('Laravel API health check failed:', error.message);
            return false;
        }
    }

    // 🆕 ADD METHOD TO GET ACTIVE SHOPS
    async getActiveShops() {
        try {
            const response = await this.api.get('/webhook/active-shops');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching active shops:', error.message);
            return [];
        }
    }

    // 🆕 ADD METHOD TO RESET SESSION
    async resetSession(shopId) {
        try {
            const response = await this.api.post('/webhook/reset-session', {
                shop_id: shopId
            });
            return response.data;
        } catch (error) {
            console.error(`Error resetting session for shop ${shopId}:`, error.message);
            throw error;
        }
    }
}

module.exports = new LaravelApiService(); 