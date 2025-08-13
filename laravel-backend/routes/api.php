<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Shop;
use App\Models\Bot;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\BotController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\WhatsAppController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Image upload route
    Route::post('/upload-image', [ImageUploadController::class, 'upload']);
    
    // Shop routes
    Route::apiResource('shops', ShopController::class);
    Route::get('shops/{shop}/qr-code', [ShopController::class, 'getQrCode']);
    Route::get('shops/{shop}/stats', [ShopController::class, 'getStats']);

    // Bot routes (nested under shops)
    Route::apiResource('shops.bots', BotController::class);
    Route::post('shops/{shop}/bots/{bot}/keywords', [BotController::class, 'addKeyword']);
    Route::put('shops/{shop}/bots/{bot}/keywords/{keywordId}', [BotController::class, 'updateKeyword']);
    Route::delete('shops/{shop}/bots/{bot}/keywords', [BotController::class, 'removeKeyword']);
    Route::get('shops/{shop}/bots/{bot}/keywords', [BotController::class, 'getKeywords']);
    Route::post('shops/{shop}/bots/{bot}/messages', [BotController::class, 'addMessage']);
    Route::put('shops/{shop}/bots/{bot}/messages', [BotController::class, 'updateMessage']);
    Route::get('shops/{shop}/bots/{bot}/messages', [BotController::class, 'getMessages']);
    Route::post('shops/{shop}/bots/{bot}/messages/{messageId}/keywords', [BotController::class, 'addKeywordToMessage']);
    Route::post('shops/{shop}/bots/{bot}/toggle-status', [BotController::class, 'toggleStatus']);
    Route::get('shops/{shop}/bots/{bot}/qr-code', [BotController::class, 'getQrCode']);
    Route::post('shops/{shop}/bots/{bot}/start', [BotController::class, 'startBot']);
    Route::get('shops/{shop}/bots/{bot}/status', [BotController::class, 'getBotStatus']);

    // Debug endpoint
    Route::get('shops/{shop}/bots/debug', [BotController::class, 'debug']);

    // WhatsApp bot routes (nested under shops)
    Route::prefix('shops/{shop}/whatsapp')->group(function () {
        Route::post('sessions', [WhatsAppController::class, 'createSession']);
        Route::get('sessions', [WhatsAppController::class, 'getSession']);
        Route::put('qr-code', [WhatsAppController::class, 'updateQrCode']);
        Route::put('status', [WhatsAppController::class, 'updateSessionStatus']);
        Route::delete('sessions', [WhatsAppController::class, 'deleteSession']);
        Route::post('send', [WhatsAppController::class, 'sendMessage']);
        Route::get('status', [WhatsAppController::class, 'getBotStatus']);
    });
});

// Image serving route (NO AUTHENTICATION)
Route::get('images/{filename}', function ($filename) {
    $path = storage_path('app/public/images/' . $filename);
    
    if (!file_exists($path)) {
        abort(404, 'Image not found');
    }
    
    return response()->file($path);
});

// Document serving route (NO AUTHENTICATION)
Route::get('documents/{filename}', function ($filename) {
    $path = storage_path('app/public/documents/' . $filename);
    
    if (!file_exists($path)) {
        abort(404, 'Document not found');
    }
    
    return response()->file($path);
});

