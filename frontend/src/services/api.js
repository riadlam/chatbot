import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'https://api.soexplast.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', {
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            password_confirmation: userData.confirmPassword,
        });
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user
    getUser: async () => {
        const response = await api.get('/auth/user');
        return response.data;
    },
};

// Shops API methods
export const shopsAPI = {
    // Get all shops for current user
    getAll: async () => {
        const response = await api.get('/shops');
        return response.data;
    },

    // Create new shop
    create: async (shopData) => {
        const response = await api.post('/shops', shopData);
        return response.data;
    },

    // Get shop by ID
    getById: async (id) => {
        const response = await api.get(`/shops/${id}`);
        return response.data;
    },

    // Update shop
    update: async (id, shopData) => {
        const response = await api.put(`/shops/${id}`, shopData);
        return response.data;
    },

    // Delete shop
    delete: async (id) => {
        const response = await api.delete(`/shops/${id}`);
        return response.data;
    },

    // Get shop QR code
    getQrCode: async (id) => {
        const response = await api.get(`/shops/${id}/qr-code`);
        return response.data;
    },

    // Get shop stats
    getStats: async (id) => {
        const response = await api.get(`/shops/${id}/stats`);
        return response.data;
    },
};

// Keywords API methods
export const keywordsAPI = {
    // Get all keywords for a shop (aggregated from all bots)
    getAll: async (shopId) => {
        // First get all bots for the shop
        const botsResponse = await api.get(`/shops/${shopId}/bots`);
        const bots = botsResponse.data.data || [];
        
        // Then get keywords for each bot
        const allKeywords = [];
        for (const bot of bots) {
            try {
                const keywordsResponse = await api.get(`/shops/${shopId}/bots/${bot.id}/keywords`);
                const botKeywords = keywordsResponse.data.data || [];
                
                // Add bot info to each keyword
                botKeywords.forEach(keyword => {
                    keyword.botId = bot.id;
                    keyword.botType = bot.bot_type;
                    keyword.botDescription = bot.description;
                });
                
                allKeywords.push(...botKeywords);
            } catch (error) {
                console.error(`Failed to fetch keywords for bot ${bot.id}:`, error);
            }
        }
        
        return { data: allKeywords };
    },

    // Create new keyword (add to specific bot)
    create: async (shopId, keywordData) => {
        const { bot_id, ...keywordPayload } = keywordData;
        const response = await api.post(`/shops/${shopId}/bots/${bot_id}/keywords`, keywordPayload);
        return response.data;
    },

    // Update keyword (through bot)
    update: async (shopId, keywordId, keywordData) => {
        // For now, we'll delete and recreate since the API doesn't have direct update
        const { bot_id, ...keywordPayload } = keywordData;
        
        // Delete the old keyword and message
        await api.delete(`/shops/${shopId}/bots/${bot_id}/keywords`, { 
            data: { message_id: keywordId } 
        });
        
        // Create the new keyword
        const response = await api.post(`/shops/${shopId}/bots/${bot_id}/keywords`, keywordPayload);
        return response.data;
    },

    // Delete keyword and its associated message (through bot)
    delete: async (shopId, keywordId, keywordData) => {
        const response = await api.delete(`/shops/${shopId}/bots/${keywordData.botId}/keywords`, { 
            data: { message_id: keywordData.id } 
        });
        return response.data;
    },

    // Get keywords for a specific bot
    getBotKeywords: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}/keywords`);
        return response.data;
    },
};

// Messages API methods
export const messagesAPI = {
    // Get all messages for a shop
    getAll: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/messages`);
        return response.data;
    },

    // Get conversations
    getConversations: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/conversations`);
        return response.data;
    },

    // Get specific conversation
    getConversation: async (shopId, whatsappNumber) => {
        const response = await api.get(`/shops/${shopId}/conversations/${whatsappNumber}`);
        return response.data;
    },

    // Get analytics
    getAnalytics: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/analytics`);
        return response.data;
    },
};

