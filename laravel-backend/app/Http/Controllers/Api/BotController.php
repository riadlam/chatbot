<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bot;
use App\Models\Shop;
use App\Models\Message;
use App\Models\BotMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BotController extends Controller
{
    /**
     * Get all bots for a shop
     */
    public function index(Shop $shop)
    {
        $bots = $shop->bots()->with(['whatsappSession', 'keywords'])->get();
        
        // Load all messages for each bot and add them to the response
        $bots->each(function ($bot) {
            $messages = BotMessage::where('bot_id', $bot->id)->get();
            $bot->setAttribute('messages', $messages);
            
            // Also add message data to each keyword for easier frontend processing
            $bot->keywords->each(function ($keyword) use ($messages) {
                $message = $messages->where('id', $keyword->message_id)->first();
                if ($message) {
                    $keyword->setAttribute('message_data', [
                        'id' => $message->id,
                        'type' => $message->type,
                        'message' => $message->message,
                        'duration' => $message->duration ?? 8
                    ]);
                }
            });
        });
        
        return response()->json([
            'success' => true,
            'data' => $bots
        ]);
    }

    /**
     * Create a new bot
     */
    public function store(Request $request, Shop $shop)
    {
        $validator = Validator::make($request->all(), [
            'bot_type' => 'required|string|in:customer-support,sales,marketing,general',
            'description' => 'nullable|string|max:1000',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $bot = $shop->bots()->create([
            'bot_type' => $request->bot_type,
            'description' => $request->description,
            'status' => $request->status ?? 'inactive'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bot created successfully',
            'data' => $bot
        ], 201);
    }

    /**
     * Get a specific bot
     */
    public function show(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $bot->load('whatsappSession')
        ]);
    }

    /**
     * Update a bot
     */
    public function update(Request $request, Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'bot_type' => 'sometimes|string|in:customer-support,sales,marketing,general',
            'description' => 'nullable|string|max:1000',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $bot->update($request->only(['bot_type', 'description', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Bot updated successfully',
            'data' => $bot
        ]);
    }

    /**
     * Delete a bot
     */
    public function destroy(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $bot->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bot deleted successfully'
        ]);
    }

    /**
     * Add keyword to bot
     */
    public function addKeyword(Request $request, Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        \Log::info('Keyword creation request received', [
            'request_data' => $request->all(),
            'duration_field' => $request->input('duration'),
            'has_duration' => $request->has('duration')
        ]);

        $validator = Validator::make($request->all(), [
            'keywords' => 'required|array|min:1',
            'keywords.*' => 'string|max:255',
            'message_type' => 'required|string|in:text,image,video,document',
            'message_text' => 'nullable|string|max:1000',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
            'is_contain' => 'boolean',
            'status' => 'nullable|string|in:active,inactive',
            'duration' => 'nullable|integer|min:8|max:15',
        ]);

        // Custom validation for image URLs
        $validator->after(function ($validator) use ($request) {
            if ($request->has('images') && is_array($request->images)) {
                foreach ($request->images as $index => $imageUrl) {
                    if ($imageUrl && !preg_match('#^(/storage/|https?://)#', $imageUrl)) {
                        $validator->errors()->add("images.{$index}", 'The image URL must be a valid storage path or HTTP/HTTPS URL.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            \Log::error('Validation failed for keyword creation', [
                'request_data' => $request->all(),
                'validation_errors' => $validator->errors()->toArray()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate based on message type
        if ($request->message_type === 'text' && empty($request->message_text)) {
            return response()->json([
                'success' => false,
                'message' => 'Message text must be provided for text messages'
            ], 422);
        }
        
        if ($request->message_type === 'image' && empty($request->images)) {
            return response()->json([
                'success' => false,
                'message' => 'At least one image must be provided for image messages'
            ], 422);
        }

        // Create message in the messages table first
        $messageData = [
            'type' => $request->message_type,
            'message' => '', // Will be set below
            'is_contain' => $request->input('is_contain', true), // Default to true if not provided
            'duration' => $request->input('duration', 8) // Default to 8 seconds if not provided
        ];

        // Set the message content based on type
        if ($request->message_type === 'text') {
            $messageData['message'] = $request->message_text;
        } elseif ($request->message_type === 'image') {
            // For image messages, store the additional text as the message
            $messageData['message'] = $request->message_text ?: 'Image message';
            // Store images as JSON in the images column
            $messageData['images'] = json_encode($request->images);
            
            \Log::info('Creating image message', [
                'message_text' => $request->message_text,
                'images' => $request->images,
                'images_json' => $messageData['images']
            ]);
        } else {
            // For other media types, store the additional text or a default message
            $messageData['message'] = $request->message_text ?: ucfirst($request->message_type) . ' message';
        }

        // Add the message to the messages table
        $message = $bot->addMessage($messageData);
        
        \Log::info('Message created with duration', [
            'message_id' => $message->id,
            'duration' => $message->duration,
            'message_data' => $messageData
        ]);

        // Add each keyword to the bot_keywords table
        foreach ($request->keywords as $keyword) {
            $bot->addKeyword($keyword, $message->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Keywords and response added successfully',
            'data' => [
                'bot' => $bot->fresh(),
                'message' => $message
            ]
        ]);
    }

    /**
     * Update keyword and its associated message
     */
    public function updateKeyword(Request $request, Shop $shop, Bot $bot, $keywordId)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        \Log::info('Keyword update request received', [
            'request_data' => $request->all(),
            'keyword_id' => $keywordId,
            'duration_field' => $request->input('duration'),
            'has_duration' => $request->has('duration')
        ]);

        $validator = Validator::make($request->all(), [
            'keywords' => 'required|array|min:1',
            'keywords.*' => 'string|max:255',
            'message_type' => 'required|string|in:text,image,video,document',
            'message_text' => 'nullable|string|max:1000',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
            'is_contain' => 'boolean',
            'status' => 'nullable|string|in:active,inactive',
            'duration' => 'nullable|integer|min:8|max:15',
        ]);

        // Custom validation for image URLs
        $validator->after(function ($validator) use ($request) {
            if ($request->has('images') && is_array($request->images)) {
                foreach ($request->images as $index => $imageUrl) {
                    if ($imageUrl && !preg_match('#^(/storage/|https?://)#', $imageUrl)) {
                        $validator->errors()->add("images.{$index}", 'The image URL must be a valid storage path or HTTP/HTTPS URL.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            \Log::error('Validation failed for keyword update', [
                'request_data' => $request->all(),
                'validation_errors' => $validator->errors()->toArray()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate based on message type
        if ($request->message_type === 'text' && empty($request->message_text)) {
            return response()->json([
                'success' => false,
                'message' => 'Message text must be provided for text messages'
            ], 422);
        }
        
        if ($request->message_type === 'image' && empty($request->images)) {
            return response()->json([
                'success' => false,
                'message' => 'At least one image must be provided for image messages'
            ], 422);
        }

        // Find the existing message
        $existingMessage = BotMessage::where('id', $keywordId)->where('bot_id', $bot->id)->first();
        if (!$existingMessage) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or does not belong to this bot'
            ], 404);
        }

        // Update message data
        $messageData = [
            'type' => $request->message_type,
            'message' => '', // Will be set below
            'is_contain' => $request->input('is_contain', true),
            'duration' => $request->input('duration', 8)
        ];

        // Set the message content based on type
        if ($request->message_type === 'text') {
            $messageData['message'] = $request->message_text;
        } elseif ($request->message_type === 'image') {
            $messageData['message'] = $request->message_text ?: 'Image message';
            $messageData['images'] = json_encode($request->images);
        } else {
            $messageData['message'] = $request->message_text ?: ucfirst($request->message_type) . ' message';
        }

        // Update the existing message
        $existingMessage->update($messageData);
        
        \Log::info('Message updated with duration', [
            'message_id' => $existingMessage->id,
            'duration' => $existingMessage->duration,
            'message_data' => $messageData
        ]);

        // Remove old keywords and add new ones
        $bot->keywords()->where('message_id', $keywordId)->delete();
        
        foreach ($request->keywords as $keyword) {
            $bot->addKeyword($keyword, $keywordId);
        }

        \Log::info('Keyword updated successfully', [
            'keyword_id' => $keywordId,
            'message_data' => $messageData
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Keyword and response updated successfully',
            'data' => [
                'bot' => $bot->fresh(),
                'message' => $existingMessage->fresh()
            ]
        ]);
    }

    /**
     * Add keyword to specific message
     */
    public function addKeywordToMessage(Request $request, Shop $shop, Bot $bot, $messageId)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'keyword' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if message exists and belongs to this bot
        $message = BotMessage::where('id', $messageId)->where('bot_id', $bot->id)->first();
        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        // Add keyword to the message
        $botKeyword = $bot->keywords()->create([
            'keyword' => $request->keyword,
            'message_id' => $messageId
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Keyword added to message successfully',
            'data' => $botKeyword
        ]);
    }

    /**
     * Remove keyword and its associated message from bot
     */
    public function removeKeyword(Request $request, Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'message_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete the message and all its associated keywords
        $result = $bot->removeKeywordAndMessage($request->message_id);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Keyword and message removed successfully',
                'data' => $bot->fresh()
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or does not belong to this bot'
            ], 404);
        }
    }

    /**
     * Get bot keywords with message data
     */
    public function getKeywords(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        // Get keywords with their associated messages
        $keywords = $bot->keywords()->with('message')->get();
        
        // Group keywords by message_id
        $keywordsByMessage = [];
        foreach ($keywords as $keyword) {
            $messageId = $keyword->message_id;
            if (!isset($keywordsByMessage[$messageId])) {
                $keywordsByMessage[$messageId] = [
                    'id' => $messageId,
                    'botId' => $bot->id,
                    'botType' => $bot->bot_type,
                    'botDescription' => $bot->description,
                    'keywords' => [],
                    'messageType' => $keyword->message->type ?? 'text',
                    'response' => '',
                    'status' => 'active',
                    'is_contain' => $keyword->message->is_contain ?? true,
                    'duration' => $keyword->message->duration ?? 8
                ];
                
                // Extract response from message data
                if ($keyword->message) {
                    // Since the message column is now text, get it directly
                    $keywordsByMessage[$messageId]['response'] = $keyword->message->message;
                }
            }
            $keywordsByMessage[$messageId]['keywords'][] = $keyword->keyword;
        }
        
        return response()->json([
            'success' => true,
            'data' => array_values($keywordsByMessage)
        ]);
    }

    /**
     * Get bot messages
     */
    public function getMessages(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $bot->getMessagesArray()
        ]);
    }

    /**
     * Add message to bot
     */
    public function addMessage(Request $request, Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:text,image,document,audio,video,location',
            'message' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $message = $bot->addMessage($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Message added successfully',
            'data' => $message
        ]);
    }

    /**
     * Update bot message
     */
    public function updateMessage(Request $request, Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:text,image,document,audio,video,location',
            'message' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $bot->updateMessage($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Message updated successfully',
            'data' => $bot->fresh()
        ]);
    }

    /**
     * Debug endpoint to see bot data structure
     */
    public function debug(Shop $shop)
    {
        $bots = $shop->bots()->with(['whatsappSession', 'keywords'])->get();
        
        // Load all messages for each bot and add them to the response
        $bots->each(function ($bot) {
            $messages = BotMessage::where('bot_id', $bot->id)->get();
            $bot->setAttribute('messages', $messages);
        });
        
        return response()->json([
            'success' => true,
            'data' => $bots->toArray()
        ]);
    }

    /**
     * Toggle bot status
     */
    public function toggleStatus(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $bot->update([
            'status' => $bot->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bot status updated successfully',
            'data' => $bot
        ]);
    }

    /**
     * Get bot QR code
     */
    public function getQrCode(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        $session = $bot->whatsappSession;
        
        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'No WhatsApp session found for this bot',
                'qr_code' => null,
                'status' => 'no_session'
            ]);
        }

        return response()->json([
            'success' => true,
            'qr_code' => $session->qr_code,
            'qr_code_path' => $session->qr_code_path,
            'status' => $session->status,
            'is_connected' => $session->isConnected(),
            'phone_number' => $session->phone_number
        ]);
    }

    /**
     * Start bot and generate QR code
     */
    public function startBot(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            \Log::warning("Bot start attempt failed: Bot {$bot->id} not found in shop {$shop->id}");
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        try {
            \Log::info("Starting bot {$bot->id} for shop {$shop->id}");

            // Check if bot already has an active session
            $existingSession = $bot->whatsappSession;
            if ($existingSession && $existingSession->is_active && $existingSession->status === 'connected') {
                \Log::info("Bot {$bot->id} already has active connected session: {$existingSession->session_id}");
                return response()->json([
                    'success' => true,
                    'message' => 'Bot is already running and connected',
                    'qr_code' => $existingSession->qr_code,
                    'qr_code_path' => $existingSession->qr_code_path,
                    'status' => $existingSession->status,
                    'is_connected' => $existingSession->isConnected(),
                    'phone_number' => $existingSession->phone_number
                ]);
            }
            
            // If there's an existing session but it's not connected, we should restart it
            if ($existingSession && $existingSession->is_active && $existingSession->status !== 'connected') {
                \Log::info("Bot {$bot->id} has existing session but not connected, will restart: {$existingSession->session_id}");
                // Delete the existing session to start fresh
                $existingSession->delete();
            }

            // Create new WhatsApp session for this bot
            $sessionId = 'bot_' . $bot->id . '_' . time();
            $session = $bot->whatsappSession()->create([
                'session_id' => $sessionId,
                'status' => 'connecting',
                'is_active' => true,
            ]);

            \Log::info("Created WhatsApp session {$sessionId} for bot {$bot->id}");

            // Update bot status to active
            $bot->update(['status' => 'active']);

            // Trigger Node.js bot to start
            try {
                \Log::info("🔗 [BOT_START] Attempting to connect to Node.js bot server", [
                    'bot_id' => $bot->id,
                    'shop_id' => $shop->id,
                    'session_id' => $sessionId,
                    'nodejs_url' => 'http://localhost:3000/api/bot/start'
                ]);
                
                $requestData = [
                    'shop_id' => $shop->id,
                    'bot_id' => $bot->id,
                    'session_id' => $sessionId
                ];
                
                \Log::info("📤 [BOT_START] Sending request to Node.js", [
                    'request_data' => $requestData,
                    'timeout' => 15
                ]);
                
                $response = \Http::timeout(15)->post('http://localhost:3000/api/bot/start', $requestData);
                
                \Log::info("📥 [BOT_START] Received response from Node.js", [
                    'status_code' => $response->status(),
                    'response_body' => $response->body(),
                    'successful' => $response->successful()
                ]);
                
                if ($response->successful()) {
                    \Log::info("✅ [BOT_START] Node.js bot start triggered successfully", [
                        'bot_id' => $bot->id,
                        'response' => $response->json()
                    ]);
                } else {
                    \Log::warning("⚠️ [BOT_START] Node.js bot start failed", [
                        'bot_id' => $bot->id,
                        'status_code' => $response->status(),
                        'error_body' => $response->body()
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error("❌ [BOT_START] Failed to trigger Node.js bot start", [
                    'bot_id' => $bot->id,
                    'error_message' => $e->getMessage(),
                    'error_code' => $e->getCode(),
                    'error_file' => $e->getFile(),
                    'error_line' => $e->getLine(),
                    'stack_trace' => $e->getTraceAsString()
                ]);
            }
            
            \Log::info("Bot {$bot->id} started successfully, session: {$sessionId}");
            
            return response()->json([
                'success' => true,
                'message' => 'Bot started successfully. QR code will be generated shortly.',
                'session_id' => $session->session_id,
                'status' => 'connecting',
                'qr_code' => null,
                'qr_code_path' => null
            ]);

        } catch (\Exception $e) {
            \Log::error("Failed to start bot {$bot->id}: " . $e->getMessage(), [
                'shop_id' => $shop->id,
                'bot_id' => $bot->id,
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to start bot: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get bot status
     */
    public function getBotStatus(Shop $shop, Bot $bot)
    {
        if ($bot->shop_id !== $shop->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bot not found'
            ], 404);
        }

        // Get the most recent active session for this shop
        $session = \App\Models\WhatsAppSession::where('shop_id', $shop->id)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->first();
        
        $status = [
            'bot_status' => $bot->status,
            'has_session' => $session !== null,
            'session_status' => $session?->status ?? 'no_session',
            'is_connected' => $session?->isConnected() ?? false,
            'phone_number' => $session?->phone_number,
            'last_activity' => $session?->last_activity,
            'qr_code_available' => !empty($session?->qr_code),
            'qr_code' => $session?->qr_code,
            'qr_code_path' => $session?->qr_code_path,
        ];

        return response()->json([
            'success' => true,
            'data' => $status
        ]);
    }
}