// Webhook endpoints (NO AUTHENTICATION - called by Node.js bot server)
Route::post('webhook/message', function (Request $request) {
    // This endpoint will receive messages from the Node.js bot
    $validated = $request->validate([
        'shop_id' => 'required|exists:shops,id',
        'whatsapp_number' => 'required|string',
        'customer_name' => 'nullable|string',
        'message_content' => 'required', // Can be string or array
        'direction' => 'required|in:inbound,outbound',
        'message_type' => 'required|in:text,image,document,audio,video,location',
        'media_url' => 'nullable|string',
        'message_id' => 'nullable|string',
        'is_bot_response' => 'boolean',
        'metadata' => 'nullable|json',
        'keyword_id' => 'nullable|exists:bot_keywords,id',
    ]);

    // Prepare the message data
    $messageData = [
        'shop_id' => $validated['shop_id'],
        'whatsapp_number' => $validated['whatsapp_number'],
        'customer_name' => $validated['customer_name'] ?? null,
        'message_type' => $validated['message_type'],
        'direction' => $validated['direction'],
        'media_url' => $validated['media_url'] ?? null,
        'message_id' => $validated['message_id'] ?? null,
        'is_bot_response' => $validated['is_bot_response'] ?? false,
        'keyword_id' => $validated['keyword_id'] ?? null,
    ];

    // Handle message content (can be string or array)
    if (is_array($validated['message_content'])) {
        // If it's an array, extract text and store metadata
        if (isset($validated['message_content']['text'])) {
            $messageData['message'] = $validated['message_content']['text'];
            // Store the rest as metadata
            $metadata = $validated['message_content'];
            unset($metadata['text']);
            if (!empty($metadata)) {
                $messageData['metadata'] = $metadata;
            }
        } else {
            // If no text key, store as JSON
            $messageData['message'] = json_encode($validated['message_content']);
        }
    } else {
        // It's already a string
        $messageData['message'] = $validated['message_content'];
    }

    // Create the message
    $shop = Shop::findOrFail($validated['shop_id']);
    $message = $shop->messages()->create($messageData);

    return response()->json([
        'success' => true,
        'message' => 'Message stored successfully',
        'data' => $message
    ]);
});

// Webhook endpoint to get bot keywords (NO AUTHENTICATION)
Route::get('webhook/bot-keywords/{botId}', function ($botId) {
    try {
        $bot = Bot::findOrFail($botId);
        
        // Get all keywords for this bot with their associated messages
        $keywords = $bot->keywords()->with('message')->get();
        
        // Debug: Log the raw data
        \Log::info("🔍 [WEBHOOK_KEYWORDS] Raw keyword data for bot {$botId}", [
            'keywords_count' => $keywords->count(),
            'sample_keyword' => $keywords->first() ? [
                'id' => $keywords->first()->id,
                'keyword' => $keywords->first()->keyword,
                'message_id' => $keywords->first()->message_id,
                'message_raw' => $keywords->first()->message,
                'message_type' => $keywords->first()->message->type ?? 'NOT_SET',
                'images_raw' => $keywords->first()->message->images ?? 'NOT_SET',
                'images_decoded' => $keywords->first()->message->getImages() ?? 'NOT_SET'
            ] : 'NO_KEYWORDS'
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $keywords->map(function ($keyword) {
                return [
                    'id' => $keyword->id,
                    'trigger_word' => $keyword->keyword, // Map keyword to trigger_word for compatibility
                    'keyword' => $keyword->keyword,
                    'message_id' => $keyword->message_id,
                    'response_message' => $keyword->message->message ?? 'Thank you for your message!',
                    'message_type' => $keyword->message->type ?? 'text',
                    'is_contain' => $keyword->message->is_contain ?? true,
                    'images' => $keyword->message->getImages() ?? [],
                    'duration' => $keyword->message->duration ?? 8, // Include duration field with default
                    'message' => $keyword->message
                ];
            })
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Bot not found or error occurred',
            'error' => $e->getMessage()
        ], 404);
    }
});

// Webhook endpoint to get bot messages (NO AUTHENTICATION)
Route::get('webhook/bot-messages/{botId}', function ($botId) {
    try {
        $bot = Bot::findOrFail($botId);
        
        // Get all messages for this bot
        $messages = $bot->messages()->get();
        
        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Bot not found or error occurred',
            'error' => $e->getMessage()
        ], 404);
    }
});