// WhatsApp API methods
export const whatsappAPI = {
    // Create session
    createSession: async (shopId) => {
        const response = await api.post(`/shops/${shopId}/whatsapp/sessions`);
        return response.data;
    },

    // Get session
    getSession: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/whatsapp/sessions`);
        return response.data;
    },

    // Update QR code
    updateQrCode: async (shopId, qrData) => {
        const response = await api.put(`/shops/${shopId}/whatsapp/qr-code`, qrData);
        return response.data;
    },

    // Update session status
    updateStatus: async (shopId, statusData) => {
        const response = await api.put(`/shops/${shopId}/whatsapp/status`, statusData);
        return response.data;
    },

    // Delete session
    deleteSession: async (shopId) => {
        const response = await api.delete(`/shops/${shopId}/whatsapp/sessions`);
        return response.data;
    },

    // Send message
    sendMessage: async (shopId, messageData) => {
        const response = await api.post(`/shops/${shopId}/whatsapp/send`, messageData);
        return response.data;
    },

    // Get bot status
    getStatus: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/whatsapp/status`);
        return response.data;
    },
};

// Bot API methods
export const botAPI = {
    // Get all bots for a shop
    getAll: async (shopId) => {
        const response = await api.get(`/shops/${shopId}/bots`);
        return response.data;
    },

    // Create new bot
    create: async (shopId, botData) => {
        const response = await api.post(`/shops/${shopId}/bots`, botData);
        return response.data;
    },

    // Get a specific bot
    getById: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}`);
        return response.data;
    },

    // Update a bot
    update: async (shopId, botId, botData) => {
        const response = await api.put(`/shops/${shopId}/bots/${botId}`, botData);
        return response.data;
    },

    // Delete a bot
    delete: async (shopId, botId) => {
        const response = await api.delete(`/shops/${shopId}/bots/${botId}`);
        return response.data;
    },

    // Add keyword to bot
    addKeyword: async (shopId, botId, keywordData) => {
        const response = await api.post(`/shops/${shopId}/bots/${botId}/keywords`, keywordData);
        return response.data;
    },

    // Update keyword and its associated message
    updateKeyword: async (shopId, botId, keywordId, keywordData) => {
        const response = await api.put(`/shops/${shopId}/bots/${botId}/keywords/${keywordId}`, keywordData);
        return response.data;
    },

    // Add keyword to specific message
    addKeywordToMessage: async (shopId, botId, messageId, keywordData) => {
        const response = await api.post(`/shops/${shopId}/bots/${botId}/messages/${messageId}/keywords`, keywordData);
        return response.data;
    },

    // Remove keyword from bot
    removeKeyword: async (shopId, botId, keywordData) => {
        const response = await api.delete(`/shops/${shopId}/bots/${botId}/keywords`, { data: keywordData });
        return response.data;
    },

    // Get bot keywords
    getKeywords: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}/keywords`);
        return response.data;
    },

    // Add message to bot
    addMessage: async (shopId, botId, messageData) => {
        const response = await api.post(`/shops/${shopId}/bots/${botId}/messages`, messageData);
        return response.data;
    },

    // Update bot message
    updateMessage: async (shopId, botId, messageData) => {
        const response = await api.put(`/shops/${shopId}/bots/${botId}/messages`, messageData);
        return response.data;
    },

    // Get bot messages
    getMessages: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}/messages`);
        return response.data;
    },

    // Toggle bot status
    toggleStatus: async (shopId, botId) => {
        const response = await api.post(`/shops/${shopId}/bots/${botId}/toggle-status`);
        return response.data;
    },

    // Get bot QR code
    getQrCode: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}/qr-code`);
        return response.data;
    },

    // Start bot and get QR code
    startBot: async (shopId, botId) => {
        const response = await api.post(`/shops/${shopId}/bots/${botId}/start`);
        return response.data;
    },

    // Get bot status
    getBotStatus: async (shopId, botId) => {
        const response = await api.get(`/shops/${shopId}/bots/${botId}/status`);
        return response.data;
    },
};

export default api; 