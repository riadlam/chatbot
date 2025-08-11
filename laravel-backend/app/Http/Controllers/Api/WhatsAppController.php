<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\WhatsAppSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class WhatsAppController extends Controller
{
    public function createSession(Shop $shop): JsonResponse
    {
        // Check if shop already has an active session
        $existingSession = $shop->whatsappSession;
        if ($existingSession && $existingSession->is_active) {
            return response()->json([
                'error' => 'Shop already has an active WhatsApp session',
                'session' => $existingSession
            ], 400);
        }

        // Create new session
        $session = WhatsAppSession::create([
            'shop_id' => $shop->id,
            'session_id' => 'session_' . $shop->id . '_' . Str::random(8),
            'status' => 'connecting',
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'WhatsApp session created successfully',
            'session' => $session
        ], 201);
    }

    public function getSession(Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        if (!$session) {
            return response()->json(['error' => 'No WhatsApp session found'], 404);
        }

        return response()->json($session);
    }

    public function updateQrCode(Request $request, Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        if (!$session) {
            return response()->json(['error' => 'No WhatsApp session found'], 404);
        }

        $validated = $request->validate([
            'qr_code' => 'required|string',
            'qr_code_path' => 'nullable|string',
        ]);

        $session->update($validated);

        return response()->json([
            'message' => 'QR code updated successfully',
            'session' => $session
        ]);
    }

    public function updateSessionStatus(Request $request, Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        if (!$session) {
            return response()->json(['error' => 'No WhatsApp session found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:connecting,connected,disconnected,error',
            'phone_number' => 'nullable|string',
            'error_message' => 'nullable|string',
        ]);

        $session->update($validated);

        return response()->json([
            'message' => 'Session status updated successfully',
            'session' => $session
        ]);
    }

    public function deleteSession(Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        if (!$session) {
            return response()->json(['error' => 'No WhatsApp session found'], 404);
        }

        $session->delete();

        return response()->json(['message' => 'WhatsApp session deleted successfully']);
    }

    public function sendMessage(Request $request, Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        if (!$session || !$session->isConnected()) {
            return response()->json(['error' => 'WhatsApp session not connected'], 400);
        }

        $validated = $request->validate([
            'whatsapp_number' => 'required|string',
            'message' => 'required|string|max:1000',
            'message_type' => 'sometimes|in:text,image,document,audio,video,location',
            'media_url' => 'nullable|string',
        ]);

        // This would typically trigger the Node.js bot to send the message
        // For now, we'll just store it in the database
        $message = $shop->messages()->create([
            'whatsapp_number' => $validated['whatsapp_number'],
            'message_content' => $validated['message'],
            'direction' => 'outbound',
            'message_type' => $validated['message_type'] ?? 'text',
            'media_url' => $validated['media_url'] ?? null,
            'is_bot_response' => false,
        ]);

        return response()->json([
            'message' => 'Message queued for sending',
            'message_id' => $message->id
        ]);
    }

    public function getBotStatus(Shop $shop): JsonResponse
    {
        $session = $shop->whatsappSession;
        
        $status = [
            'has_session' => $session !== null,
            'session_status' => $session?->status ?? 'no_session',
            'is_connected' => $session?->isConnected() ?? false,
            'phone_number' => $session?->phone_number,
            'last_activity' => $session?->last_activity,
            'qr_code_available' => !empty($session?->qr_code),
        ];

        return response()->json($status);
    }
}