// Webhook endpoint for session creation
Route::post('webhook/create-session', function (Request $request) {
    try {
        \Log::info("📥 [WEBHOOK_CREATE_SESSION] Session creation webhook received", [
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'bot_id' => 'required|exists:bots,id',
            'session_id' => 'required|string|min:10',
            'status' => 'required|in:connecting,connected,disconnected,error',
        ]);

        \Log::info("✅ [WEBHOOK_CREATE_SESSION] Validation passed", [
            'shop_id' => $validated['shop_id'],
            'bot_id' => $validated['bot_id'],
            'session_id' => $validated['session_id'],
            'status' => $validated['status']
        ]);

        // Check if session already exists
        $existingSession = \App\Models\WhatsAppSession::where('shop_id', $validated['shop_id'])->first();
        
        if ($existingSession) {
            \Log::info("🔍 [WEBHOOK_CREATE_SESSION] Updating existing session", [
                'existing_session_id' => $existingSession->session_id,
                'new_session_id' => $validated['session_id']
            ]);
            
            $existingSession->update([
                'session_id' => $validated['session_id'],
                'status' => $validated['status'],
                'is_active' => true,
                'last_activity' => now()
            ]);
            
            $session = $existingSession;
        } else {
            \Log::info("🆕 [WEBHOOK_CREATE_SESSION] Creating new session");
            
            $session = \App\Models\WhatsAppSession::create([
                'shop_id' => $validated['shop_id'],
                'session_id' => $validated['session_id'],
                'status' => $validated['status'],
                'is_active' => true,
                'last_activity' => now()
            ]);
        }
        
        \Log::info("✅ [WEBHOOK_CREATE_SESSION] Session created/updated successfully", [
            'shop_id' => $session->shop_id,
            'session_id' => $session->session_id,
            'status' => $session->status
        ]);

        return response()->json([
            'message' => 'Session created successfully',
            'session' => $session
        ]);
    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_CREATE_SESSION] Session creation webhook error", [
            'error_message' => $e->getMessage(),
            'error_code' => $e->getCode(),
            'request_data' => $request->all(),
            'validation_errors' => $e instanceof \Illuminate\Validation\ValidationException ? $e->errors() : null,
            'stack_trace' => $e->getTraceAsString()
        ]);
        
        return response()->json(['error' => 'Session creation failed: ' . $e->getMessage()], 500);
    }
});

// Webhook endpoint for QR code updates
Route::post('webhook/qr-code', function (Request $request) {
    try {
        \Log::info("📥 [WEBHOOK_QR] QR code webhook received", [
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'qr_code' => 'required|string|min:10',
            'qr_code_path' => 'nullable|string',
        ]);

        \Log::info("✅ [WEBHOOK_QR] Validation passed", [
            'shop_id' => $validated['shop_id'],
            'qr_code_length' => strlen($validated['qr_code']),
            'qr_code_path' => $validated['qr_code_path'] ?? 'null',
            'qr_code_preview' => substr($validated['qr_code'], 0, 50) . '...'
        ]);

        $shop = \App\Models\Shop::find($validated['shop_id']);
        $session = \App\Models\WhatsAppSession::where('shop_id', $validated['shop_id'])->first();

        if ($session) {
            \Log::info("🔍 [WEBHOOK_QR] Found existing session", [
                'session_id' => $session->session_id,
                'current_status' => $session->status,
                'current_qr_code' => $session->qr_code ? 'exists' : 'null'
            ]);

            $session->update([
                'qr_code' => $validated['qr_code'],
                'qr_code_path' => $validated['qr_code_path'] ?? null,
            ]);
            
            \Log::info("✅ [WEBHOOK_QR] QR code updated successfully", [
                'shop_id' => $shop->id,
                'session_id' => $session->session_id,
                'new_qr_code_length' => strlen($validated['qr_code'])
            ]);
        } else {
            \Log::warning("⚠️ [WEBHOOK_QR] No WhatsApp session found", [
                'shop_id' => $shop->id,
                'available_sessions' => $shop->whatsappSession ? 'yes' : 'no'
            ]);
        }

        return response()->json(['message' => 'QR code updated successfully']);
    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_QR] QR code webhook error", [
            'error_message' => $e->getMessage(),
            'error_code' => $e->getCode(),
            'request_data' => $request->all(),
            'validation_errors' => $e instanceof \Illuminate\Validation\ValidationException ? $e->errors() : null,
            'stack_trace' => $e->getTraceAsString()
        ]);
        
        return response()->json(['error' => 'QR code update failed: ' + $e->getMessage()], 500);
    }
});

