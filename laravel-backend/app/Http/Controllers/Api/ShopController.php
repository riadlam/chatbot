<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ShopController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $shops = $user->shops()->with(['bots', 'whatsappSession'])->paginate(10);
        
        // Add trial information to each shop
        $shopsData = collect($shops->items())->map(function ($shop) {
            $shopData = $shop->toArray();
            $shopData['trial_info'] = [
                'is_active' => $shop->isFreeTrialActive(),
                'days_remaining' => $shop->getFreeTrialDaysRemaining(),
                'started_at' => $shop->free_trial_started,
                'expires_at' => $shop->free_trial_started ? $shop->free_trial_started->addDays(14) : null
            ];
            return $shopData;
        });
        
        return response()->json([
            'success' => true,
            'data' => $shopsData,
            'pagination' => [
                'current_page' => $shops->currentPage(),
                'last_page' => $shops->lastPage(),
                'per_page' => $shops->perPage(),
                'total' => $shops->total(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        $validated['user_id'] = $user->id;
        $validated['status'] = 'active';
        $validated['free_trial_started'] = now();

        $shop = Shop::create($validated);

        // Add trial information to the response
        $shopData = $shop->toArray();
        $shopData['trial_info'] = [
            'is_active' => $shop->isFreeTrialActive(),
            'days_remaining' => $shop->getFreeTrialDaysRemaining(),
            'started_at' => $shop->free_trial_started,
            'expires_at' => $shop->free_trial_started ? $shop->free_trial_started->addDays(14) : null
        ];

        return response()->json([
            'success' => true,
            'message' => 'Shop created successfully',
            'data' => $shopData
        ], 201);
    }

    public function show(Shop $shop): JsonResponse
    {
        $user = auth()->user();
        
        // Check if the shop belongs to the authenticated user
        if ($shop->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        }
        
        $shop->load(['bots', 'whatsappSession']);
        
        // Add trial information to the response
        $shopData = $shop->toArray();
        $shopData['trial_info'] = [
            'is_active' => $shop->isFreeTrialActive(),
            'days_remaining' => $shop->getFreeTrialDaysRemaining(),
            'started_at' => $shop->free_trial_started,
            'expires_at' => $shop->free_trial_started ? $shop->free_trial_started->addDays(14) : null
        ];
        
        return response()->json([
            'success' => true,
            'data' => $shopData
        ]);
    }

    public function update(Request $request, Shop $shop): JsonResponse
    {
        $user = auth()->user();
        
        // Check if the shop belongs to the authenticated user
        if ($shop->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'phone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
            'status' => ['sometimes', Rule::in(['active', 'inactive', 'pending'])],
            'is_verified' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $shop->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shop updated successfully',
            'data' => $shop
        ]);
    }

    public function destroy(Shop $shop): JsonResponse
    {
        $user = auth()->user();
        
        // Check if the shop belongs to the authenticated user
        if ($shop->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        }
        
        $shop->delete();
        return response()->json([
            'success' => true,
            'message' => 'Shop deleted successfully'
        ]);
    }

    public function getQrCode(Shop $shop): JsonResponse
    {
        $user = auth()->user();
        
        // Check if the shop belongs to the authenticated user
        if ($shop->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        }
        
        $session = $shop->whatsappSession;
        
        if (!$session) {
            return response()->json(['error' => 'No WhatsApp session found'], 404);
        }

        return response()->json([
            'qr_code' => $session->qr_code,
            'qr_code_path' => $session->qr_code_path,
            'status' => $session->status,
        ]);
    }

    public function getStats(Shop $shop): JsonResponse
    {
        $user = auth()->user();
        
        // Check if the shop belongs to the authenticated user
        if ($shop->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        }
        
        $stats = [
            'total_bots' => $shop->bots()->count(),
            'active_bots' => $shop->bots()->where('status', 'active')->count(),
            'total_keywords' => 0, // Will be calculated from bots
            'total_messages' => 0, // Will be calculated from bots
            'session_status' => $shop->whatsappSession?->status ?? 'no_session',
        ];

        // Calculate total keywords and messages from all bots
        $shop->bots()->each(function ($bot) use (&$stats) {
            $stats['total_keywords'] += count($bot->getKeywordsArray());
            $stats['total_messages'] += count($bot->getMessagesArray());
        });

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