// Webhook endpoint for session status updates
Route::post('webhook/session-status', function (Request $request) {
    try {
        \Log::info("📥 [WEBHOOK_STATUS] Session status webhook received", [
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'status' => 'required|in:connecting,connected,disconnected,error',
            'phone_number' => 'nullable|string',
            'error_message' => 'nullable|string',
        ]);

        \Log::info("✅ [WEBHOOK_STATUS] Validation passed", [
            'shop_id' => $validated['shop_id'],
            'status' => $validated['status'],
            'phone_number' => $validated['phone_number'] ?? 'null',
            'error_message' => $validated['error_message'] ?? 'null'
        ]);

        $shop = \App\Models\Shop::find($validated['shop_id']);
        $session = \App\Models\WhatsAppSession::where('shop_id', $validated['shop_id'])->first();

        if ($session) {
            \Log::info("🔍 [WEBHOOK_STATUS] Found existing session", [
                'session_id' => $session->session_id,
                'old_status' => $session->status,
                'new_status' => $validated['status']
            ]);

            $session->update($validated);
            
            \Log::info("✅ [WEBHOOK_STATUS] Session status updated successfully", [
                'shop_id' => $shop->id,
                'session_id' => $session->session_id,
                'status_change' => $session->getOriginal('status') . ' → ' . $validated['status'],
                'phone_number' => $validated['phone_number'] ?? 'unchanged'
            ]);
        } else {
            \Log::warning("⚠️ [WEBHOOK_STATUS] No WhatsApp session found", [
                'shop_id' => $shop->id,
                'requested_status' => $validated['status']
            ]);
        }

        return response()->json(['message' => 'Session status updated successfully']);
    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_STATUS] Session status webhook error", [
            'error_message' => $e->getMessage(),
            'error_code' => $e->getCode(),
            'request_data' => $request->all(),
            'validation_errors' => $e instanceof \Illuminate\Validation\ValidationException ? $e->errors() : null,
            'stack_trace' => $e->getTraceAsString()
        ]);
        
        return response()->json(['error' => 'Session status update failed: ' + $e->getMessage()], 500);
    }
});

// Webhook endpoint to trigger bot start
Route::post('webhook/start-bot', function (Request $request) {
    $validated = $request->validate([
        'shop_id' => 'required|exists:shops,id',
        'bot_id' => 'required|exists:bots,id',
    ]);

    // In a production environment, this would trigger a queue job
    // For now, we'll just return success
    return response()->json([
        'message' => 'Bot start request received',
        'shop_id' => $validated['shop_id'],
        'bot_id' => $validated['bot_id']
    ]);
});

// Webhook endpoint to reset session status (for debugging)
Route::post('webhook/reset-session', function (Request $request) {
    try {
        \Log::info("🔄 [WEBHOOK_RESET] Reset session webhook received", [
            'request_data' => $request->all()
        ]);

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
        ]);

        $shop = \App\Models\Shop::find($validated['shop_id']);
        if (!$shop) {
            return response()->json(['success' => false, 'message' => 'Shop not found'], 404);
        }

        // Reset session status to 'connecting'
        if ($shop->whatsappSession) {
            $shop->whatsappSession->update([
                'status' => 'connecting',
                'qr_code' => null,
                'phone_number' => null,
                'error_message' => null
            ]);
            
            \Log::info("✅ [WEBHOOK_RESET] Session reset successfully", [
                'shop_id' => $validated['shop_id'],
                'session_id' => $shop->whatsappSession->session_id,
                'new_status' => 'connecting'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Session reset successfully',
            'data' => [
                'shop_id' => $validated['shop_id'],
                'status' => 'connecting'
            ]
        ]);

    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_RESET] Error resetting session", [
            'error' => $e->getMessage(),
            'request_data' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error resetting session: ' . $e->getMessage()
        ], 500);
    }
});

// QR Code file serving endpoint
Route::get('qr-code/{sessionId}/qr.png', function ($sessionId) {
    $filePath = storage_path("qr-codes/{$sessionId}/qr.png");
    
    if (!file_exists($filePath)) {
        abort(404, 'QR code not found');
    }
    
    return response()->file($filePath, [
        'Content-Type' => 'image/png',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0'
    ]);
});

// Public health check endpoint (no authentication required)
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'service' => 'Laravel API',
        'version' => '1.0.0'
    ]);
});

// 🆕 Webhook endpoint to get active shops (NO AUTHENTICATION - for bot auto-restart)
Route::get('webhook/active-shops', function () {
    try {
        // Get shops that have WhatsApp sessions with session IDs (any status)
        $shops = \App\Models\Shop::whereHas('whatsappSession', function ($query) {
            $query->whereNotNull('session_id')
                  ->where('is_active', true);
        })->get();
        
        return response()->json([
            'success' => true,
            'data' => $shops->map(function ($shop) {
                return [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'status' => $shop->status,
                    'whatsapp_session' => [
                        'session_id' => $shop->whatsappSession->session_id,
                        'status' => $shop->whatsappSession->status,
                        'phone_number' => $shop->whatsappSession->phone_number,
                        'has_qr_code' => !empty($shop->whatsappSession->qr_code)
                    ]
                ];
            })
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching active shops',
            'error' => $e->getMessage()
        ], 500);
    }
});

// 🆕 Webhook endpoint to get keywords for a shop (NO AUTHENTICATION - for bot keyword loading)
Route::get('webhook/shop-keywords/{shopId}', function ($shopId) {
    try {
        // Get keywords with their associated messages for the shop's bot
        $keywords = \App\Models\BotKeyword::whereHas('bot', function ($query) use ($shopId) {
            $query->where('shop_id', $shopId);
        })->with(['message'])->get();
        
        $formattedKeywords = $keywords->map(function ($keyword) {
            // Extract the response message from the bot_message
            $responseMessage = 'Thank you for your message!';
            if ($keyword->message) {
                // If message is a string, use it directly
                if (is_string($keyword->message->message)) {
                    $responseMessage = $keyword->message->message;
                } 
                // If message is an array with a text field, use that
                elseif (is_array($keyword->message->message) && isset($keyword->message->message['text'])) {
                    $responseMessage = $keyword->message->message['text'];
                }
                // If message is an object with a text property, use that
                elseif (is_object($keyword->message->message) && isset($keyword->message->message->text)) {
                    $responseMessage = $keyword->message->message->text;
                }
                // Fallback to response_message if available
                elseif (!empty($keyword->response_message)) {
                    $responseMessage = $keyword->response_message;
                }
            }
            
            return [
                'id' => $keyword->id,
                'trigger_word' => $keyword->keyword,
                'response_message' => $responseMessage,
                'message_type' => $keyword->message ? $keyword->message->type : 'text',
                'images' => $keyword->message ? $keyword->message->getImages() : [],
                'is_contain' => $keyword->message ? $keyword->message->is_contain : true, // Get is_contain from message
                'exact_match' => $keyword->message ? !$keyword->message->is_contain : false, // Backward compatibility
                'priority' => 1, // Default priority
                'is_active' => true // Default to active
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $formattedKeywords
        ]);
        
    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_KEYWORDS] Error fetching keywords", [
            'shop_id' => $shopId,
            'error' => $e->getMessage()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Error fetching keywords: ' . $e->getMessage()
        ], 500);
    }
});

// Webhook endpoint to add keywords (for testing)
Route::post('webhook/keyword', function (Request $request) {
    try {
        \Log::info("📝 [WEBHOOK_KEYWORD] Add keyword webhook received", [
            'request_data' => $request->all()
        ]);

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'trigger_word' => 'required|string|max:255',
            'response_message' => 'required|string',
            'is_contain' => 'boolean',
            'exact_match' => 'boolean',
            'priority' => 'integer|min:1|max:10',
            'is_active' => 'boolean'
        ]);

        // Get the shop's first bot
        $bot = \App\Models\Shop::find($validated['shop_id'])->bots()->first();
        if (!$bot) {
            return response()->json([
                'success' => false,
                'message' => 'No bot found for this shop'
            ], 404);
        }

        // Create message first
        $message = \App\Models\BotMessage::create([
            'bot_id' => $bot->id,
            'type' => 'text',
            'message' => ['text' => $validated['response_message']],
            'is_contain' => $validated['is_contain'] ?? true
        ]);

        // Create keyword linked to the message
        $keyword = \App\Models\BotKeyword::create([
            'bot_id' => $bot->id,
            'message_id' => $message->id,
            'keyword' => $validated['trigger_word']
        ]);
        
        \Log::info("✅ [WEBHOOK_KEYWORD] Keyword added successfully", [
            'keyword_id' => $keyword->id,
            'keyword' => $keyword->keyword,
            'bot_id' => $keyword->bot_id,
            'message_id' => $keyword->message_id,
            'is_contain' => $message->is_contain
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Keyword added successfully',
            'data' => $keyword
        ]);

    } catch (\Exception $e) {
        \Log::error("❌ [WEBHOOK_KEYWORD] Error adding keyword", [
            'error' => $e->getMessage(),
            'request_data' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error adding keyword: ' . $e->getMessage()
        ], 500);
    }
});